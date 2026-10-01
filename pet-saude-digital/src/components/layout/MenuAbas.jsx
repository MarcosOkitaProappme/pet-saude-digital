import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

/**
 * Menu de abas — nucleo da navegacao pedida pelo cliente.
 *
 * Trocar de aba apenas atualiza o estado em <App/>; nada rola na pagina.
 * O indicador laranja desliza entre as abas com `layoutId`, o que da
 * continuidade visual ao movimento em vez de simplesmente piscar.
 */
export default function MenuAbas({ abas, ativa, aoTrocar }) {
  const trilhoRef = useRef(null)
  const itensRef = useRef({})

  // No celular o menu rola na horizontal: garante que a aba ativa fique
  // visivel mesmo quando selecionada pelo teclado ou por link com hash.
  useEffect(() => {
    const alvo = itensRef.current[ativa]
    if (alvo) {
      alvo.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }, [ativa])

  return (
    <nav
      aria-label="Seções do evento"
      className="relative z-10 border-b border-white/10 bg-pet-deep"
    >
      <div
        ref={trilhoRef}
        role="tablist"
        className="no-scrollbar mx-auto flex max-w-[1180px] overflow-x-auto px-2 sm:px-4"
      >
        {abas.map((aba) => {
          const selecionada = aba.id === ativa

          return (
            <button
              key={aba.id}
              ref={(el) => (itensRef.current[aba.id] = el)}
              role="tab"
              id={`aba-${aba.id}`}
              aria-selected={selecionada}
              aria-controls={`painel-${aba.id}`}
              onClick={() => aoTrocar(aba.id)}
              className="group relative flex flex-none items-baseline gap-2 px-3.5 py-2.5 outline-none transition-colors sm:px-4 sm:py-3.5"
            >
              <span
                className={`label transition-colors ${
                  selecionada ? 'text-pet-orange' : 'text-white/30 group-hover:text-white/50'
                }`}
              >
                {aba.numero}
              </span>

              <span
                className={`text-[13.5px] font-medium tracking-tight transition-colors sm:text-sm ${
                  selecionada ? 'text-white' : 'text-white/55 group-hover:text-white/85'
                }`}
              >
                <span className="hidden sm:inline">{aba.rotulo}</span>
                <span className="sm:hidden">{aba.rotuloCurto}</span>
              </span>

              {selecionada && (
                <motion.span
                  layoutId="indicador-aba"
                  className="absolute inset-x-0 bottom-0 h-[3px] bg-pet-orange"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
            </button>
          )
        })}

        {/* Atalho de teclado: util na apresentacao do site em projetor. */}
        <span className="label ml-auto hidden items-center gap-1.5 self-center pl-6 pr-2 text-white/25 lg:flex">
          <kbd className="border border-white/20 px-1.5 py-0.5">←</kbd>
          <kbd className="border border-white/20 px-1.5 py-0.5">→</kbd>
          navegar
        </span>
      </div>
    </nav>
  )
}
