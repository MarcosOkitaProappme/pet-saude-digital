import { evento } from '../../data/evento'

const itens = [
  'Inscrições abertas',
  `Taxa única de ${evento.taxa}`,
  '80 vagas presenciais',
  'Submissão de artigos até 05/10',
  `${evento.data} · ${evento.cidade}`,
  `Certificado de ${evento.cargaHoraria}`,
]

/**
 * Faixa superior em movimento continuo.
 *
 * Concentra as informacoes que precisam ser lidas antes de qualquer clique —
 * o cliente pediu que o site funcionasse sem rolagem, entao o dado mais
 * urgente (inscricao aberta e paga) fica em movimento no topo da tela.
 */
export default function Ticker() {
  // A lista e duplicada porque a animacao translada -50%: quando a primeira
  // metade sai da tela, a segunda ja esta no lugar e o loop fica continuo.
  const sequencia = [...itens, ...itens]

  return (
    /*
     * Oculto no celular: a faixa custava 26px dos ~650px uteis de tela, e a
     * informacao mais importante dela (inscricao aberta e valor) ja aparece
     * na barra fixa inferior.
     */
    <div className="relative hidden overflow-hidden border-b border-white/10 bg-pet-orange text-white sm:block">
      <div className="flex w-max animate-marquee items-center whitespace-nowrap py-1.5">
        {sequencia.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="label px-5">{item}</span>
            <span className="h-1 w-1 bg-white/60" />
          </span>
        ))}
      </div>
    </div>
  )
}
