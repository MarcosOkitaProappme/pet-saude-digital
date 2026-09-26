import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { palestrantes, iniciais } from '../../data/palestrantes'
import { programacao } from '../../data/programacao'
import { escalonar, surgir, suave } from '../../lib/motion'
import TituloSecao from '../ui/TituloSecao'
import Monograma from '../ui/Monograma'

/**
 * Cruza o palestrante com a grade para listar onde ele aparece.
 * Como a programacao e a lista de palestrantes compartilham o mesmo `id`,
 * essa relacao e calculada em tempo de execucao — nao ha dado duplicado.
 */
function atividadesDoPalestrante(id) {
  const encontradas = []
  programacao.forEach((dia) =>
    dia.turnos.forEach((turno) =>
      turno.atividades.forEach((atividade) => {
        if (atividade.palestranteId === id) {
          encontradas.push({ ...atividade, dia: dia.dia, data: dia.data })
        }
      }),
    ),
  )
  return encontradas
}

/** Celula da grade de palestrantes. */
function CartaoPalestrante({ pessoa, aoAbrir }) {
  return (
    /*
     * No celular cada palestrante e uma linha de ~56px; a partir de `sm` vira
     * cartao em grade. Oito cartoes empilhados ocupavam tela demais.
     */
    <motion.button
      variants={surgir}
      onClick={aoAbrir}
      className="group relative -ml-px -mt-px flex items-center gap-3 border-l border-t border-pet-navy/12 p-2.5 text-left transition-colors hover:bg-white sm:flex-col sm:items-start sm:gap-0 sm:p-5"
    >
      {/* A reacao ao hover fica em CSS (group-hover) para nao competir com as
          variantes de entrada escalonada controladas pelo container. */}
      <span className="flex-none origin-bottom-left transition-transform duration-300 ease-out group-hover:-rotate-3 group-hover:scale-105">
        <Monograma
          texto={iniciais(pessoa.nome)}
          foto={pessoa.foto}
          alt={`Retrato de ${pessoa.nome}`}
          tamanho="responsivo"
          tom="navy"
          className="transition-colors duration-300 group-hover:bg-pet-orange"
        />
      </span>

      <span className="min-w-0 flex-1 sm:mt-4 sm:w-full">
        <span className="block truncate text-[13.5px] font-semibold leading-tight tracking-tight text-pet-deep sm:whitespace-normal sm:text-[14.5px]">
          {pessoa.nome}
        </span>
        <span className="mt-0.5 block truncate text-[11.5px] leading-snug text-pet-orange sm:mt-1 sm:whitespace-normal sm:text-[12px]">
          {pessoa.titulo} · {pessoa.cargo}
        </span>
        <span className="mt-2 hidden text-[12.5px] leading-snug text-pet-navy/60 sm:block">
          {pessoa.instituicao}
        </span>
      </span>

      <span className="label mt-4 hidden items-center gap-1.5 text-pet-navy/35 transition-colors group-hover:text-pet-navy/70 sm:flex">
        Ver perfil
        <svg
          viewBox="0 0 24 24"
          className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          aria-hidden="true"
        >
          <path d="M4 12h15M13 6l6 6-6 6" strokeLinecap="square" />
        </svg>
      </span>

      {/* seta indicativa no celular, onde nao cabe o rotulo "Ver perfil" */}
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 flex-none text-pet-orange sm:hidden"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M4 12h15M13 6l6 6-6 6" strokeLinecap="square" />
      </svg>

      {pessoa.coordenacao && (
        <span className="label absolute right-9 top-3 text-pet-sky sm:right-4 sm:top-4">Coord.</span>
      )}
    </motion.button>
  )
}

