import { motion } from 'framer-motion'
import { useInscricao } from '../../contexto/Inscricao'
import { useTaxa } from '../../hooks/useTaxa'

/**
 * Barra fixa de inscricao — visivel apenas no celular.
 * Abre o assistente no proprio site, em tela cheia.
 */
export default function BarraInscricao() {
  const { abrir } = useInscricao()
  const taxa = useTaxa()

  return (
    <motion.div
      initial={{ y: 60 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 28 }}
      className="z-30 flex items-stretch border-t border-white/10 bg-pet-ink sm:hidden"
    >
      <div className="flex flex-1 flex-col justify-center px-4 py-2.5 leading-tight">
        <span className="label text-white/40">Inscrição</span>
        <span className="text-[15px] font-bold tracking-display text-white">{taxa}</span>
      </div>

      <button
        type="button"
        onClick={abrir}
        className="flex items-center gap-2 bg-pet-orange px-5 text-[14px] font-semibold tracking-tight text-white active:brightness-95"
      >
        Inscrever-se
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M4 12h15M13 6l6 6-6 6" strokeLinecap="square" />
        </svg>
      </button>
    </motion.div>
  )
}
