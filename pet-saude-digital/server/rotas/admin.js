import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { atividadesComVagas, config, montarInscricao, ocupacaoAtividades, q } from '../db.js'
import { cancelarCobranca } from '../lib/asaas.js'
import { enviarComprovante } from '../lib/email.js'
import { erro } from '../lib/validar.js'
import { gerarPixPara } from './participante.js'

export const admin = Router()

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@petsaude.local').toLowerCase()
const ADMIN_SENHA = process.env.ADMIN_PASSWORD || 'admin123'
let hashAdmin

async function senhaAdmin() {
  if (!hashAdmin) hashAdmin = await bcrypt.hash(ADMIN_SENHA, 10)
  return hashAdmin
}

function exigeAdmin(req, _res, next) {
  if (!req.session?.admin) return next(erro(401, 'Área restrita.'))
  next()
}

admin.post('/entrar', async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase()
    const senha = String(req.body.senha || '')
    const ok = email === ADMIN_EMAIL && (await bcrypt.compare(senha, await senhaAdmin()))
    if (!ok) throw erro(401, 'Usuário ou senha incorretos.')
    req.session.admin = true
    delete req.session.participanteId
    res.json({ ok: true, email: ADMIN_EMAIL })
  } catch (err) {
    next(err)
  }
})

admin.post('/sair', (req, res) => {
  delete req.session.admin
  res.json({ ok: true })
})

admin.get('/eu', (req, res) => {
  res.json({ admin: Boolean(req.session?.admin), email: req.session?.admin ? ADMIN_EMAIL : null })
})

admin.get('/resumo', exigeAdmin, async (_req, res, next) => {
  try {
    const rows = await q(
      `SELECT
         COUNT(*) AS total,
         SUM(status='pago') AS pagos,
         SUM(status='aguardando_pix') AS aguardando,
         SUM(status='aguardando_gratuidade') AS gratuidades,
         SUM(status='cancelada') AS cancelados
       FROM inscricoes`,
    )
    res.json({
      total: Number(rows[0].total || 0),
      pagos: Number(rows[0].pagos || 0),
      aguardando: Number(rows[0].aguardando || 0),
      gratuidades: Number(rows[0].gratuidades || 0),
      cancelados: Number(rows[0].cancelados || 0),
    })
  } catch (err) {
    next(err)
  }
})

admin.get('/inscritos', exigeAdmin, async (req, res, next) => {
  try {
    const busca = String(req.query.q || '').trim()
    const status = String(req.query.status || '')
    const pagina = Math.max(1, Number(req.query.pagina || 1))
    const porPagina = 20
    const where = []
    const params = {}

    if (status) {
      where.push('i.status = :status')
      params.status = status
    }
    if (busca) {
      where.push('(p.nome_completo LIKE :b OR p.nome_social LIKE :b OR p.email LIKE :b OR p.cpf LIKE :b OR p.numero LIKE :b)')
      params.b = `%${busca.replace(/\D/g, '').length === 11 ? busca.replace(/\D/g, '') : busca}%`
    }

    const filtro = where.length ? `WHERE ${where.join(' AND ')}` : ''
    const [{ total }] = await q(
      `SELECT COUNT(*) AS total FROM inscricoes i JOIN participantes p ON p.id = i.participante_id ${filtro}`,
      params,
    )
    const lista = await q(
      `SELECT p.id AS participante_id, p.numero, p.nome_completo, p.usa_nome_social, p.nome_social, p.genero,
              p.nascimento, p.cpf, p.email, p.telefone, i.id AS inscricao_id, i.status, i.valor,
              i.gratuidade_motivo, i.credenciado_em, i.cancelada_em, i.created_at
       FROM inscricoes i
       JOIN participantes p ON p.id = i.participante_id
       ${filtro}
       ORDER BY i.id DESC
       LIMIT ${porPagina} OFFSET ${(pagina - 1) * porPagina}`,
      params,
    )

    const ids = lista.map((r) => r.inscricao_id)
    let atividadesPorInsc = {}
    if (ids.length) {
      const ats = await q(
        `SELECT ia.inscricao_id, a.titulo FROM inscricao_atividades ia
         JOIN atividades a ON a.id = ia.atividade_id
         WHERE ia.inscricao_id IN (${ids.map(() => '?').join(',')})`,
        ids,
      )
      atividadesPorInsc = ats.reduce((acc, row) => {
        acc[row.inscricao_id] = acc[row.inscricao_id] || []
        acc[row.inscricao_id].push(row.titulo)
        return acc
      }, {})
    }

    res.json({
      total: Number(total),
      pagina,
      porPagina,
      inscritos: lista.map((r) => ({
        id: r.inscricao_id,
        participanteId: r.participante_id,
        numero: r.numero,
        nome: r.usa_nome_social && r.nome_social ? r.nome_social : r.nome_completo,
        nomeCompleto: r.nome_completo,
        genero: r.genero,
        nascimento: r.nascimento,
        cpf: r.cpf,
        email: r.email,
        telefone: r.telefone,
        status: r.status,
        valor: Number(r.valor),
        gratuidadeMotivo: r.gratuidade_motivo,
        credenciadoEm: r.credenciado_em,
        canceladaEm: r.cancelada_em,
        inscritoEm: r.created_at,
        atividades: atividadesPorInsc[r.inscricao_id] || [],
      })),
    })
  } catch (err) {
    next(err)
  }
})

