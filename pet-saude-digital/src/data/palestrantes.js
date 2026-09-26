/*
 * Palestrantes do evento (dados ficticios).
 *
 * A lista e a fonte unica: a aba "Palestrantes" exibe todos juntos e a aba
 * "Programacao" busca cada um por `id`. Assim o nome de um palestrante so
 * precisa ser corrigido em um lugar.
 *
 * FOTOS: os retratos em src/assets/palestrantes/ ja foram recortados em
 * quadrado e comprimidos (500x500, ~40 KB cada). Quem ainda nao tem `foto`
 * aparece com o monograma de iniciais, sem quebrar o layout.
 */

import fotoAnderson from '../assets/palestrantes/anderson-souza.jpg'
import fotoMarcos from '../assets/palestrantes/marcos-lima.jpg'
import fotoRafael from '../assets/palestrantes/rafael-bittencourt.jpg'
import fotoHenrique from '../assets/palestrantes/henrique-nogueira.jpg'
import fotoIgor from '../assets/palestrantes/igor-farias.jpg'

export const palestrantes = [
  {
    id: 'camila-andrade',
    nome: 'Camila Rocha Andrade',
    titulo: 'Profª Drª',
    cargo: 'Coordenadora geral do PET Saúde Digital',
    instituicao: 'UEPA · Departamento de Saúde Coletiva',
    formacao: 'Doutora em Saúde Coletiva (UFPA)',
    bio: 'Pesquisadora em telessaúde e gestão da informação em saúde na Amazônia. Coordena o PET Saúde Digital desde 2024 e integra o grupo de pesquisa em Informática em Saúde da UEPA.',
    linhas: ['Telessaúde', 'Interoperabilidade', 'Gestão da informação'],
    coordenacao: true,
  },
  {
    id: 'anderson-souza',
    nome: 'José Matheus R. S. Filho',
    titulo: 'Prof. Pós Dr.',
    cargo: 'Coordenador adjunto do PET Saúde Digital',
    instituicao: 'UEPA · Departamento de Tecnologia da Informação',
    formacao: 'Doutor em Engenharia da Computação (UFPA)',
    bio: 'Atua em projetos de transformação digital em saúde e orienta trabalhos sobre sistemas de apoio à decisão clínica. Coordena a comissão organizadora deste simpósio.',
    linhas: ['Sistemas de informação', 'Dados e equidade', 'Extensão universitária'],
    coordenacao: true,
    foto: fotoAnderson,
  },
  {
    id: 'marcos-lima',
    nome: 'Marcos Vinícius Tavares Lima',
    titulo: 'Prof. Dr.',
    cargo: 'Docente do curso de Medicina',
    instituicao: 'UEPA · Campus Belém',
    formacao: 'Doutor em Epidemiologia (USP)',
    bio: 'Pesquisa atenção primária à saúde e a adoção de tecnologias de informação na rede básica do SUS, com trabalhos publicados sobre prontuário eletrônico no Pará.',
    linhas: ['Atenção primária', 'Epidemiologia', 'SUS'],
    foto: fotoMarcos,
  },
  {
    id: 'rafael-bittencourt',
    nome: 'Rafael Souza Bittencourt',
    titulo: 'Prof. Me.',
    cargo: 'Docente do curso de Sistemas de Informação',
    instituicao: 'UEPA · Campus Belém',
    formacao: 'Mestre em Ciência da Computação (UFPA)',
    bio: 'Ministra disciplinas de programação aplicada e orienta projetos de extensão que usam Python para análise de dados de saúde pública em municípios do interior.',
    linhas: ['Python', 'Ciência de dados', 'Ensino de programação'],
    foto: fotoRafael,
  },
  {
    id: 'luana-costa',
    nome: 'Luana Ferreira Costa',
    titulo: 'Profª Drª',
    cargo: 'Docente do curso de Enfermagem',
    instituicao: 'UEPA · Campus Belém',
    formacao: 'Doutora em Enfermagem (UFPA)',
    bio: 'Desenvolve pesquisas sobre teleconsulta e teleorientação no cuidado a populações ribeirinhas, com atuação em municípios do arquipélago do Marajó.',
    linhas: ['Telessaúde', 'Saúde ribeirinha', 'Enfermagem'],
  },
  {
    id: 'henrique-nogueira',
    nome: 'Henrique Salgado Nogueira',
    titulo: 'Prof. Dr.',
    cargo: 'Pesquisador convidado',
    instituicao: 'Instituto Amazônia Digital',
    formacao: 'Doutor em Engenharia Biomédica (UNICAMP)',
    bio: 'Pesquisa aplicações de inteligência artificial em diagnóstico por imagem e os desafios de validação clínica desses modelos em hospitais públicos.',
    linhas: ['Inteligência artificial', 'Imagem médica', 'Validação clínica'],
    foto: fotoHenrique,
  },
  {
    id: 'beatriz-ribeiro',
    nome: 'Beatriz Almeida Ribeiro',
    titulo: 'Profª Ma.',
    cargo: 'Docente do curso de Estatística',
    instituicao: 'UEPA · Campus Belém',
    formacao: 'Mestra em Bioestatística (UFPA)',
    bio: 'Trabalha com visualização e análise de indicadores de saúde pública, com ênfase no uso de bibliotecas Python para leitura de séries históricas do DATASUS.',
    linhas: ['Bioestatística', 'Visualização de dados', 'DATASUS'],
  },
  {
    id: 'igor-farias',
    nome: 'Igor Cardoso Farias',
    titulo: 'Prof. Dr.',
    cargo: 'Docente do curso de Direito',
    instituicao: 'UEPA · Campus Belém',
    formacao: 'Doutor em Direito Digital (PUC-SP)',
    bio: 'Pesquisa proteção de dados pessoais sensíveis (LGPD) aplicada a sistemas de informação em saúde e presta assessoria a serviços públicos sobre governança de dados.',
    linhas: ['LGPD', 'Governança de dados', 'Direito digital'],
    foto: fotoIgor,
  },
]

/** Busca um palestrante pelo identificador. */
export function buscarPalestrante(id) {
  return palestrantes.find((p) => p.id === id)
}

/** Gera as iniciais usadas no monograma, no lugar da foto. */
export function iniciais(nome) {
  const partes = nome.split(' ').filter((p) => p.length > 2)
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
}
