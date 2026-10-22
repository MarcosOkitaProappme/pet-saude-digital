import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, mascaraCpf, mascaraTel, rotuloStatus } from '../lib/api'
import { useSessao } from '../contexto/Sessao'
import Campo, { classeInput } from '../components/inscricao/Campo'

const ABAS = [
  { id: 'inscritos', rotulo: 'Inscritos' },
  { id: 'gratuidades', rotulo: 'Gratuidade' },
  { id: 'atividades', rotulo: 'Atividades' },
  { id: 'config', rotulo: 'Config' },
]

const DIAS = [
  { id: 'segunda', rotulo: 'Segunda-feira', data: '19/10' },
  { id: 'terca', rotulo: 'Terça-feira', data: '20/10' },
  { id: 'quarta', rotulo: 'Quarta-feira', data: '21/10' },
  { id: 'quinta', rotulo: 'Quinta-feira', data: '22/10' },
  { id: 'sexta', rotulo: 'Sexta-feira', data: '23/10' },
]

const TIPOS = [
  { id: 'palestra', rotulo: 'Palestra' },
  { id: 'mesa', rotulo: 'Mesa' },
  { id: 'minicurso', rotulo: 'Minicurso' },
  { id: 'oficina', rotulo: 'Oficina' },
  { id: 'projetos', rotulo: 'Projetos' },
]

