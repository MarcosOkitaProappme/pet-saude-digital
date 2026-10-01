import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { programacao, tiposAtividade } from '../../data/programacao'
import { buscarPalestrante } from '../../data/palestrantes'
import { useTelaPequena } from '../../hooks/useTelaPequena'
import { escalonar, expandir, surgirLateral, suave } from '../../lib/motion'
import TituloSecao from '../ui/TituloSecao'

/**
 * Uma linha da grade.
 *
 * O cliente pediu explicitamente que o detalhe (sala, palestrante, descrição)
 * aparecesse ao clicar na atividade, em vez de poluir a visão geral do dia.
 */
function Atividade({ atividade }) {
  const [aberta, setAberta] = useState(false)
  const tipo = tiposAtividade[atividade.tipo]
  const palestrante = atividade.palestranteId ? buscarPalestrante(atividade.palestranteId) : null
  const ehIntervalo = atividade.tipo === 'intervalo'

  return (
    <motion.li variants={surgirLateral} className="border-t border-pet-navy/12 last:border-b">
      <button
        onClick={() => setAberta((v) => !v)}
        aria-expanded={aberta}
        className={`flex w-full gap-3 py-2 text-left transition-colors sm:gap-4 sm:py-3 ${
          ehIntervalo ? 'opacity-55' : 'hover:bg-white/70'
        }`}
      >
        <span className="w-[46px] flex-none pt-0.5 leading-none sm:w-[58px]">
          <span className="block text-[12.5px] font-semibold tracking-tight text-pet-deep">
            {atividade.inicio}
          </span>
          {/* horario de termino so no desktop: no celular ele aparece ao
              expandir a atividade, e economiza uma linha em cada uma das
              dez linhas da grade. */}
          <span className="mt-1 hidden text-[10.5px] text-pet-navy/40 sm:block">
            {atividade.fim}
          </span>
        </span>

        <span className="relative flex w-3 flex-none justify-center">
          <span className="absolute inset-y-0 w-px bg-pet-navy/12" />
          <span className={`relative mt-1.5 h-2 w-2 ${tipo.cor}`} />
        </span>

        <span className="min-w-0 flex-1">
          {!ehIntervalo && <span className="label block text-pet-navy/40">{tipo.rotulo}</span>}
          <span className="mt-0.5 block text-[13.5px] font-medium leading-snug tracking-tight text-pet-deep sm:text-[14.5px]">
            {atividade.titulo}
          </span>
          <span className="mt-0.5 block truncate text-[12px] text-pet-navy/55">
            {palestrante ? `${palestrante.nome} · ` : ''}
            {atividade.local}
          </span>
        </span>

        <motion.span
          animate={{ rotate: aberta ? 45 : 0 }}
          transition={{ duration: 0.25, ease: suave }}
          className="mt-1 flex-none text-[17px] font-light leading-none text-pet-orange"
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {aberta && (
          <motion.div
            variants={expandir}
            initial="fechado"
            animate="aberto"
            exit="fechado"
            className="overflow-hidden"
          >
            <div className="mb-3 ml-[61px] border-l-2 border-pet-orange bg-white/70 px-4 py-3 sm:ml-[74px]">
              {/* no celular o horario de termino nao cabe na linha, entao
                  aparece aqui, no detalhe */}
              <p className="label mb-1.5 text-pet-navy/40 sm:hidden">
                {atividade.inicio} — {atividade.fim}
              </p>
              <p className="text-[13px] leading-relaxed text-pet-navy/80">{atividade.detalhe}</p>

              <dl className="mt-3 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
                {palestrante && (
                  <div>
                    <dt className="label text-pet-navy/40">Responsável</dt>
                    <dd className="mt-0.5 text-[12.5px] text-pet-deep">
                      {palestrante.titulo} {palestrante.nome}
                      <span className="block text-[11.5px] text-pet-navy/55">
                        {palestrante.instituicao}
                      </span>
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="label text-pet-navy/40">Local</dt>
                  <dd className="mt-0.5 text-[12.5px] text-pet-deep">{atividade.local}</dd>
                </div>
              </dl>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  )
}

/**
 * Botao de selecao de dia.
 *
 * Com a semana inteira sao cinco botoes lado a lado: no celular cada um cabe
 * com a abreviacao ("Seg") e a data; o nome por extenso e o resumo do dia
 * so aparecem quando ha largura para eles.
 */
function BotaoDia({ dia, ativo, aoSelecionar }) {
  return (
    <button
      onClick={aoSelecionar}
      className={`relative min-w-0 flex-1 overflow-hidden px-2 py-2.5 text-left transition-colors sm:px-4 sm:py-3.5 ${
        ativo ? 'bg-pet-navy text-white' : 'bg-white/70 text-pet-deep hover:bg-white'
      }`}
    >
      <span className={`label ${ativo ? 'text-pet-orange' : 'text-pet-navy/40'}`}>{dia.data}</span>
      <span className="mt-1 block truncate text-[13px] font-semibold tracking-tight sm:text-[15px]">
        <span className="sm:hidden">{dia.diaCurto}</span>
        <span className="hidden sm:inline">{dia.dia}</span>
      </span>
      <span
        className={`mt-1 hidden text-[12px] leading-snug xl:block ${
          ativo ? 'text-white/60' : 'text-pet-navy/55'
        }`}
      >
        {dia.resumo}
      </span>

      {ativo && (
        <motion.span
          layoutId="indicador-dia"
          className="absolute inset-x-0 bottom-0 h-1 bg-pet-orange"
          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
        />
      )}
    </button>
  )
}

/** Coluna de um turno. */
function ColunaTurno({ turno }) {
  return (
    <section className="min-w-0">
      {/* Oculto abaixo de lg: ali o seletor de turno ja mostra nome e horario,
          e repetir a informacao custava uma linha inteira de tela. */}
      <div className="hidden items-baseline justify-between border-b-2 border-pet-deep pb-2 lg:flex">
        <h3 className="text-[14px] font-semibold tracking-tight text-pet-deep sm:text-[15px]">
          {turno.turno}
        </h3>
        <span className="label text-pet-navy/45">{turno.intervalo}</span>
      </div>

      <motion.ul variants={escalonar(0.045)} initial="oculto" animate="visivel" className="mt-1">
        {turno.atividades.map((atividade, i) => (
          <Atividade key={i} atividade={atividade} />
        ))}
      </motion.ul>
    </section>
  )
}

export default function Programacao() {
  const [diaAtivo, setDiaAtivo] = useState(programacao[0].id)
  const [turnoAtivo, setTurnoAtivo] = useState(0)
  const telaPequena = useTelaPequena()

  const dia = programacao.find((d) => d.id === diaAtivo)

  /*
   * No celular a grade mostra um turno por vez: os dois turnos juntos davam
   * dez linhas, o que forcava a rolagem que o cliente queria evitar. No
   * desktop ha largura para as duas colunas lado a lado.
   */
  const turnosVisiveis = telaPequena ? [dia.turnos[turnoAtivo]] : dia.turnos

  return (
    <div>
      <TituloSecao numero="02" etiqueta="Programação" titulo="Cinco dias, dez turnos, 40 horas">
        Toque em uma atividade para ver o palestrante, a sala e a descrição completa.
      </TituloSecao>

      <div className="flex border-y border-pet-navy/12">
        {programacao.map((d) => (
          <BotaoDia
            key={d.id}
            dia={d}
            ativo={d.id === diaAtivo}
            aoSelecionar={() => setDiaAtivo(d.id)}
          />
        ))}
      </div>

      {/* seletor de turno — apenas no celular */}
      {telaPequena && (
        <div className="mt-3 flex gap-px bg-pet-navy/12 p-px">
          {dia.turnos.map((t, i) => (
            <button
              key={t.turno}
              onClick={() => setTurnoAtivo(i)}
              className={`flex-1 py-2 text-[12.5px] font-semibold tracking-tight transition-colors ${
                turnoAtivo === i
                  ? 'bg-pet-deep text-white'
                  : 'bg-pet-paper text-pet-navy/60 hover:text-pet-deep'
              }`}
            >
              {t.turno}
              <span className="ml-1.5 font-normal opacity-60">{t.intervalo}</span>
            </button>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={`${diaAtivo}-${telaPequena ? turnoAtivo : 'ambos'}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: suave }}
          className="mt-5 grid gap-8 lg:grid-cols-2 lg:gap-x-12"
        >
          {turnosVisiveis.map((turno) => (
            <ColunaTurno key={turno.turno} turno={turno} />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* legenda: ocupa espaco util no celular sem ser essencial */}
      <div className="mt-6 hidden flex-wrap items-center gap-x-5 gap-y-2 border-t border-pet-navy/12 pt-4 lg:flex">
        <span className="label text-pet-navy/40">Legenda</span>
        {Object.entries(tiposAtividade)
          .filter(([chave]) => chave !== 'intervalo')
          .map(([chave, tipo]) => (
            <span key={chave} className="flex items-center gap-2">
              <span className={`h-2 w-2 ${tipo.cor}`} />
              <span className="text-[12px] text-pet-navy/60">{tipo.rotulo}</span>
            </span>
          ))}
      </div>
    </div>
  )
}
