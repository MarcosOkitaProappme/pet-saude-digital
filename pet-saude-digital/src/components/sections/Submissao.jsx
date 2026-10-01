import { motion } from 'framer-motion'
import { linkEmail, linkWhatsApp } from '../../data/evento'
import { surgir } from '../../lib/motion'
import TituloSecao from '../ui/TituloSecao'
import BlocoAcao from '../ui/BlocoAcao'
import Sanfona from '../ui/Sanfona'

const normas = [
  'Resumo expandido de 3 a 5 páginas, enviado em PDF.',
  'Até cinco autores por trabalho, com filiação institucional identificada.',
  'Temas aceitos: saúde digital, dados em saúde, telessaúde e experiências do PET.',
  'Formatação: fonte Arial 12, espaçamento 1,5 e margens de 2,5 cm.',
  'Ao menos um dos autores deve estar inscrito no simpósio.',
]

const cronograma = [
  { data: '08/09/2026', titulo: 'Abertura das submissões', estado: 'concluido' },
  { data: '05/10/2026', titulo: 'Prazo final para envio', estado: 'atual' },
  { data: '09/10/2026', titulo: 'Divulgação dos trabalhos aprovados', estado: 'futuro' },
  { data: '23/10/2026', titulo: 'Apresentação no simpósio', estado: 'futuro' },
]

export default function Submissao() {
  const blocos = [
    {
      id: 'normas',
      titulo: 'Normas de envio',
      resumo: '5 regras · resumo expandido em PDF',
      conteudo: (
        <ul>
          {normas.map((norma, i) => (
            <li
              key={i}
              className="flex gap-4 border-t border-pet-navy/12 py-2.5 first:border-t-0 first:pt-0"
            >
              <span className="label w-5 flex-none pt-0.5 text-pet-orange">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-[13.5px] leading-snug text-pet-navy/85">{norma}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: 'cronograma',
      titulo: 'Prazos',
      resumo: 'Envio até 05/10 · resultado em 09/10',
      conteudo: (
        <ol className="bg-pet-navy p-5">
          {cronograma.map((etapa, i) => (
            <li key={i} className="relative flex gap-4 pb-5 last:pb-0">
              {i < cronograma.length - 1 && (
                <span className="absolute left-[5px] top-3 h-full w-px bg-white/15" />
              )}

              <span className="relative mt-1.5 flex h-3 w-3 flex-none items-center justify-center">
                {etapa.estado === 'atual' && (
                  <span className="absolute h-3 w-3 animate-pulse-ring bg-pet-orange" />
                )}
                <span
                  className={`h-[11px] w-[11px] ${
                    etapa.estado === 'futuro'
                      ? 'border border-white/40'
                      : etapa.estado === 'atual'
                        ? 'bg-pet-orange'
                        : 'bg-pet-sky'
                  }`}
                />
              </span>

              <span className="min-w-0">
                <span className="label block text-white/40">{etapa.data}</span>
                <span
                  className={`mt-1 block text-[13.5px] leading-snug tracking-tight ${
                    etapa.estado === 'futuro' ? 'text-white/60' : 'font-medium text-white'
                  }`}
                >
                  {etapa.titulo}
                </span>
              </span>
            </li>
          ))}
        </ol>
      ),
    },
    {
      id: 'sobre',
      titulo: 'O que pode ser submetido',
      resumo: 'Projetos, pesquisas e relatos de experiência',
      conteudo: (
        <p className="text-[14px] leading-relaxed text-pet-navy/85">
          São aceitos resumos expandidos ligados a projetos de saúde digital, tecnologia aplicada à
          saúde ou relatos de experiência do PET Saúde. Os trabalhos aprovados são apresentados na
          sexta-feira, último dia do simpósio, e recebem certificado de apresentação.
        </p>
      ),
    },
  ]

  return (
    <div className="mx-auto max-w-3xl">
      <TituloSecao
        numero="04"
        etiqueta="Submissão de artigos"
        titulo="Traga seu trabalho para o simpósio"
      >
        Sem formulário nem plataforma externa: o envio é direto com a comissão científica.
      </TituloSecao>

      {/* A acao vem antes da explicacao — e o que a pessoa veio fazer aqui. */}
      <motion.div
        variants={surgir}
        initial="oculto"
        animate="visivel"
        className="grid grid-cols-2 gap-px bg-pet-navy/12"
      >
        <BlocoAcao
          tom="navy"
          href={linkEmail('Submissão de artigo — I Simpósio PET Saúde Digital')}
          etiqueta="Enviar trabalho"
          titulo="E-mail"
          descricao="petsaudedigital@uepa.br"
        />
        <BlocoAcao
          tom="orange"
          href={linkWhatsApp(
            'Olá! Tenho uma dúvida sobre a submissão de artigos para o I Simpósio PET Saúde Digital.',
          )}
          etiqueta="Tirar dúvidas"
          titulo="WhatsApp"
          descricao="(91) 99123-4567"
        />
      </motion.div>

      <div className="mt-6">
        <p className="label mb-1 text-pet-navy/40">Antes de enviar</p>
        <Sanfona itens={blocos} inicial={0} />
      </div>
    </div>
  )
}
