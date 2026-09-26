import { motion } from 'framer-motion'
import { evento, linkWhatsApp } from '../../data/evento'

/**
 * Barra fixa de inscricao — visivel apenas no celular.
 *
 * O site sera divulgado principalmente por WhatsApp, entao a acao de
 * inscricao precisa estar sempre ao alcance do polegar, sem depender de
 * rolagem nem de voltar ao topo.
 */
export default function BarraInscricao() {
  return (
    <motion.div
      initial={{ y: 60 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 28 }}
      className="z-30 flex items-stretch border-t border-white/10 bg-pet-ink sm:hidden"
    >
      <div className="flex flex-1 flex-col justify-center px-4 py-2.5 leading-tight">
        <span className="label text-white/40">Inscrição</span>
        <span className="text-[15px] font-bold tracking-display text-white">{evento.taxa}</span>
      </div>

      <a
        href={linkWhatsApp('Olá! Gostaria de me inscrever no I Simpósio PET Saúde Digital da UEPA.')}
        target="_blank"
        rel="noreferrer"
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
      </a>
    </motion.div>
  )
}
