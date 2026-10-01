import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import mysql from 'mysql2/promise'
import { ATIVIDADES } from './data/atividades.js'

const RAIZ = dirname(fileURLToPath(import.meta.url))

export const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || 'petsaude',
  password: process.env.MYSQL_PASSWORD || 'petsaude',
  database: process.env.MYSQL_DATABASE || 'petsaude',
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true,
})

export async function q(sql, params) {
  const [rows] = await pool.query(sql, params)
  return rows
}

export async function esperarMysql(tentativas = 40) {
  for (let i = 1; i <= tentativas; i++) {
    try {
      await pool.query('SELECT 1')
      return
    } catch (err) {
      console.log(`[mysql] tentativa ${i}/${tentativas}: ${err.message}`)
      await new Promise((r) => setTimeout(r, 1500))
    }
  }
  throw new Error('MySQL indisponível')
}

export async function iniciarBanco() {
  await esperarMysql()
  const schema = await readFile(join(RAIZ, 'sql', '001_schema.sql'), 'utf8')
  for (const trecho of schema.split(';').map((s) => s.trim()).filter(Boolean)) {
    await pool.query(trecho)
  }
  await pool.query(
    `INSERT IGNORE INTO config (id, taxa_base, conta_pix, prazo_cancelamento_dias, percentual_reembolso, inscricoes_abertas)
     VALUES (1, 15.00, 'Asaas sandbox — configurável no /admin', 7, 100.00, 1)`,
  )

  for (const a of ATIVIDADES) {
    await pool.query(
      `INSERT INTO atividades (id, dia_id, dia_rotulo, data_curta, tipo, titulo, preco_extra, vagas, ordem)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         dia_id = VALUES(dia_id),
         dia_rotulo = VALUES(dia_rotulo),
         data_curta = VALUES(data_curta),
         tipo = VALUES(tipo),
         titulo = VALUES(titulo),
         ordem = VALUES(ordem)`,
      [a.id, a.diaId, a.diaRotulo, a.dataCurta, a.tipo, a.titulo, a.precoExtra, a.vagas, a.ordem],
    )
  }
}

export async function config() {
  const [row] = await q('SELECT * FROM config WHERE id = 1')
  return row
}

export function nomeExibicao(p) {
  return p.usa_nome_social && p.nome_social ? p.nome_social : p.nome_completo
}

const STATUS_OCUPA = `('aguardando_pix','aguardando_gratuidade','pago')`

export async function ocupacaoAtividades() {
  const rows = await q(
    `SELECT ia.atividade_id AS id, COUNT(*) AS ocupadas
     FROM inscricao_atividades ia
     JOIN inscricoes i ON i.id = ia.inscricao_id
     WHERE i.status IN ${STATUS_OCUPA}
     GROUP BY ia.atividade_id`,
  )
  return Object.fromEntries(rows.map((r) => [r.id, Number(r.ocupadas)]))
}

export async function atividadesComVagas() {
  const [lista, ocup] = await Promise.all([q('SELECT * FROM atividades ORDER BY ordem'), ocupacaoAtividades()])
  return lista.map((a) => {
    const ocupadas = ocup[a.id] || 0
    const vagas = a.vagas == null ? null : Number(a.vagas)
    return {
      id: a.id,
      diaId: a.dia_id,
      diaRotulo: a.dia_rotulo,
      dataCurta: a.data_curta,
      tipo: a.tipo,
      titulo: a.titulo,
      precoExtra: Number(a.preco_extra),
      vagas,
      ocupadas,
      esgotada: vagas != null && ocupadas >= vagas,
    }
  })
}

export async function montarInscricao(participanteId) {
  const [p] = await q(
    `SELECT p.*, i.id AS inscricao_id, i.status, i.valor, i.asaas_payment_id, i.pix_payload, i.pix_qrcode,
            i.pix_expira_em, i.gratuidade_motivo, i.credenciado_em, i.cancelada_em, i.created_at AS inscrito_em
     FROM participantes p
     JOIN inscricoes i ON i.participante_id = p.id
     WHERE p.id = ?`,
    [participanteId],
  )
  if (!p) return null
  const ats = await q(
    `SELECT a.id, a.titulo, a.tipo, a.dia_rotulo, a.data_curta, a.preco_extra
     FROM inscricao_atividades ia
     JOIN atividades a ON a.id = ia.atividade_id
     WHERE ia.inscricao_id = ?
     ORDER BY a.ordem`,
    [p.inscricao_id],
  )
  return {
    id: p.inscricao_id,
    numero: p.numero,
    status: p.status,
    valor: Number(p.valor),
    nomeCompleto: p.nome_completo,
    usaNomeSocial: Boolean(p.usa_nome_social),
    nomeSocial: p.nome_social,
    nome: nomeExibicao(p),
    genero: p.genero,
    nascimento: p.nascimento,
    cpf: p.cpf,
    email: p.email,
    telefone: p.telefone,
    pix: p.pix_payload
      ? { payload: p.pix_payload, qrcode: p.pix_qrcode, expiraEm: p.pix_expira_em }
      : null,
    gratuidadeMotivo: p.gratuidade_motivo,
    credenciadoEm: p.credenciado_em,
    canceladaEm: p.cancelada_em,
    inscritoEm: p.inscrito_em,
    atividades: ats.map((a) => ({
      id: a.id,
      titulo: a.titulo,
      tipo: a.tipo,
      diaRotulo: a.dia_rotulo,
      dataCurta: a.data_curta,
      precoExtra: Number(a.preco_extra),
    })),
  }
}
