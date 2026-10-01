import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../lib/api'

const SessaoCtx = createContext(null)

export function SessaoProvider({ children }) {
  const [participante, setParticipante] = useState(null)
  const [admin, setAdmin] = useState(null)
  const [pronto, setPronto] = useState(false)

  async function recarregar() {
    try {
      const eu = await api('/inscricoes/eu')
      setParticipante(eu)
    } catch {
      setParticipante(null)
    }
    try {
      const a = await api('/admin/eu')
      setAdmin(a.admin ? a : null)
    } catch {
      setAdmin(null)
    }
    setPronto(true)
  }

  useEffect(() => {
    recarregar()
  }, [])

  return (
    <SessaoCtx.Provider value={{ participante, admin, pronto, setParticipante, recarregar }}>
      {children}
    </SessaoCtx.Provider>
  )
}

export function useSessao() {
  return useContext(SessaoCtx)
}
