import { motion } from 'framer-motion'
import { evento, numeros, objetivos } from '../../data/evento'
import { palestrantes, iniciais } from '../../data/palestrantes'
import { surgir } from '../../lib/motion'
import TituloSecao from '../ui/TituloSecao'
import Sanfona from '../ui/Sanfona'
import Monograma from '../ui/Monograma'
import { useTaxa } from '../../hooks/useTaxa'

/**
 * Faixa de dados essenciais — o unico bloco sempre visivel alem do titulo.
 * Sao as quatro informacoes que alguem precisa antes de decidir participar.
 */
function FaixaEssencial() {
  const taxa = useTaxa()
  const dados = [
    ['Data', evento.dataCurta, 'segunda a sexta'],
    ['Horário', '08h — 17h', 'presencial'],
    ['Local', 'Campus XXII', 'Ananindeua — PA'],
    ['Inscrição', taxa, 'certificado 40h'],
  ]

  return (
    <motion.dl
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="grid grid-cols-2 bg-pet-navy sm:grid-cols-4"
    >
      {dados.map(([rotulo, valor, apoio], i) => (
        <div
          key={rotulo}
          className={`px-3.5 py-2.5 sm:px-4 sm:py-3.5 ${i % 2 === 1 ? 'border-l border-white/10' : ''} ${
            i > 1 ? 'border-t border-white/10 sm:border-t-0' : ''
          } sm:border-l sm:border-white/10 sm:first:border-l-0`}
        >
          <dt className="label text-white/40">{rotulo}</dt>
          <dd className="mt-1 text-[14px] font-bold leading-none tracking-display text-white sm:mt-1.5 sm:text-[15px]">
            {valor}
          </dd>
          <dd className="mt-1 text-[11px] leading-none text-pet-sky">{apoio}</dd>
        </div>
      ))}
    </motion.dl>
  )
}

export default function Sobre() {
  const coordenacao = palestrantes.filter((p) => p.coordenacao)

  /*
   * Todo o conteudo descritivo vive na sanfona. Fechado, cada bloco ocupa
   * uma linha; assim a aba inteira cabe na tela do celular, que era o
   * requisito principal do cliente.
   */
  const blocos = [
    {
      id: 'o-que-e',
      titulo: 'O que é o PET Saúde Digital',
      resumo: 'Programa de educação pelo trabalho da UEPA',
      conteudo: (
        <div className="space-y-2.5">
          <p className="text-[13.5px] leading-relaxed text-pet-navy/85">
            Programa de educação pelo trabalho da UEPA que integra estudantes, docentes e
            profissionais dos serviços em torno de um objetivo comum: usar tecnologia para
            qualificar o cuidado em saúde na Amazônia.
          </p>
          <p className="text-[13.5px] leading-relaxed text-pet-navy/85">
            No último ano os grupos desenvolveram soluções de análise de dados em{' '}
            <strong className="font-semibold text-pet-deep">Python</strong>, protótipos de apoio à
            decisão clínica e estudos sobre telessaúde no interior do estado.
          </p>
          <p className="text-[12.5px] leading-relaxed text-pet-navy/60">
            Aberto a {evento.publico.toLowerCase()}. Certificado de {evento.cargaHoraria} mediante
            presença.
          </p>
        </div>
      ),
    },
    {
      id: 'objetivos',
      titulo: 'Objetivos do simpósio',
      resumo: `${objetivos.length} objetivos`,
      conteudo: (
        <ul>
          {objetivos.map((objetivo, i) => (
            <li
              key={i}
              className="flex gap-4 border-t border-pet-navy/12 py-2.5 first:border-t-0 first:pt-0"
            >
              <span className="label w-5 flex-none pt-0.5 text-pet-orange">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-[13.5px] leading-snug text-pet-navy/85">{objetivo}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: 'numeros',
      titulo: 'O evento em números',
      resumo: '5 dias · 40 horas · 80 vagas',
      conteudo: (
        <div className="grid grid-cols-2 sm:grid-cols-4">
          {numeros.map((n) => (
            <div key={n.rotulo} className="border-b border-l border-pet-navy/12 px-3 py-3">
              <p className="text-[1.6rem] font-bold leading-none tracking-display text-pet-deep">
                {n.valor}
              </p>
              <p className="label mt-1.5 leading-tight text-pet-navy/45">{n.rotulo}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'coordenacao',
      titulo: 'Coordenação',
      // Derivado dos dados: trocar um nome em palestrantes.js nao pode deixar
      // este resumo desatualizado.
      resumo: coordenacao.map((p) => p.nome).join(' e '),
      conteudo: (
        <div>
          {coordenacao.map((p) => (
            <div
              key={p.id}
              className="flex gap-3.5 border-t border-pet-navy/12 py-3 first:border-t-0 first:pt-0"
            >
              <Monograma
                texto={iniciais(p.nome)}
                foto={p.foto}
                alt={`Retrato de ${p.nome}`}
                tamanho="sm"
                tom="ice"
              />
              <div className="min-w-0">
                <p className="text-[13.5px] font-semibold leading-tight tracking-tight text-pet-deep">
                  {p.titulo} {p.nome}
                </p>
                <p className="mt-0.5 text-[11.5px] text-pet-orange">{p.cargo}</p>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-pet-navy/70">
                  {p.formacao}. {p.bio}
                </p>
              </div>
            </div>
          ))}
          <p className="mt-3 text-[11px] leading-relaxed text-pet-navy/40">
            Minicurrículos no formato de resumo Lattes, com dados fictícios.
          </p>
        </div>
      ),
    },
  ]

  return (
    <div className="mx-auto max-w-3xl">
      <TituloSecao numero="01" etiqueta="Sobre o evento" titulo={evento.chamada} />

      <FaixaEssencial />

      <motion.div variants={surgir} initial="oculto" animate="visivel" className="mt-6">
        <p className="label mb-1 text-pet-navy/40">Saiba mais</p>
        <Sanfona itens={blocos} inicial={0} />
      </motion.div>
    </div>
  )
}
