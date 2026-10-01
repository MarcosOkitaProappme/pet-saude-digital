import { Router } from 'express'
import bcrypt from 'bcryptjs'
import {
  atividadesComVagas,
  config,
  montarInscricao,
  nomeExibicao,
  q,
} from '../db.js'
import { cancelarCobranca, criarCobrancaPix, garantirCliente } from '../lib/asaas.js'
import { enviarComprovante } from '../lib/email.js'
import { erro, soDigitos, validarCadastro } from '../lib/validar.js'

export const participante = Router()

function exigeLogin(req, _res, next) {
  if (!req.session?.participanteId) return next(erro(401, 'Entre na sua conta.'))
  next()
}

async function calcularValor(ids) {
  const cfg = await config()
  const lista = await atividadesComVagas()
  let extra = 0
  for (const id of ids) {
    const a = lista.find((x) => x.id === id)
    if (!a) throw erro(400, 'Atividade inválida.')
    if (a.esgotada) throw erro(409, `Sem vagas: ${a.titulo}`)
    extra += a.precoExtra
  }
  return Number(cfg.taxa_base) + extra
}

async function vincularAtividades(inscricaoId, ids) {
  await q('DELETE FROM inscricao_atividades WHERE inscricao_id = ?', [inscricaoId])
  for (const id of ids) {
    await q('INSERT INTO inscricao_atividades (inscricao_id, atividade_id) VALUES (?, ?)', [inscricaoId, id])
  }
}

async function gerarNumero() {
  const [row] = await q('SELECT IFNULL(MAX(CAST(numero AS UNSIGNED)), 0) + 1 AS prox FROM participantes')
  return String(row.prox).padStart(6, '0')
}

participante.get('/email', async (req, res, next) => {
  try {
    const email = String(req.query.email || '').trim().toLowerCase()
    if (!email) return res.json({ existe: false })
    const [row] = await q('SELECT id FROM participantes WHERE email = ?', [email])
    res.json({ existe: Boolean(row) })
  } catch (err) {
    next(err)
  }
})

