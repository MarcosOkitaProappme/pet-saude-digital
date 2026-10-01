/*
 * Instituicoes envolvidas (dados ficticios).
 *
 * O cliente foi explicito na reuniao de validacao: "parceiros e uma coisa,
 * patrocinadores e outra, e quem promove o evento e outra". Por isso os tres
 * grupos ficam separados aqui e aparecem em blocos distintos no layout.
 */

export const realizacao = [
  {
    sigla: 'UEPA',
    nome: 'Universidade do Estado do Pará',
    papel: 'Instituição promotora',
  },
  {
    sigla: 'PET',
    nome: 'PET Saúde Digital · UEPA',
    papel: 'Programa responsável',
  },
]

export const patrocinadores = [
  {
    sigla: 'TS',
    nome: 'TechSaúde Soluções Digitais',
    tipo: 'Cota ouro',
    descricao: 'Empresa de sistemas de gestão hospitalar sediada em Belém.',
  },
  {
    sigla: 'HM',
    nome: 'Hospital Metropolitano de Belém',
    tipo: 'Cota prata',
    descricao: 'Hospital de referência em média e alta complexidade.',
  },
  {
    sigla: 'IA',
    nome: 'Instituto Amazônia Digital',
    tipo: 'Cota prata',
    descricao: 'Instituto de pesquisa aplicada em tecnologia para a região Norte.',
  },
]

export const parceiros = [
  {
    sigla: 'LAIS',
    nome: 'Liga Acadêmica de Informática em Saúde',
    descricao: 'Liga estudantil da UEPA, responsável pelo apoio de monitoria.',
  },
  {
    sigla: 'SPIM',
    nome: 'Sociedade Paraense de Informática Médica',
    descricao: 'Apoio na composição da comissão científica.',
  },
  {
    sigla: 'SESMA',
    nome: 'Secretaria Municipal de Saúde de Belém',
    descricao: 'Cessão de dados públicos utilizados nos minicursos.',
  },
  {
    sigla: 'SESPA',
    nome: 'Secretaria de Estado de Saúde Pública',
    descricao: 'Apoio institucional e divulgação na rede estadual.',
  },
]