/** Painel de detalhe do palestrante. */
function PainelPerfil({ pessoa, aoFechar }) {
  const atividades = atividadesDoPalestrante(pessoa.id)

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={aoFechar}
        className="fixed inset-0 z-40 bg-pet-ink/70 backdrop-blur-[3px]"
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`Perfil de ${pessoa.nome}`}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.34, ease: suave }}
        className="fixed inset-x-0 bottom-0 z-50 max-h-[86vh] overflow-y-auto bg-pet-paper sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-[560px] sm:-translate-x-1/2 sm:-translate-y-1/2"
      >
        {/* faixa superior */}
        <div className="flex items-start justify-between gap-4 bg-pet-navy p-5 sm:p-6">
          <div className="flex gap-4">
            <Monograma
              texto={iniciais(pessoa.nome)}
              foto={pessoa.foto}
              alt={`Retrato de ${pessoa.nome}`}
              tamanho="lg"
              tom="orange"
            />
            <div className="min-w-0 pt-1">
              <p className="label text-white/45">{pessoa.titulo}</p>
              <h3 className="mt-1.5 text-xl font-bold leading-tight tracking-display text-white">
                {pessoa.nome}
              </h3>
              <p className="mt-1.5 text-[13px] leading-snug text-pet-sky">{pessoa.cargo}</p>
            </div>
          </div>

          <button
            onClick={aoFechar}
            aria-label="Fechar perfil"
            className="flex-none p-1 text-2xl font-light leading-none text-white/50 transition-colors hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div>
            <p className="label text-pet-navy/40">Vínculo e formação</p>
            <p className="mt-1.5 text-[13.5px] text-pet-deep">{pessoa.instituicao}</p>
            <p className="text-[13px] text-pet-navy/60">{pessoa.formacao}</p>
          </div>

          <div>
            <p className="label text-pet-navy/40">Resumo</p>
            <p className="mt-1.5 text-[14px] leading-relaxed text-pet-navy/85">{pessoa.bio}</p>
          </div>

          <div>
            <p className="label text-pet-navy/40">Linhas de atuação</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {pessoa.linhas.map((linha) => (
                <span
                  key={linha}
                  className="border border-pet-navy/20 px-2.5 py-1 text-[12px] text-pet-navy/75"
                >
                  {linha}
                </span>
              ))}
            </div>
          </div>

          {atividades.length > 0 && (
            <div>
              <p className="label text-pet-navy/40">Participação na programação</p>
              <ul className="mt-2">
                {atividades.map((a, i) => (
                  <li
                    key={i}
                    className="flex gap-4 border-t border-pet-navy/12 py-2.5 last:border-b"
                  >
                    <span className="w-[104px] flex-none text-[12px] leading-snug text-pet-navy/55">
                      {a.dia}
                      <span className="block text-pet-navy/40">
                        {a.inicio} — {a.fim}
                      </span>
                    </span>
                    <span className="text-[13.5px] leading-snug text-pet-deep">
                      {a.titulo}
                      <span className="mt-0.5 block text-[12px] text-pet-navy/50">{a.local}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </motion.div>
    </>
  )
}

export default function Palestrantes() {
  const [selecionado, setSelecionado] = useState(null)

  // Fecha o painel com a tecla Esc
  useEffect(() => {
    const aoTeclar = (e) => e.key === 'Escape' && setSelecionado(null)
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [])

  const pessoa = palestrantes.find((p) => p.id === selecionado)

  return (
    <div>
      <TituloSecao
        numero="03"
        etiqueta="Palestrantes"
        titulo="Oito nomes entre a saúde e a tecnologia"
      >
        Toque em um nome para ver o minicurrículo e em quais atividades participa.
      </TituloSecao>

      <motion.div
        variants={escalonar(0.05)}
        initial="oculto"
        animate="visivel"
        className="grid grid-cols-1 border-b border-r border-pet-navy/12 sm:grid-cols-3 lg:grid-cols-4"
      >
        {palestrantes.map((p) => (
          <CartaoPalestrante key={p.id} pessoa={p} aoAbrir={() => setSelecionado(p.id)} />
        ))}
      </motion.div>

      <p className="mt-4 hidden text-[11.5px] text-pet-navy/40 sm:block">
        Faltam as fotografias de três palestrantes; até a coordenação enviá-las, elas aparecem
        como monograma de iniciais.
      </p>

      <AnimatePresence>
        {pessoa && <PainelPerfil pessoa={pessoa} aoFechar={() => setSelecionado(null)} />}
      </AnimatePresence>
    </div>
  )
}
