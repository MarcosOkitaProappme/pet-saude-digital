export default function AvisoDocumento() {
  return (
    <div className="border border-pet-navy">
      <p className="bg-pet-navy px-3 py-2 text-[12.5px] font-semibold text-white">
        No credenciamento, leve um documento oficial com foto
      </p>
      <div className="bg-white px-3 py-2.5 text-[12.5px] leading-relaxed text-pet-navy/80">
        <p>
          <b className="text-pet-deep">Vale qualquer documento oficial com foto.</b> Por exemplo:
        </p>
        <ul className="mt-1.5 space-y-0.5">
          <li>RG ou nova Carteira de Identidade (CIN)</li>
          <li>CNH, física ou digital</li>
          <li>Passaporte</li>
          <li>Carteira de conselho profissional (COREN, CRM, CRF…)</li>
          <li>Identidade funcional ou militar</li>
        </ul>
      </div>
    </div>
  )
}
