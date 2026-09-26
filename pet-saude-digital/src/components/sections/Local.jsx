import { motion } from 'framer-motion'
import { evento } from '../../data/evento'
import { useTelaPequena } from '../../hooks/useTelaPequena'
import TituloSecao from '../ui/TituloSecao'
import Sanfona from '../ui/Sanfona'

/** Mapa incorporado do campus. */
function Mapa({ className = '' }) {
  return (
    <div className={`relative bg-pet-ice ${className}`}>
      <iframe
        title="Mapa do Campus XXII da UEPA, em Ananindeua"
        src="https://www.google.com/maps?q=UEPA+Campus+XXII+Avenida+Independ%C3%AAncia+Icu%C3%AD-Guajar%C3%A1+Ananindeua+PA&output=embed"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 h-full w-full grayscale-[35%] contrast-[1.05]"
        style={{ border: 0 }}
      />
      <div className="pointer-events-none absolute left-3 top-3 bg-pet-orange px-2.5 py-1.5">
        <p className="label text-white">Ponto de encontro</p>
        <p className="text-[12px] font-semibold tracking-tight text-white">
          Portão principal · 07h45
        </p>
      </div>
    </div>
  )
}

const chegada = [
  {
    titulo: 'Como chegar',
    texto: 'O campus fica na Avenida Independência, ao lado da Usina da Paz do Icuí, em Ananindeua. A entrada principal dá direto no hall, onde acontece o credenciamento.',
  },
  {
    titulo: 'Transporte público',
    texto: 'Linhas que servem o Icuí-Guajará a partir de Belém e do centro de Ananindeua, com desembarque na Avenida Independência.',
  },
]

const estrutura = [
  {
    titulo: 'Estacionamento',
    texto: 'Vagas gratuitas no pátio do campus, com acesso liberado mediante apresentação do crachá do evento.',
  },
  {
    titulo: 'Acessibilidade',
    texto: 'Prédio térreo, com rampas em todos os acessos e lugares reservados nas primeiras fileiras do auditório.',
  },
]

/** Lista de orientacoes usada dentro da sanfona. */
function Orientacoes({ itens }) {
  return (
    <div>
      {itens.map((item) => (
        <div
          key={item.titulo}
          className="border-t border-pet-navy/12 py-2.5 first:border-t-0 first:pt-0"
        >
          <p className="text-[13.5px] font-semibold tracking-tight text-pet-deep">{item.titulo}</p>
          <p className="mt-1 text-[13px] leading-relaxed text-pet-navy/70">{item.texto}</p>
        </div>
      ))}
    </div>
  )
}

export default function Local() {
  const celular = useTelaPequena('(max-width: 639px)')

  const blocos = [
    // No celular o mapa entra como item da sanfona: fixo, ele sozinho
    // empurrava a aba para 1,6x a altura da tela.
    ...(celular
      ? [
          {
            id: 'mapa',
            titulo: 'Ver no mapa',
            resumo: 'Av. Independência · Icuí-Guajará',
            conteudo: <Mapa className="h-48" />,
          },
        ]
      : []),
    {
      id: 'chegada',
      titulo: 'Como chegar e transporte',
      resumo: 'Av. Independência, ao lado da Usina da Paz',
      conteudo: <Orientacoes itens={chegada} />,
    },
    {
      id: 'estrutura',
      titulo: 'Estacionamento e acessibilidade',
      resumo: 'Vagas gratuitas · rampas e elevador',
      conteudo: <Orientacoes itens={estrutura} />,
    },
    {
      id: 'salas',
      titulo: 'Salas utilizadas',
      resumo: 'Auditório · Laboratório · Salas 1 a 4',
      conteudo: (
        <dl className="space-y-2.5">
          {[
            ['Auditório', 'Palestras, mesas-redondas e cerimônias'],
            ['Laboratório de Informática', 'Todos os minicursos práticos'],
            ['Salas 1 a 4', 'Oficinas e mostra de pôsteres'],
            ['Hall de entrada', 'Credenciamento, coffee e pôsteres'],
          ].map(([sala, uso]) => (
            <div key={sala} className="flex justify-between gap-4 border-b border-pet-navy/10 pb-2">
              <dt className="text-[13px] font-medium text-pet-deep">{sala}</dt>
              <dd className="text-right text-[12px] text-pet-navy/55">{uso}</dd>
            </div>
          ))}
        </dl>
      ),
    },
  ]

  return (
    <div className="mx-auto max-w-3xl">
      <TituloSecao numero="05" etiqueta="Local" titulo="Campus XXII da UEPA, em Ananindeua">
        Todas as atividades acontecem no mesmo prédio, ao lado da Usina da Paz do Icuí.
      </TituloSecao>

      <div className="grid gap-px bg-pet-navy/12 sm:grid-cols-2">
        {/* endereco */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="bg-pet-navy p-4 sm:p-5"
        >
          <p className="label text-white/40">Endereço</p>
          <p className="mt-2.5 text-lg font-bold leading-tight tracking-display text-white sm:text-xl">
            Campus XXII — Ananindeua
          </p>
          <address className="mt-2 not-italic text-[13px] leading-relaxed text-white/75">
            {evento.endereco}
            <br />
            {evento.cep}
            <br />
            <span className="text-pet-sky">{evento.referencia}</span>
          </address>
          <p className="mt-3 border-t border-white/15 pt-3 text-[12.5px] text-pet-sky">
            {evento.data} · {evento.horario}
          </p>
        </motion.div>

        {/* mapa — no celular ele vive dentro da sanfona, logo abaixo */}
        {!celular && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden sm:block sm:min-h-[220px]"
          >
            <Mapa className="h-full" />
          </motion.div>
        )}
      </div>

      <div className="mt-6">
        <p className="label mb-1 text-pet-navy/40">Informações práticas</p>
        <Sanfona itens={blocos} inicial={null} />
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-pet-navy/40">
        Endereço e estrutura conforme os dados públicos do Campus XXII. Os horários e as
        atribuições de sala ainda dependem de confirmação da coordenação.
      </p>
    </div>
  )
}
