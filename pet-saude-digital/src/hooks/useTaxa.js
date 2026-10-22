import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { evento } from '../data/evento'

export function formatarTaxa(valor) {
  const n = Number(valor)
  if (Number.isNaN(n)) return evento.taxa
  return `R$ ${n.toFixed(2).replace('.', ',')}`
}

/** Taxa base gravada no admin. Cai no valor estático só enquanto a API não responde. */
export function useTaxa() {
  const [taxa, setTaxa] = useState(evento.taxa)
  useEffect(() => {
    api('/config')
      .then((cfg) => setTaxa(formatarTaxa(cfg.taxaBase)))
      .catch(() => {})
  }, [])
  return taxa
}
