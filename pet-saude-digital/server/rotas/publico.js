import { Router } from 'express'
import { atividadesComVagas, config } from '../db.js'

export const publico = Router()

publico.get('/config', async (_req, res, next) => {
  try {
    const cfg = await config()
    res.json({
      taxaBase: Number(cfg.taxa_base),
      inscricoesAbertas: Boolean(cfg.inscricoes_abertas),
      prazoCancelamentoDias: cfg.prazo_cancelamento_dias,
      percentualReembolso: Number(cfg.percentual_reembolso),
      atividades: await atividadesComVagas(),
    })
  } catch (err) {
    next(err)
  }
})
