import { motion } from 'framer-motion'

/**
 * Chamada para acao em bloco de cor solida.
 *
 * Substitui o botao pequeno arredondado: como a divulgacao do evento acontece
 * principalmente por WhatsApp no celular, a area de toque precisa ser grande
 * e o destino precisa estar escrito por extenso.
 */
export default function BlocoAcao({ href, etiqueta, titulo, descricao, tom = 'orange' }) {
  const tons = {
    orange: 'bg-pet-orange text-white',
    navy: 'bg-pet-navy text-white',
    deep: 'bg-pet-deep text-white',
    claro: 'bg-white text-pet-deep border border-pet-navy/15',
  }

  const externo = href.startsWith('http')

  return (
    <motion.a
      href={href}
      target={externo ? '_blank' : undefined}
      rel={externo ? 'noreferrer' : undefined}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      className={`group relative flex flex-col justify-between overflow-hidden p-4 sm:p-6 ${tons[tom]}`}
    >
      <span className="label opacity-70">{etiqueta}</span>

      <span className="mt-3 flex items-end justify-between gap-4 sm:mt-6">
        <span className="min-w-0">
          <span className="block text-[17px] font-semibold leading-tight tracking-display sm:text-xl">
            {titulo}
          </span>
          {descricao && (
            <span className="mt-1 block break-words text-[12px] leading-snug opacity-80 sm:text-[12.5px]">
              {descricao}
            </span>
          )}
        </span>

        {/* Seta desenhada, sem dependencia de biblioteca de icones */}
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6 flex-none transition-transform duration-300 group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          aria-hidden="true"
        >
          <path d="M4 12h15M13 6l6 6-6 6" strokeLinecap="square" />
        </svg>
      </span>
    </motion.a>
  )
}
