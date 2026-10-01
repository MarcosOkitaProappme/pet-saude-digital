/**
 * Bloco quadrado de identificacao: mostra a fotografia quando ela existe e,
 * na ausencia dela, as iniciais.
 *
 * Motivo do duplo comportamento: no inventario de conteudo, "foto do
 * palestrante" e "logo em vetor" sao itens que dependem de terceiros. O
 * monograma segura o layout ate o arquivo chegar — e, quando chega, basta
 * preencher o campo `foto` nos dados.
 */
export default function Monograma({
  texto,
  foto,
  alt,
  tamanho = 'md',
  tom = 'navy',
  className = '',
}) {
  const tamanhos = {
    sm: 'h-10 w-10 text-[13px]',
    md: 'h-14 w-14 text-[17px]',
    lg: 'h-20 w-20 text-[24px]',
    // Cresce junto com o layout: no celular os palestrantes viram uma lista
    // compacta, e no desktop voltam a ser cartoes.
    responsivo: 'h-9 w-9 text-[12px] sm:h-14 sm:w-14 sm:text-[17px]',
  }

  const tons = {
    navy: 'bg-pet-navy text-white',
    deep: 'bg-pet-deep text-white',
    orange: 'bg-pet-orange text-white',
    ice: 'bg-pet-ice text-pet-navy',
    contorno: 'border border-pet-navy/25 text-pet-navy',
  }

  if (foto) {
    return (
      <span className={`relative block flex-none overflow-hidden ${tamanhos[tamanho]} ${className}`}>
        <img
          src={foto}
          alt={alt || ''}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </span>
    )
  }

  return (
    <span
      aria-hidden="true"
      className={`inline-grid flex-none place-items-center font-bold tracking-display ${tamanhos[tamanho]} ${tons[tom]} ${className}`}
    >
      {texto}
    </span>
  )
}
