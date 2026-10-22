import { motion } from 'framer-motion'
import { evento, linkEmail } from '../../data/evento'
import { surgir } from '../../lib/motion'
import { useInscricao } from '../../contexto/Inscricao'
import TituloSecao from '../ui/TituloSecao'
import BlocoAcao from '../ui/BlocoAcao'
import Sanfona from '../ui/Sanfona'
import { useTaxa } from '../../hooks/useTaxa'

export default function Contato() {
  const { abrir } = useInscricao()
  const taxa = useTaxa()
  const duvidas = [
    {
      pergunta: 'Como faço a inscrição e como pago a taxa?',
      resumo: 'No site, com pagamento em Pix',
      resposta: `Clique em Inscrever-se no cabeçalho (ou na barra inferior do celular). Depois de preencher os dados, você paga a taxa de ${taxa} por Pix e recebe o comprovante no e-mail cadastrado. Quem já se inscreveu entra em Minha inscrição.`,
    },
    {
      pergunta: `A taxa de ${taxa} cobre a semana toda?`,
      resumo: 'Sim, valor único para os cinco dias',
      resposta:
        'Sim. O valor é único e dá acesso a toda a programação dos cinco dias, incluindo palestras, minicursos, oficinas e mesas-redondas, além do certificado de 40 horas e do coffee break.',
    },
    {
      pergunta: 'Os minicursos têm vagas limitadas?',
      resumo: '30 vagas por minicurso',
      resposta:
        'Sim. Cada minicurso comporta 30 participantes, porque o campus tem um único laboratório de informática — por isso eles acontecem em dias diferentes, e não em paralelo. A escolha é feita na inscrição, por ordem de confirmação de pagamento.',
    },
    {
      pergunta: 'Preciso ser estudante da UEPA?',
      resumo: 'Não, o evento é aberto ao público externo',
      resposta:
        'Não. O simpósio é aberto à comunidade externa, especialmente a profissionais e estudantes das áreas de saúde e tecnologia da região metropolitana de Belém.',
    },
  ]
  const blocos = [
    ...duvidas.map((d, i) => ({
      id: `duvida-${i}`,
      titulo: d.pergunta,
      resumo: d.resumo,
      conteudo: (
        <p className="text-[13.5px] leading-relaxed text-pet-navy/80">{d.resposta}</p>
      ),
    })),
    {
      id: 'outros',
      titulo: 'Outros canais e organização',
      resumo: `Instagram ${evento.instagram}`,
      conteudo: (
        <div className="space-y-3">
          <div>
            <p className="label text-pet-navy/40">Redes sociais</p>
            <p className="mt-1 text-[14px] font-semibold tracking-tight text-pet-deep">
              {evento.instagram}
            </p>
            <p className="mt-0.5 text-[12.5px] text-pet-navy/60">
              Divulgação diária da programação e dos palestrantes.
            </p>
          </div>
          <div>
            <p className="label text-pet-navy/40">Comissão organizadora</p>
            <p className="mt-1 text-[13px] leading-relaxed text-pet-navy/75">
              Coordenação do PET Saúde Digital, com apoio da Liga Acadêmica de Informática em Saúde
              da UEPA.
            </p>
          </div>
          <div>
            <p className="label text-pet-navy/40">Horário de atendimento</p>
            <p className="mt-1 text-[13px] text-pet-navy/75">
              Segunda a sexta, das 09h às 18h.
            </p>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="mx-auto max-w-3xl">
      <TituloSecao numero="07" etiqueta="Contato" titulo="Fale com a organização">
        A inscrição é feita neste site. WhatsApp e e-mail ficam para dúvidas.
      </TituloSecao>

      <motion.div
        variants={surgir}
        initial="oculto"
        animate="visivel"
        className="grid grid-cols-2 gap-px bg-pet-navy/12"
      >
        <BlocoAcao
          tom="orange"
          onClick={abrir}
          etiqueta="Inscrições"
          titulo="Inscrever-se"
          descricao={`${taxa} · Pix no site`}
        />
        <BlocoAcao
          tom="navy"
          href={linkEmail('Contato — I Simpósio PET Saúde Digital')}
          etiqueta="Assuntos formais"
          titulo="E-mail"
          descricao={evento.email}
        />
      </motion.div>

      <div className="mt-6">
        <p className="label mb-1 text-pet-navy/40">Dúvidas frequentes</p>
        {/* Comeca tudo fechado: e uma lista de consulta, nao de leitura. */}
        <Sanfona itens={blocos} inicial={null} />
      </div>
    </div>
  )
}
