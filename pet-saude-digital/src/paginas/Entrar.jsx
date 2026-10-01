import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { useSessao } from '../contexto/Sessao'
import { useInscricao } from '../contexto/Inscricao'
import Campo, { classeInput } from '../components/inscricao/Campo'

export default function Entrar() {
  const nav = useNavigate()
  const { setParticipante } = useSessao()
  const { abrir } = useInscricao()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function enviar(e) {
    e.preventDefault()
    setEnviando(true)
    setErro('')
    try {
      const insc = await api('/inscricoes/entrar', { method: 'POST', body: { email, senha } })
      setParticipante(insc)
      nav('/minha-inscricao')
    } catch (err) {
      setErro(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="grid min-h-full place-items-center bg-pet-paper px-4">
      <form onSubmit={enviar} className="w-full max-w-sm border border-pet-navy/15 bg-white p-6">
        <p className="label text-pet-navy/40">Área do participante</p>
        <h1 className="mt-1 text-xl font-semibold tracking-display text-pet-deep">Entrar</h1>
        {erro && <p className="mt-3 text-[13px] text-pet-orange">{erro}</p>}
        <div className="mt-4">
          <Campo rotulo="E-mail">
            <input type="email" className={classeInput} value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Campo>
          <Campo rotulo="Senha">
            <input type="password" className={classeInput} value={senha} onChange={(e) => setSenha(e.target.value)} required />
          </Campo>
        </div>
        <button disabled={enviando} className="w-full bg-pet-navy py-2.5 text-[13px] font-semibold text-white">
          Entrar
        </button>
        <div className="mt-5 border-t border-pet-navy/10 pt-4 text-center text-[13px] text-pet-navy/70">
          Ainda não se inscreveu?
          <button
            type="button"
            onClick={() => {
              abrir()
              nav('/')
            }}
            className="mt-2 block w-full border border-pet-navy/20 py-2 font-semibold text-pet-navy"
          >
            Fazer inscrição
          </button>
        </div>
        <Link to="/" className="mt-4 block text-center text-[12px] text-pet-navy/50">
          Voltar ao site
        </Link>
      </form>
    </div>
  )
}