admin.get('/config', exigeAdmin, async (_req, res, next) => {
  try {
    const cfg = await config()
    res.json({
      taxaBase: Number(cfg.taxa_base),
      contaPix: cfg.conta_pix,
      prazoCancelamentoDias: cfg.prazo_cancelamento_dias,
      percentualReembolso: Number(cfg.percentual_reembolso),
      inscricoesAbertas: Boolean(cfg.inscricoes_abertas),
      atividades: await atividadesComVagas(),
    })
  } catch (err) {
    next(err)
  }
})

admin.put('/config', exigeAdmin, async (req, res, next) => {
  try {
    const taxaBase = Number(req.body.taxaBase)
    const prazo = Number(req.body.prazoCancelamentoDias)
    const reembolso = Number(req.body.percentualReembolso)
    if (Number.isNaN(taxaBase) || taxaBase < 0) throw erro(400, 'Taxa inválida.')
    if (!Number.isInteger(prazo) || prazo < 0 || prazo > 365) throw erro(400, 'Prazo de cancelamento inválido.')
    if (Number.isNaN(reembolso) || reembolso < 0 || reembolso > 100) throw erro(400, 'O reembolso precisa ficar entre 0 e 100.')
    await q(
      `UPDATE config SET taxa_base=?, conta_pix=?, prazo_cancelamento_dias=?, percentual_reembolso=?, inscricoes_abertas=?
       WHERE id=1`,
      [
        taxaBase,
        String(req.body.contaPix || ''),
        Number.isNaN(prazo) ? 7 : prazo,
        Number.isNaN(reembolso) ? 100 : reembolso,
        req.body.inscricoesAbertas === false ? 0 : 1,
      ],
    )
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

const DIAS_EVENTO = {
  segunda: { rotulo: 'Segunda-feira', dataCurta: '19/10' },
  terca: { rotulo: 'Terça-feira', dataCurta: '20/10' },
  quarta: { rotulo: 'Quarta-feira', dataCurta: '21/10' },
  quinta: { rotulo: 'Quinta-feira', dataCurta: '22/10' },
  sexta: { rotulo: 'Sexta-feira', dataCurta: '23/10' },
}
const TIPOS_ATIVIDADE = new Set(['palestra', 'mesa', 'minicurso', 'oficina', 'projetos'])

function idAtividade(titulo) {
  const base = titulo
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40)
  return `${base || 'atividade'}-${Date.now().toString(36)}`
}

admin.post('/atividades', exigeAdmin, async (req, res, next) => {
  try {
    const dia = DIAS_EVENTO[req.body.diaId]
    if (!dia) throw erro(400, 'Escolha um dia do evento.')
    const titulo = String(req.body.titulo || '').trim()
    if (titulo.length < 3) throw erro(400, 'Informe o título da atividade.')
    const tipo = String(req.body.tipo || 'palestra')
    if (!TIPOS_ATIVIDADE.has(tipo)) throw erro(400, 'Tipo de atividade inválido.')
    const preco = Number(req.body.precoExtra ?? 0)
    if (Number.isNaN(preco) || preco < 0) throw erro(400, 'Preço extra inválido.')
    const vagas = req.body.vagas === '' || req.body.vagas == null ? null : Number(req.body.vagas)
    if (vagas != null && (!Number.isInteger(vagas) || vagas < 0)) throw erro(400, 'Vagas inválidas.')
    const [ordem] = await q('SELECT IFNULL(MAX(ordem), 0) + 1 AS prox FROM atividades')
    await q(
      `INSERT INTO atividades (id, dia_id, dia_rotulo, data_curta, tipo, titulo, preco_extra, vagas, ordem)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [idAtividade(titulo), req.body.diaId, dia.rotulo, dia.dataCurta, tipo, titulo, preco, vagas, ordem.prox],
    )
    res.status(201).json({ ok: true, atividades: await atividadesComVagas() })
  } catch (err) {
    next(err)
  }
})

admin.delete('/atividades/:id', exigeAdmin, async (req, res, next) => {
  try {
    const [atividade] = await q('SELECT id, titulo FROM atividades WHERE id=?', [req.params.id])
    if (!atividade) throw erro(404, 'Atividade não encontrada.')
    const [uso] = await q(
      `SELECT COUNT(*) AS total,
              SUM(i.status IN ('aguardando_pix','aguardando_gratuidade','pago')) AS ativas
       FROM inscricao_atividades ia
       JOIN inscricoes i ON i.id = ia.inscricao_id
       WHERE ia.atividade_id = ?`,
      [req.params.id],
    )
    const total = Number(uso.total || 0)
    const ativas = Number(uso.ativas || 0)
    if (total > 0) {
      const detalhe = ativas > 0
        ? `${ativas} ainda em andamento ou confirmada(s)`
        : 'só canceladas, mas o histórico precisa ser mantido'
      throw erro(409, `Não dá para apagar "${atividade.titulo}": ${total} inscrição(ões) usam esta atividade (${detalhe}).`)
    }
    await q('DELETE FROM atividades WHERE id=?', [req.params.id])
    res.json({ ok: true, atividades: await atividadesComVagas() })
  } catch (err) {
    next(err)
  }
})

admin.put('/atividades/:id', exigeAdmin, async (req, res, next) => {
  try {
    const preco = Number(req.body.precoExtra)
    const vagas = req.body.vagas === '' || req.body.vagas == null ? null : Number(req.body.vagas)
    if (Number.isNaN(preco) || preco < 0) throw erro(400, 'Preço extra inválido.')
    if (vagas != null && (!Number.isInteger(vagas) || vagas < 0)) throw erro(400, 'Vagas inválidas.')
    if (vagas != null) {
      const ocup = await ocupacaoAtividades()
      const ocupadas = ocup[req.params.id] || 0
      if (vagas < ocupadas) {
        throw erro(400, `Já existem ${ocupadas} inscrições nesta atividade. Não dá para reduzir as vagas abaixo disso.`)
      }
    }
    const result = await q('UPDATE atividades SET preco_extra=?, vagas=? WHERE id=?', [preco, vagas, req.params.id])
    if (!result.affectedRows) throw erro(404, 'Atividade não encontrada.')
    res.json({ ok: true, atividades: await atividadesComVagas() })
  } catch (err) {
    next(err)
  }
})

admin.post('/inscritos/:id/gratuidade', exigeAdmin, async (req, res, next) => {
  try {
    const [row] = await q(
      'SELECT i.id, i.status, i.participante_id FROM inscricoes i WHERE i.id=?',
      [req.params.id],
    )
    if (!row) throw erro(404, 'Inscrição não encontrada.')
    if (row.status !== 'aguardando_gratuidade') throw erro(400, 'Esta inscrição não espera gratuidade.')

    if (req.body.aprovar) {
      await q(
        `UPDATE inscricoes SET status='pago', valor=0, asaas_payment_id=NULL, pix_payload=NULL, pix_qrcode=NULL WHERE id=?`,
        [row.id],
      )
      const insc = await montarInscricao(row.participante_id)
      await enviarComprovante({
        nome: insc.nome,
        numero: insc.numero,
        valor: 0,
        status: 'pago',
        atividades: insc.atividades.map((a) => a.titulo),
        email: insc.email,
      })
      res.json(insc)
    } else {
      await q('UPDATE inscricoes SET status="aguardando_pix", gratuidade_motivo=NULL WHERE id=?', [row.id])
      res.json(await gerarPixPara(row.participante_id))
    }
  } catch (err) {
    next(err)
  }
})

admin.post('/inscritos/:id/credenciar', exigeAdmin, async (req, res, next) => {
  try {
    const [row] = await q('SELECT id, status FROM inscricoes WHERE id=?', [req.params.id])
    if (!row) throw erro(404, 'Inscrição não encontrada.')
    if (row.status !== 'pago') throw erro(400, 'Só é possível credenciar inscrição paga.')
    await q('UPDATE inscricoes SET credenciado_em=NOW() WHERE id=?', [row.id])
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

admin.post('/inscritos/:id/cancelar', exigeAdmin, async (req, res, next) => {
  try {
    const [row] = await q('SELECT * FROM inscricoes WHERE id=?', [req.params.id])
    if (!row) throw erro(404, 'Inscrição não encontrada.')
    if (row.status === 'cancelada') return res.json({ ok: true })
    if (row.asaas_payment_id) await cancelarCobranca(row.asaas_payment_id)
    await q(
      `UPDATE inscricoes SET status='cancelada', cancelada_em=NOW(), cancelada_por='admin', status_antes_cancelar=?
       WHERE id=?`,
      [row.status, row.id],
    )
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

admin.post('/inscritos/:id/desfazer', exigeAdmin, async (req, res, next) => {
  try {
    const [row] = await q('SELECT * FROM inscricoes WHERE id=?', [req.params.id])
    if (!row) throw erro(404, 'Inscrição não encontrada.')
    if (row.status !== 'cancelada') throw erro(400, 'Só dá para desfazer cancelamento.')
    const volta = row.status_antes_cancelar || 'aguardando_pix'
    if (['aguardando_pix', 'aguardando_gratuidade', 'pago'].includes(volta)) {
      const vins = await q('SELECT atividade_id FROM inscricao_atividades WHERE inscricao_id=?', [row.id])
      const ocup = await ocupacaoAtividades()
      const lista = await q('SELECT id, titulo, vagas FROM atividades')
      for (const v of vins) {
        const a = lista.find((x) => x.id === v.atividade_id)
        if (a && a.vagas != null && (ocup[a.id] || 0) >= Number(a.vagas)) {
          throw erro(409, `Sem vagas para restaurar: ${a.titulo}`)
        }
      }
    }
    await q(
      `UPDATE inscricoes SET status=?, cancelada_em=NULL, cancelada_por=NULL, status_antes_cancelar=NULL WHERE id=?`,
      [volta, row.id],
    )
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

admin.post('/zerar', exigeAdmin, async (_req, res, next) => {
  try {
    const cobrancas = await q('SELECT asaas_payment_id FROM inscricoes WHERE asaas_payment_id IS NOT NULL')
    for (const c of cobrancas) await cancelarCobranca(c.asaas_payment_id)
    await q('DELETE FROM inscricao_atividades')
    await q('DELETE FROM webhook_eventos')
    await q('DELETE FROM inscricoes')
    await q('DELETE FROM participantes')
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})
