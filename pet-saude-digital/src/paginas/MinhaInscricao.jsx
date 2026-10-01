import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, mascaraCpf, mascaraTel, rotuloStatus } from '../lib/api'
import { useSessao } from '../contexto/Sessao'
import AvisoDocumento from '../components/inscricao/AvisoDocumento'
import Campo, { classeInput } from '../components/inscricao/Campo'

export default function MinhaInscricao() {
  const nav = useNavigate()
  const { participante, setParticipante, pronto } = useSessao()
  const [editando, setEditando] = useState(false)
  const [confirmar, setConfirmar] = useState(false)
  const [form, setForm] = useState(null)
  const [atividades, setAtividades] = useState([])
  const [erro, setErro] = useState('')
  const [ok, setOk] = useState('')
  const [config, setConfig] = useState(null)

  useEffect(() => {
    if (pronto && !participante) nav('/entrar')
  }, [pronto, participante, nav])

  useEffect(() => {
    api('/config').then(setConfig).catch(() => {})
  }, [])

  useEffect(() => {
    if (!participante) return
    setForm({
      nomeCompleto: participante.nomeCompleto,
      usaNomeSocial: participante.usaNomeSocial,
      nomeSocial: participante.nomeSocial || '',
      genero: participante.genero,
      nascimento: String(participante.nascimento).slice(0, 10),
      cpf: participante.cpf,
      email: participante.email,
      telefone: mascaraTel(participante.telefone),
      atividades: participante.atividades.map((a) => a.id),
      aceiteLgpd: true,
      senha: 'xxxxxxxx',
      senha2: 'xxxxxxxx',
    })
    setAtividades(participante.atividades)
  }, [participante])

  if (!participante || !form) return null

  async function salvar(e) {
    e.preventDefault()
    setErro('')
    try {
      const atual = await api('/inscricoes/eu', { method: 'PATCH', body: form })
      setParticipante(atual)
      setEditando(false)
      setOk('Dados atualizados.')
    } catch (err) {
      setErro(err.message)
    }
  }

  async function cancelar() {
    try {
      const atual = await api('/inscricoes/cancelar', { method: 'POST' })
      setParticipante(atual)
      setConfirmar(false)
    } catch (err) {
      setErro(err.message)
    }
  }

  async function sair() {
    await api('/inscricoes/sair', { method: 'POST' })
    setParticipante(null)
    nav('/')
  }

  const reembolso = config ? Number(config.percentualReembolso) : 100

  return (
    <div className="min-h-full bg-pet-paper">
      <header className="flex items-center justify-between bg-pet-navy px-4 py-3 text-white">
        <Link to="/" className="text-[14px] font-semibold">PET Saúde Digital</Link>
        <button type="button" onClick={sair} className="text-[13px] text-white/70">Sair</button>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6">
        <h1 className="text-2xl font-semibold tracking-display text-pet-deep">Minha inscrição</h1>
        <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-semibold uppercase">
          <span className={`px-2 py-0.5 ${participante.status === 'pago' ? 'bg-pet-navy text-white' : 'border border-pet-navy/30 text-pet-navy'}`}>
            {rotuloStatus[participante.status]}
          </span>
          <span className="border border-pet-navy/20 px-2 py-0.5 text-pet-navy">Nº {participante.numero}</span>
        </div>
        {ok && <p className="mt-3 text-[13px] text-pet-navy">{ok}</p>}
        {erro && <p className="mt-3 text-[13px] text-pet-orange">{erro}</p>}

        {!editando ? (
          <>
            <section className="mt-5 border border-pet-navy/15 bg-white p-4 text-[13.5px] text-pet-navy">
              <p className="label text-pet-navy/40">Meus dados</p>
              <p className="mt-2 font-semibold text-pet-deep">{participante.nome}</p>
              <p>{participante.email}</p>
              <p>{mascaraTel(participante.telefone)} · CPF {mascaraCpf(participante.cpf)}</p>
            </section>
            <section className="mt-3 border border-pet-navy/15 bg-white p-4 text-[13.5px] text-pet-navy">
              <p className="label text-pet-navy/40">Palestras de interesse ({atividades.length})</p>
              <ul className="mt-2 space-y-1">
                {atividades.map((a) => (
                  <li key={a.id}>{a.titulo}</li>
                ))}
                {!atividades.length && <li>Nenhuma selecionada</li>}
              </ul>
            </section>
            <div className="mt-4">
              <AvisoDocumento />
            </div>
            {participante.status === 'aguardando_pix' && (
              <p className="mt-3 text-[13px] text-pet-navy/70">
                Valor: R$ {Number(participante.valor).toFixed(2).replace('.', ',')} — use o código Pix da inscrição.
              </p>
            )}
            {participante.status !== 'cancelada' && (
              <button type="button" onClick={() => setEditando(true)} className="mt-4 w-full bg-pet-navy py-2.5 text-[13px] font-semibold text-white">
                Corrigir dados
              </button>
            )}
            {participante.status === 'pago' && (
              <button
                type="button"
                className="mt-2 w-full border border-pet-navy/20 py-2.5 text-[13px] font-semibold text-pet-navy"
                onClick={() => api('/inscricoes/reenviar', { method: 'POST' }).then(() => setOk('Comprovante reenviado (ou gravado em outbox).'))}
              >
                Reenviar comprovante
              </button>
            )}
            {participante.status !== 'cancelada' && (
              <button type="button" onClick={() => setConfirmar(true)} className="mt-2 w-full border border-pet-orange py-2.5 text-[13px] font-semibold text-pet-orange">
                Cancelar inscrição
              </button>
            )}
          </>
        ) : (
          <form onSubmit={salvar} className="mt-5">
            <Campo rotulo="Nome completo">
              <input className={classeInput} value={form.nomeCompleto} onChange={(e) => setForm({ ...form, nomeCompleto: e.target.value })} />
            </Campo>
            <label className="mb-3 flex items-center gap-2 text-[13px]">
              <input type="checkbox" checked={form.usaNomeSocial} onChange={(e) => setForm({ ...form, usaNomeSocial: e.target.checked })} />
              Quero usar nome social
            </label>
            {form.usaNomeSocial && (
              <Campo rotulo="Nome social">
                <input className={classeInput} value={form.nomeSocial} onChange={(e) => setForm({ ...form, nomeSocial: e.target.value })} />
              </Campo>
            )}
            <Campo rotulo="Gênero">
              <select className={classeInput} value={form.genero} onChange={(e) => setForm({ ...form, genero: e.target.value })}>
                {['Feminino', 'Masculino', 'Não binário', 'Outro', 'Prefiro não informar'].map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </Campo>
            <Campo rotulo="Telefone">
              <input className={classeInput} value={form.telefone} onChange={(e) => setForm({ ...form, telefone: mascaraTel(e.target.value) })} />
            </Campo>
            <Campo rotulo="E-mail" hint="Para mudar, fale com a organização">
              <input className={`${classeInput} bg-pet-ice`} value={form.email} disabled />
            </Campo>
            <Campo rotulo="CPF" hint="Para mudar, fale com a organização">
              <input className={`${classeInput} bg-pet-ice`} value={mascaraCpf(form.cpf)} disabled />
            </Campo>
            <p className="mb-2 text-[12px] font-semibold text-pet-navy">Atividades</p>
            {(config?.atividades || []).map((a) => (
              <label key={a.id} className="mb-1 flex gap-2 text-[13px] text-pet-navy">
                <input
                  type="checkbox"
                  checked={form.atividades.includes(a.id)}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      atividades: e.target.checked
                        ? [...form.atividades, a.id]
                        : form.atividades.filter((id) => id !== a.id),
                    })
                  }
                />
                {a.titulo}
              </label>
            ))}
            <button className="mt-4 w-full bg-pet-orange py-2.5 text-[13px] font-semibold text-white">Salvar alterações</button>
            <button type="button" onClick={() => setEditando(false)} className="mt-2 w-full py-2 text-[13px] text-pet-navy/60">
              Voltar
            </button>
          </form>
        )}
      </main>

      {confirmar && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-pet-ink/50 p-4">
          <div className="w-full max-w-sm bg-white p-5">
            <p className="font-semibold text-pet-deep">Cancelar inscrição?</p>
            <p className="mt-2 text-[13px] text-pet-navy/70">
              Sua vaga será liberada. A taxa de R$ {Number(participante.valor).toFixed(2).replace('.', ',')}{' '}
              {reembolso > 0 ? `tem reembolso de ${reembolso}%.` : 'não é devolvida.'}
            </p>
            <button type="button" onClick={cancelar} className="mt-4 w-full bg-pet-orange py-2.5 text-[13px] font-semibold text-white">
              Sim, cancelar
            </button>
            <button type="button" onClick={() => setConfirmar(false)} className="mt-2 w-full border border-pet-navy/20 py-2 text-[13px] font-semibold text-pet-navy">
              Manter inscrição
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
