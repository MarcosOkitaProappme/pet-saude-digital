export default function Campo({
  rotulo,
  obrigatorio,
  hint,
  erro,
  children,
}) {
  return (
    <label className="mb-3 block">
      <span className="mb-1 block text-[11px] font-semibold text-pet-navy/70">
        {rotulo}
        {obrigatorio && <span className="text-pet-orange"> *</span>}
      </span>
      {children}
      {hint && !erro && <span className="mt-1 block text-[11px] text-pet-navy/45">{hint}</span>}
      {erro && <span className="mt-1 block text-[11px] text-pet-orange">{erro}</span>}
    </label>
  )
}

export const classeInput =
  'h-10 w-full border border-pet-navy/20 bg-white px-3 text-[14px] text-pet-deep outline-none focus:border-pet-navy'

export const classeInputErro = 'border-pet-orange'