participante.post('/', async (req, res, next) => {
  try {
    const cfg = await config()
    if (!cfg.inscricoes_abertas) throw erro(403, 'Inscrições encerradas.')
    const dados = validarCadastro(req.body)
    const [jaEmail] = await q('SELECT id FROM participantes WHERE email = ?', [dados.email])
    if (jaEmail) throw erro(409, 'Este e-mail já tem uma inscrição.')
    const [jaCpf] = await q('SELECT id FROM participantes WHERE cpf = ?', [dados.cpf])
    if (jaCpf) throw erro(409, 'Este CPF já tem uma inscrição.')

    const valor = await calcularValor(dados.atividades)
    const hash = await bcrypt.hash(dados.senha, 10)
    const numero = await gerarNumero()

    const result = await q(
      `INSERT INTO participantes
        (numero, nome_completo, usa_nome_social, nome_social, genero, nascimento, cpf, email, telefone, senha_hash, aceite_lgpd)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        numero,
        dados.nomeCompleto,
        dados.usaNomeSocial ? 1 : 0,
        dados.nomeSocial,
        dados.genero,
        dados.nascimento,
        dados.cpf,
        dados.email,
        dados.telefone,
        hash,
      ],
    )
    const participanteId = result.insertId
    const insc = await q(
      'INSERT INTO inscricoes (participante_id, status, valor) VALUES (?, ?, ?)',
      [participanteId, 'aguardando_pix', valor],
    )
    await vincularAtividades(insc.insertId, dados.atividades)
    req.session.participanteId = participanteId
    res.status(201).json(await montarInscricao(participanteId))
  } catch (err) {
    next(err)
  }
})

participante.post('/entrar', async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase()
    const senha = String(req.body.senha || '')
    const [p] = await q('SELECT id, senha_hash FROM participantes WHERE email = ?', [email])
    if (!p || !(await bcrypt.compare(senha, p.senha_hash))) throw erro(401, 'E-mail ou senha incorretos.')
    req.session.participanteId = p.id
    delete req.session.admin
    res.json(await montarInscricao(p.id))
  } catch (err) {
    next(err)
  }
})

participante.post('/sair', (req, res) => {
  delete req.session.participanteId
  res.json({ ok: true })
})

participante.get('/eu', exigeLogin, async (req, res, next) => {
  try {
    res.json(await montarInscricao(req.session.participanteId))
  } catch (err) {
    next(err)
  }
})

participante.patch('/eu', exigeLogin, async (req, res, next) => {
  try {
    const dados = validarCadastro(
      { ...req.body, aceiteLgpd: true, senha: 'xxxxxxxx', senha2: 'xxxxxxxx' },
      { senhaObrigatoria: false },
    )
    const atual = await montarInscricao(req.session.participanteId)
    if (!atual || atual.status === 'cancelada') throw erro(400, 'Inscrição cancelada não pode ser editada.')
    if (dados.email !== atual.email || dados.cpf !== atual.cpf) {
      throw erro(400, 'E-mail e CPF não podem ser alterados. Fale com a organização.')
    }

    const valor = await calcularValor(dados.atividades)
    await q(
      `UPDATE participantes SET nome_completo=?, usa_nome_social=?, nome_social=?, genero=?, nascimento=?, telefone=?
       WHERE id=?`,
      [
        dados.nomeCompleto,
        dados.usaNomeSocial ? 1 : 0,
        dados.nomeSocial,
        dados.genero,
        dados.nascimento,
        dados.telefone,
        req.session.participanteId,
      ],
    )
    await q('UPDATE inscricoes SET valor=? WHERE id=?', [valor, atual.id])
    await vincularAtividades(atual.id, dados.atividades)
    res.json(await montarInscricao(req.session.participanteId))
  } catch (err) {
    next(err)
  }
})

async function gerarPixPara(participanteId) {
  const insc = await montarInscricao(participanteId)
  if (!insc) throw erro(404, 'Inscrição não encontrada.')
  if (insc.status === 'pago') return insc
  if (insc.status === 'cancelada') throw erro(400, 'Inscrição cancelada.')

  const [p] = await q('SELECT * FROM participantes WHERE id = ?', [participanteId])
  const customerId = await garantirCliente({
    nome: nomeExibicao(p),
    email: p.email,
    cpf: p.cpf,
    telefone: p.telefone,
    asaasCustomerId: p.asaas_customer_id,
  })
  if (customerId && customerId !== p.asaas_customer_id) {
    await q('UPDATE participantes SET asaas_customer_id=? WHERE id=?', [customerId, p.id])
  }

  const [cobranca] = await q('SELECT asaas_payment_id FROM inscricoes WHERE id=?', [insc.id])
  if (cobranca?.asaas_payment_id) await cancelarCobranca(cobranca.asaas_payment_id)

  const vencimento = new Date()
  vencimento.setDate(vencimento.getDate() + 2)
  const pix = await criarCobrancaPix({
    customerId,
    valor: insc.valor,
    inscricaoId: insc.id,
    vencimento: vencimento.toISOString().slice(0, 10),
  })

  await q(
    `UPDATE inscricoes
     SET status='aguardando_pix', asaas_payment_id=?, pix_payload=?, pix_qrcode=?, pix_expira_em=?, gratuidade_motivo=NULL
     WHERE id=?`,
    [pix.paymentId, pix.payload, pix.qrcode, pix.expiraEm, insc.id],
  )
  return montarInscricao(participanteId)
}

participante.post('/pix', exigeLogin, async (req, res, next) => {
  try {
    res.json(await gerarPixPara(req.session.participanteId))
  } catch (err) {
    next(err)
  }
})

participante.post('/gratuidade', exigeLogin, async (req, res, next) => {
  try {
    const motivo = String(req.body.motivo || '').trim()
    if (motivo.length < 8) throw erro(400, 'Explique o pedido de gratuidade (mínimo 8 caracteres).')
    const insc = await montarInscricao(req.session.participanteId)
    if (!insc) throw erro(404, 'Inscrição não encontrada.')
    if (insc.status === 'pago') throw erro(400, 'Inscrição já está paga.')
    if (insc.status === 'cancelada') throw erro(400, 'Inscrição cancelada.')
    const [row] = await q('SELECT asaas_payment_id FROM inscricoes WHERE id=?', [insc.id])
    if (row?.asaas_payment_id) await cancelarCobranca(row.asaas_payment_id)
    await q(
      `UPDATE inscricoes SET status='aguardando_gratuidade', gratuidade_motivo=?, asaas_payment_id=NULL, pix_payload=NULL, pix_qrcode=NULL
       WHERE id=?`,
      [motivo, insc.id],
    )
    res.json(await montarInscricao(req.session.participanteId))
  } catch (err) {
    next(err)
  }
})

participante.post('/cancelar', exigeLogin, async (req, res, next) => {
  try {
    const insc = await montarInscricao(req.session.participanteId)
    if (!insc) throw erro(404, 'Inscrição não encontrada.')
    if (insc.status === 'cancelada') return res.json(insc)
    const [row] = await q('SELECT asaas_payment_id FROM inscricoes WHERE id=?', [insc.id])
    if (row?.asaas_payment_id) await cancelarCobranca(row.asaas_payment_id)
    await q(
      `UPDATE inscricoes
       SET status='cancelada', cancelada_em=NOW(), cancelada_por='participante', status_antes_cancelar=?
       WHERE id=?`,
      [insc.status, insc.id],
    )
    res.json(await montarInscricao(req.session.participanteId))
  } catch (err) {
    next(err)
  }
})

participante.post('/reenviar', exigeLogin, async (req, res, next) => {
  try {
    const insc = await montarInscricao(req.session.participanteId)
    if (!insc || insc.status !== 'pago') throw erro(400, 'Só reenviamos comprovante de inscrição confirmada.')
    await enviarComprovante({
      nome: insc.nome,
      numero: insc.numero,
      valor: insc.valor,
      status: insc.status,
      atividades: insc.atividades.map((a) => a.titulo),
      email: insc.email,
    })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

export { gerarPixPara }
