import { createContext, useContext, useState } from 'react'

const InscricaoCtx = createContext(null)

export function InscricaoProvider({ children }) {
  const [aberto, setAberto] = useState(false)
  return (
    <InscricaoCtx.Provider value={{ aberto, abrir: () => setAberto(true), fechar: () => setAberto(false) }}>
      {children}
    </InscricaoCtx.Provider>
  )
}

export function useInscricao() {
  return useContext(InscricaoCtx)
}
