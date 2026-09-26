import { motion } from 'framer-motion'
import { parceiros, patrocinadores, realizacao } from '../../data/apoiadores'
import { escalonar, surgir } from '../../lib/motion'
import TituloSecao from '../ui/TituloSecao'
import Sanfona from '../ui/Sanfona'
import Monograma from '../ui/Monograma'

export default function Apoiadores() {
  /*
   * Os tres papeis continuam separados, como o cliente exigiu — mas agora um
   * de cada vez, para nao empilhar treze blocos numa tela de celular.
   */
  const blocos = [
    {
      id: 'realizacao',
      titulo: 'Realização',
      resumo: 'UEPA e PET Saúde Digital',
      conteudo: (
        <motion.div
          variants={escalonar(0.08)}
          initial="oculto"
          animate="visivel"
          className="grid gap-px bg-pet-navy/12 sm:grid-cols-2"
        >
          {realizacao.map((item) => (
            <motion.div
              key={item.sigla}
              variants={surgir}
              className="flex items-center gap-4 bg-pet-deep p-4"
            >
              <Monograma
                texto={item.sigla}
                tamanho="md"
                tom="deep"
                className="border border-white/20"
              />
              <div className="min-w-0">
                <p className="label text-pet-sky">{item.papel}</p>
                <p className="mt-1 text-[13.5px] font-semibold leading-snug tracking-tight text-white">
                  {item.nome}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ),
    },
    {
      id: 'patrocinadores',
      titulo: 'Patrocinadores',
      resumo: `${patrocinadores.length} empresas · apoio financeiro`,
      conteudo: (
        <motion.div
          variants={escalonar(0.07)}
          initial="oculto"
          animate="visivel"
          className="grid border-b border-r border-pet-navy/12 sm:grid-cols-3"
        >
          {patrocinadores.map((item) => (
            <motion.div
              key={item.sigla}
              variants={surgir}
              className="-ml-px -mt-px flex items-start gap-3.5 border-l border-t border-pet-navy/12 p-3.5 sm:block"
            >
              <Monograma texto={item.sigla} tamanho="md" tom="ice" className="flex-none" />
              <div className="min-w-0 sm:mt-3">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-[13.5px] font-semibold leading-snug tracking-tight text-pet-deep">
                    {item.nome}
                  </p>
                  <span className="label flex-none text-pet-orange">{item.tipo}</span>
                </div>
                <p className="mt-1 text-[12px] leading-relaxed text-pet-navy/60">
                  {item.descricao}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ),
    },
    {
      id: 'parceiros',
      titulo: 'Parceiros',
      resumo: `${parceiros.length} instituições · apoio operacional`,
      conteudo: (
        <motion.div
          variants={escalonar(0.06)}
          initial="oculto"
          animate="visivel"
          className="grid border-b border-r border-pet-navy/12 sm:grid-cols-2"
        >
          {parceiros.map((item) => (
            <motion.div
              key={item.sigla}
              variants={surgir}
              className="-ml-px -mt-px flex gap-3.5 border-l border-t border-pet-navy/12 p-3"
            >
              <Monograma texto={item.sigla} tamanho="sm" tom="contorno" className="text-[10px]" />
              <div className="min-w-0">
                <p className="text-[13px] font-semibold leading-snug tracking-tight text-pet-deep">
                  {item.nome}
                </p>
                <p className="mt-0.5 text-[11.5px] leading-relaxed text-pet-navy/60">
                  {item.descricao}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ),
    },
  ]

  return (
    <div className="mx-auto max-w-3xl">
      <TituloSecao
        numero="06"
        etiqueta="Apoiadores"
        titulo="Quem promove, quem patrocina e quem apoia"
      >
        Três papéis diferentes: a instituição promotora assina o evento, o patrocinador o financia
        e o parceiro contribui com estrutura, pessoas ou conteúdo.
      </TituloSecao>

      <Sanfona itens={blocos} inicial={0} />

      <p className="mt-4 text-[11px] leading-relaxed text-pet-navy/40">
        Os monogramas ocupam o lugar dos logotipos até que os arquivos em vetor sejam enviados
        pelas instituições.
      </p>
    </div>
  )
}
