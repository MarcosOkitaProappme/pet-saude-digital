import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTelaPequena } from '../../hooks/useTelaPequena'
import { expandir, suave } from '../../lib/motion'

/**
 * Sanfona de secoes — um item aberto por vez.
 *
 * E o mecanismo central para atender ao pedido do cliente de nao ter rolagem
 * longa: cada aba mostra so o essencial sempre visivel e guarda o restante
 * aqui, onde ocupa uma linha de ~54px enquanto estiver fechado.
 *
 * No celular a sanfona comeca toda fechada por padrao: assim a aba inteira
 * cabe na tela e a pessoa abre so o que quer ler. No desktop, onde ha altura
 * sobrando, o primeiro item ja vem aberto para a tela nao parecer vazia.
 *
 * @param {{id, titulo, resumo, conteudo}[]} itens
 * @param {number|null} inicial         indice aberto por padrao
 * @param {number|null} inicialCelular  idem, em telas pequenas
 */
export default function Sanfona({ itens, inicial = 0, inicialCelular = null, className = '' }) {
  const celular = useTelaPequena('(max-width: 639px)')
  const [aberto, setAberto] = useState(() => (celular ? inicialCelular : inicial))

  return (
    <div className={className}>
      {itens.map((item, i) => {
        const estaAberto = aberto === i

        return (
          <div key={item.id} className="border-t border-pet-navy/15 last:border-b">
            <button
              onClick={() => setAberto(estaAberto ? null : i)}
              aria-expanded={estaAberto}
              className="flex w-full items-center gap-3 py-3 text-left transition-colors hover:bg-white/60 sm:py-3.5"
            >
              <span
                className={`label w-6 flex-none transition-colors ${
                  estaAberto ? 'text-pet-orange' : 'text-pet-navy/35'
                }`}
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-[14.5px] font-semibold leading-tight tracking-tight text-pet-deep">
                  {item.titulo}
                </span>
                {item.resumo && (
                  <span className="mt-0.5 block truncate text-[12px] text-pet-navy/50">
                    {item.resumo}
                  </span>
                )}
              </span>

              <motion.span
                animate={{ rotate: estaAberto ? 45 : 0 }}
                transition={{ duration: 0.25, ease: suave }}
                className="flex-none text-[18px] font-light leading-none text-pet-orange"
              >
                +
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {estaAberto && (
                <motion.div
                  variants={expandir}
                  initial="fechado"
                  animate="aberto"
                  exit="fechado"
                  className="overflow-hidden"
                >
                  <div className="pb-5 pl-9 pr-1">{item.conteudo}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