export default function Admin() {
  const { admin, recarregar } = useSessao()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [aba, setAba] = useState('inscritos')
  const [resumo, setResumo] = useState(null)
  const [lista, setLista] = useState({ inscritos: [], total: 0, pagina: 1 })
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState('')
  const [cfg, setCfg] = useState(null)
  const [detalhe, setDetalhe] = useState(null)

  async function entrar(e) {
    e.preventDefault()
    setErro('')
    try {
      await api('/admin/entrar', { method: 'POST', body: { email, senha } })
      await recarregar()
    } catch (err) {
      setErro(err.message)
    }
  }

  async function carregarLista(pagina = 1) {
    const qs = new URLSearchParams({ q: busca, status: filtro, pagina })
    const data = await api(`/admin/inscritos?${qs}`)
    setLista(data)
    setResumo(await api('/admin/resumo'))
  }

  async function carregarCfg() {
    setCfg(await api('/admin/config'))
  }

  useEffect(() => {
    if (!admin) return
    if (aba === 'gratuidades') {
      api('/admin/inscritos?status=aguardando_gratuidade&pagina=1').then(setLista).catch(() => {})
    } else if (aba === 'inscritos') {
      carregarLista(1).catch(() => {})
    }
    carregarCfg().catch(() => {})
    api('/admin/resumo').then(setResumo).catch(() => {})
  }, [admin, aba])

  if (!admin) {
    return (
      <div className="grid min-h-full place-items-center bg-pet-ice px-4">
        <form onSubmit={entrar} className="w-full max-w-sm border border-pet-navy/15 bg-white p-6">
          <p className="label text-center text-pet-navy/40">Área restrita</p>
          <h1 className="mt-1 text-center text-lg font-semibold text-pet-deep">Administração</h1>
          {erro && <p className="mt-3 text-[13px] text-pet-orange">{erro}</p>}
          <div className="mt-4">
            <Campo rotulo="Usuário ou e-mail">
              <input className={classeInput} value={email} onChange={(e) => setEmail(e.target.value)} />
            </Campo>
            <Campo rotulo="Senha">
              <input type="password" className={classeInput} value={senha} onChange={(e) => setSenha(e.target.value)} />
            </Campo>
          </div>
          <button className="w-full bg-pet-navy py-2.5 text-[13px] font-semibold text-white">Entrar</button>
        </form>
      </div>
    )
  }

  const gratuidades = lista.inscritos.filter((i) => i.status === 'aguardando_gratuidade')

  return (
    <div className="min-h-full bg-pet-paper">
      <header className="flex flex-wrap items-center justify-between gap-3 bg-pet-navy px-4 py-3 text-white">
        <p className="text-[14px] font-semibold">Inscritos · {resumo?.total ?? '—'}</p>
        <div className="flex gap-3 text-[13px]">
          <span className="text-white/50">admin</span>
          <button
            type="button"
            onClick={async () => {
              await api('/admin/sair', { method: 'POST' })
              recarregar()
            }}
          >
            Sair
          </button>
        </div>
      </header>

      <nav className="flex gap-px bg-pet-navy/10">
        {ABAS.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => setAba(a.id)}
            className={`flex-1 py-2 text-[12px] font-semibold ${aba === a.id ? 'bg-white text-pet-navy' : 'text-pet-navy/60'}`}
          >
            {a.rotulo}
          </button>
        ))}
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-5">
        {erro && <p className="mb-3 text-[13px] text-pet-orange">{erro}</p>}
        {aba === 'inscritos' && (
          <>
            {resumo && (
              <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Kpi n={resumo.total} t="inscritos" />
                <Kpi n={resumo.pagos} t="pagos" />
                <Kpi n={resumo.aguardando} t="aguardando Pix" />
                <Kpi n={resumo.cancelados} t="cancelados" />
              </div>
            )}
            <div className="mb-3 flex flex-wrap gap-2">
              <input
                className={`${classeInput} max-w-sm`}
                placeholder="Buscar por nome, e-mail ou CPF"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && carregarLista(1)}
              />
              <select className={`${classeInput} max-w-[180px]`} value={filtro} onChange={(e) => setFiltro(e.target.value)}>
                <option value="">Status: todos</option>
                {Object.entries(rotuloStatus).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
              <button type="button" onClick={() => carregarLista(1)} className="bg-pet-navy px-3 text-[13px] font-semibold text-white">
                Filtrar
              </button>
            </div>

            <div className="hidden overflow-x-auto border border-pet-navy/10 bg-white md:block">
              <table className="w-full text-left text-[12.5px]">
                <thead className="bg-pet-ice text-[10px] uppercase tracking-label text-pet-navy/50">
                  <tr>
                    {['Nº', 'Nome', 'E-mail', 'CPF', 'Telefone', 'Gênero', 'Palestras', 'Pagamento', 'Ações'].map((h) => (
                      <th key={h} className="px-2 py-2">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {lista.inscritos.map((i) => (
                    <tr key={i.id} className="border-t border-pet-navy/8">
                      <td className="px-2 py-2 font-semibold">{i.numero}</td>
                      <td className="px-2 py-2">{i.nome}</td>
                      <td className="px-2 py-2">{i.email}</td>
                      <td className="px-2 py-2">{mascaraCpf(i.cpf)}</td>
                      <td className="px-2 py-2">{mascaraTel(i.telefone)}</td>
                      <td className="px-2 py-2">{i.genero}</td>
                      <td className="px-2 py-2">{i.atividades.length}</td>
                      <td className="px-2 py-2">{rotuloStatus[i.status]}</td>
                      <td className="px-2 py-2">
                        <Acoes insc={i} aoAtualizar={() => carregarLista(lista.pagina)} aoVer={setDetalhe} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-2 md:hidden">
              {lista.inscritos.map((i) => (
                <button
                  key={i.id}
                  type="button"
                  onClick={() => setDetalhe(i)}
                  className="flex w-full items-center justify-between border border-pet-navy/10 bg-white p-3 text-left"
                >
                  <div>
                    <p className="font-semibold text-pet-deep">{i.nome}</p>
                    <p className="text-[12px] text-pet-navy/60">{i.email}</p>
                  </div>
                  <span className="text-[11px] uppercase text-pet-navy/70">{rotuloStatus[i.status]}</span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-[12px] text-pet-navy/45">
              Mostrando {lista.inscritos.length} de {lista.total}
            </p>
          </>
        )}

        {aba === 'gratuidades' && (
          <div className="space-y-3">
            {gratuidades.length === 0 && <p className="text-[13px] text-pet-navy/60">Nenhum pedido pendente nesta página. Use o filtro “Aguardando gratuidade”.</p>}
            {(filtro === 'aguardando_gratuidade' ? lista.inscritos : gratuidades).map((i) => (
              <div key={i.id} className="border border-pet-navy/10 bg-white p-4">
                <p className="font-semibold text-pet-deep">{i.nome} · {i.numero}</p>
                <p className="mt-1 text-[13px] text-pet-navy/70">{i.gratuidadeMotivo}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    className="bg-pet-navy px-3 py-1.5 text-[12px] font-semibold text-white"
                    onClick={async () => {
                      await api(`/admin/inscritos/${i.id}/gratuidade`, { method: 'POST', body: { aprovar: true } })
                      carregarLista(1)
                    }}
                  >
                    Aprovar
                  </button>
                  <button
                    type="button"
                    className="border border-pet-navy/20 px-3 py-1.5 text-[12px] font-semibold text-pet-navy"
                    onClick={async () => {
                      await api(`/admin/inscritos/${i.id}/gratuidade`, { method: 'POST', body: { aprovar: false } })
                      carregarLista(1)
                    }}
                  >
                    Recusar e gerar Pix
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {aba === 'atividades' && cfg && (
          <div className="space-y-6">
            {DIAS.map((dia) => {
              const doDia = cfg.atividades.filter((a) => a.diaId === dia.id)
              return (
                <section key={dia.id}>
                  <h2 className="mb-2 text-[14px] font-semibold text-pet-deep">
                    {dia.rotulo} <span className="font-normal text-pet-navy/45">{dia.data}</span>
                  </h2>
                  <div className="space-y-2">
                    {doDia.length === 0 && (
                      <p className="text-[13px] text-pet-navy/50">Nenhuma atividade neste dia.</p>
                    )}
                    {doDia.map((a) => (
                      <form
                        key={a.id}
                        className="grid items-end gap-2 border border-pet-navy/10 bg-white p-3 sm:grid-cols-[1fr_90px_90px_80px_80px]"
                        onSubmit={async (e) => {
                          e.preventDefault()
                          setErro('')
                          const fd = new FormData(e.target)
                          try {
                            await api(`/admin/atividades/${a.id}`, {
                              method: 'PUT',
                              body: { precoExtra: fd.get('preco'), vagas: fd.get('vagas') },
                            })
                            carregarCfg()
                          } catch (err) {
                            setErro(err.message)
                          }
                        }}
                      >
                        <p className="text-[13px] text-pet-navy">
                          {a.titulo}
                          <span className="block text-[11px] uppercase text-pet-navy/45">
                            {a.tipo} · {a.ocupadas} ocupadas{a.vagas != null ? ` / ${a.vagas}` : ''}
                          </span>
                        </p>
                        <label className="text-[11px] text-pet-navy/50">
                          Extra
                          <input name="preco" defaultValue={a.precoExtra} className={classeInput} />
                        </label>
                        <label className="text-[11px] text-pet-navy/50">
                          Vagas
                          <input name="vagas" defaultValue={a.vagas ?? ''} className={classeInput} />
                        </label>
                        <button className="bg-pet-navy py-2 text-[12px] font-semibold text-white">Salvar</button>
                        <button
                          type="button"
                          className="border border-pet-orange py-2 text-[12px] font-semibold text-pet-orange"
                          onClick={async () => {
                            if (!confirm(`Apagar "${a.titulo}"?`)) return
                            setErro('')
                            try {
                              await api(`/admin/atividades/${a.id}`, { method: 'DELETE' })
                              carregarCfg()
                            } catch (err) {
                              setErro(err.message)
                            }
                          }}
                        >
                          Apagar
                        </button>
                      </form>
                    ))}
                  </div>
                  <NovaAtividade diaId={dia.id} aoCriar={carregarCfg} />
                </section>
              )
            })}
          </div>
        )}

        {aba === 'config' && cfg && (
          <form
            className="max-w-md space-y-3"
            onSubmit={async (e) => {
              e.preventDefault()
              setErro('')
              try {
                await api('/admin/config', { method: 'PUT', body: cfg })
                alert('Configuração salva.')
              } catch (err) {
                setErro(err.message)
              }
            }}
          >
            <Campo rotulo="Taxa base (R$)">
              <input className={classeInput} type="number" step="0.01" value={cfg.taxaBase} onChange={(e) => setCfg({ ...cfg, taxaBase: Number(e.target.value) })} />
            </Campo>
            <Campo rotulo="Conta / info Pix">
              <input className={classeInput} value={cfg.contaPix} onChange={(e) => setCfg({ ...cfg, contaPix: e.target.value })} />
            </Campo>
            <Campo rotulo="Prazo de cancelamento (dias)">
              <input className={classeInput} type="number" value={cfg.prazoCancelamentoDias} onChange={(e) => setCfg({ ...cfg, prazoCancelamentoDias: Number(e.target.value) })} />
            </Campo>
            <Campo rotulo="% de reembolso">
              <input className={classeInput} type="number" value={cfg.percentualReembolso} onChange={(e) => setCfg({ ...cfg, percentualReembolso: Number(e.target.value) })} />
            </Campo>
            <label className="flex items-center gap-2 text-[13px]">
              <input type="checkbox" checked={cfg.inscricoesAbertas} onChange={(e) => setCfg({ ...cfg, inscricoesAbertas: e.target.checked })} />
              Inscrições abertas
            </label>
            <button className="bg-pet-navy px-4 py-2.5 text-[13px] font-semibold text-white">Salvar</button>
            <button
              type="button"
              className="ml-2 border border-pet-orange px-4 py-2.5 text-[13px] font-semibold text-pet-orange"
              onClick={async () => {
                if (!confirm('Apagar todos os inscritos?')) return
                await api('/admin/zerar', { method: 'POST' })
                carregarLista(1)
              }}
            >
              Zerar evento
            </button>
          </form>
        )}
      </main>

      {detalhe && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-pet-ink/50 p-4" onClick={() => setDetalhe(null)}>
          <div className="w-full max-w-md bg-white p-5 text-[13px]" onClick={(e) => e.stopPropagation()}>
            <p className="font-semibold text-pet-deep">{detalhe.nome} · {detalhe.numero}</p>
            <p className="mt-1 text-pet-navy/70">{detalhe.email} · {mascaraTel(detalhe.telefone)}</p>
            <p>CPF {mascaraCpf(detalhe.cpf)} · {detalhe.genero}</p>
            <p className="mt-2">{rotuloStatus[detalhe.status]} · R$ {Number(detalhe.valor).toFixed(2)}</p>
            <ul className="mt-2 list-disc pl-4">
              {detalhe.atividades.map((t) => <li key={t}>{t}</li>)}
            </ul>
            <Acoes insc={detalhe} aoAtualizar={() => { carregarLista(lista.pagina); setDetalhe(null) }} />
          </div>
        </div>
      )}

      <p className="px-4 pb-6 text-center text-[12px] text-pet-navy/40">
        <Link to="/">← Site público</Link>
      </p>
    </div>
  )
}

function NovaAtividade({ diaId, aoCriar }) {
  const [titulo, setTitulo] = useState('')
  const [tipo, setTipo] = useState('palestra')
  const [preco, setPreco] = useState('0')
  const [vagas, setVagas] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function enviar(e) {
    e.preventDefault()
    setEnviando(true)
    setErro('')
    try {
      await api('/admin/atividades', {
        method: 'POST',
        body: {
          diaId,
          titulo,
          tipo,
          precoExtra: Number(preco || 0),
          vagas: vagas === '' ? null : Number(vagas),
        },
      })
      setTitulo('')
      setPreco('0')
      setVagas('')
      await aoCriar()
    } catch (err) {
      setErro(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={enviar} className="mt-2 grid gap-2 border border-dashed border-pet-navy/25 bg-white p-3 sm:grid-cols-[1fr_120px_80px_80px_90px]">
      <label className="text-[11px] text-pet-navy/50">
        Nova atividade
        <input className={classeInput} value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Título" required />
      </label>
      <label className="text-[11px] text-pet-navy/50">
        Tipo
        <select className={classeInput} value={tipo} onChange={(e) => setTipo(e.target.value)}>
          {TIPOS.map((t) => (
            <option key={t.id} value={t.id}>{t.rotulo}</option>
          ))}
        </select>
      </label>
      <label className="text-[11px] text-pet-navy/50">
        Extra
        <input className={classeInput} type="number" min="0" step="0.01" value={preco} onChange={(e) => setPreco(e.target.value)} />
      </label>
      <label className="text-[11px] text-pet-navy/50">
        Vagas
        <input className={classeInput} type="number" min="0" step="1" value={vagas} onChange={(e) => setVagas(e.target.value)} placeholder="livre" />
      </label>
      <button disabled={enviando} className="self-end bg-pet-orange py-2 text-[12px] font-semibold text-white">
        Cadastrar
      </button>
      {erro && <p className="text-[12px] text-pet-orange sm:col-span-5">{erro}</p>}
    </form>
  )
}

function Kpi({ n, t }) {
  return (
    <div className="border border-pet-navy/10 bg-white px-3 py-2">
      <p className="text-xl font-semibold text-pet-deep">{n}</p>
      <p className="text-[11px] text-pet-navy/50">{t}</p>
    </div>
  )
}

function Acoes({ insc, aoAtualizar, aoVer }) {
  return (
    <div className="flex flex-wrap gap-1">
      {aoVer && (
        <button type="button" className="text-[11px] underline" onClick={() => aoVer(insc)}>ver</button>
      )}
      {insc.status === 'pago' && !insc.credenciadoEm && (
        <button type="button" className="text-[11px] underline" onClick={async () => { await api(`/admin/inscritos/${insc.id}/credenciar`, { method: 'POST' }); aoAtualizar() }}>
          credenciar
        </button>
      )}
      {insc.status !== 'cancelada' && (
        <button type="button" className="text-[11px] underline text-pet-orange" onClick={async () => { await api(`/admin/inscritos/${insc.id}/cancelar`, { method: 'POST' }); aoAtualizar() }}>
          cancelar
        </button>
      )}
      {insc.status === 'cancelada' && (
        <button type="button" className="text-[11px] underline" onClick={async () => { await api(`/admin/inscritos/${insc.id}/desfazer`, { method: 'POST' }); aoAtualizar() }}>
          desfazer
        </button>
      )}
    </div>
  )
}
