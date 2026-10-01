import { motion } from 'framer-motion'
import { suave } from '../../lib/motion'

/**
 * Cabecalho padrao de cada aba.
 *
 * A hierarquia e feita com numeracao + regua + peso tipografico, e nao com
 * caixas coloridas — coerente com a tipografia de familia unica escolhida
 * pelo cliente (Opcao 6), onde o contraste vem de tamanho e peso.
 *
 * As medidas sao deliberadamente contidas no celular: o cabecalho competia
 * com o conteudo pelo pouco espaco vertical disponivel sem rolagem.
 */
export default function TituloSecao({ numero, etiqueta, titulo, children }) {
  return (
    <header className="mb-5 sm:mb-7">
      <div className="flex items-center gap-3 sm:gap-4">
        <span className="label text-pet-orange">{numero}</span>
        <motion.span
          className="h-px flex-1 origin-left bg-pet-navy/20"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, ease: suave, delay: 0.1 }}
        />
        <span className="label text-pet-navy/45">{etiqueta}</span>
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: suave, delay: 0.06 }}
        className="mt-3 max-w-3xl text-[clamp(1.35rem,4.2vw,2.35rem)] font-bold leading-[1.1] tracking-display text-pet-deep sm:mt-4"
      >
        {titulo}
      </motion.h2>

      {children && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: suave, delay: 0.14 }}
          className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-pet-navy/75 sm:mt-3 sm:text-[15px]"
        >
          {children}
        </motion.p>
      )}
    </header>
  )
}
