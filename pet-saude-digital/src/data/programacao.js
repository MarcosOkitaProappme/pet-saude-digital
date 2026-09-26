/*
 * Grade do evento (dados ficticios), organizada por dia > turno > atividade.
 *
 * As salas seguem a estrutura real do Campus XXII (Ananindeua): auditorio,
 * cinco salas de aula e UM unico laboratorio de informatica — por isso as
 * atividades praticas nunca acontecem em paralelo.
 *
 * `tipo` controla a cor do marcador e o rotulo da atividade.
 * `palestranteId` referencia src/data/palestrantes.js — atividades sem
 * palestrante definido (intervalo, credenciamento) deixam o campo vazio.
 */

export const tiposAtividade = {
  palestra: { rotulo: 'Palestra', cor: 'bg-pet-orange' },
  minicurso: { rotulo: 'Minicurso', cor: 'bg-pet-navy' },
  oficina: { rotulo: 'Oficina', cor: 'bg-pet-navy' },
  mesa: { rotulo: 'Mesa-redonda', cor: 'bg-pet-sky' },
  projetos: { rotulo: 'Projetos PET', cor: 'bg-pet-sky' },
  institucional: { rotulo: 'Institucional', cor: 'bg-pet-deep' },
  intervalo: { rotulo: 'Intervalo', cor: 'bg-pet-navy/25' },
}

const INTERVALO_MANHA = {
  inicio: '10h00',
  fim: '10h20',
  tipo: 'intervalo',
  titulo: 'Intervalo',
  local: 'Hall de entrada',
  detalhe: 'Coffee break oferecido pela organização do evento.',
}

const INTERVALO_TARDE = {
  inicio: '15h20',
  fim: '15h40',
  tipo: 'intervalo',
  titulo: 'Intervalo',
  local: 'Hall de entrada',
  detalhe: 'Coffee break oferecido pela organização do evento.',
}

export const programacao = [
  /* ------------------------------ SEGUNDA ------------------------------ */
  {
    id: 'segunda',
    dia: 'Segunda-feira',
    diaCurto: 'Seg',
    data: '19/10',
    resumo: 'Abertura e fundamentos de saúde digital.',
    turnos: [
      {
        turno: 'Manhã',
        intervalo: '08h — 12h',
        atividades: [
          {
            inicio: '08h00',
            fim: '08h40',
            tipo: 'institucional',
            titulo: 'Credenciamento',
            local: 'Hall de entrada',
            detalhe:
              'Retirada de crachá e do material do evento. Recomenda-se chegar 15 minutos antes da abertura.',
          },
          {
            inicio: '08h40',
            fim: '09h10',
            tipo: 'institucional',
            titulo: 'Abertura oficial do simpósio',
            palestranteId: 'camila-andrade',
            local: 'Auditório',
            detalhe:
              'Apresentação institucional do PET Saúde Digital, panorama do programa na UEPA e boas-vindas da coordenação.',
          },
          {
            inicio: '09h10',
            fim: '10h00',
            tipo: 'palestra',
            titulo: 'Saúde digital na atenção primária: desafios e oportunidades',
            palestranteId: 'marcos-lima',
            local: 'Auditório',
            detalhe:
              'Panorama do uso de prontuários eletrônicos e sistemas de apoio à decisão na rede básica do SUS, com dados de unidades da região metropolitana de Belém.',
          },
          INTERVALO_MANHA,
          {
            inicio: '10h20',
            fim: '12h00',
            tipo: 'mesa',
            titulo: 'Mesa-redonda: o que é saúde digital na prática',
            palestranteId: 'anderson-souza',
            local: 'Auditório',
            detalhe:
              'Conversa de abertura entre docentes das áreas de saúde e de tecnologia sobre o que muda no cuidado quando a informação circula bem.',
          },
        ],
      },
      {
        turno: 'Tarde',
        intervalo: '13h — 17h',
        atividades: [
          {
            inicio: '13h00',
            fim: '15h20',
            tipo: 'minicurso',
            titulo: 'Introdução ao Python aplicado à saúde · Parte 1',
            palestranteId: 'rafael-bittencourt',
            local: 'Laboratório de Informática',
            detalhe:
              'Fundamentos da linguagem e primeiros passos com a biblioteca Pandas para leitura de bases de atendimento. Vagas limitadas a 30 participantes; traga notebook, se possível.',
          },
          INTERVALO_TARDE,
          {
            inicio: '15h40',
            fim: '17h00',
            tipo: 'projetos',
            titulo: 'Apresentação dos projetos do PET Saúde Digital',
            local: 'Auditório',
            detalhe:
              'Bolsistas do programa apresentam o andamento dos projetos desenvolvidos ao longo do ano, incluindo as soluções construídas em Python.',
          },
        ],
      },
    ],
  },

  /* ------------------------------- TERÇA ------------------------------- */
  {
    id: 'terca',
    dia: 'Terça-feira',
    diaCurto: 'Ter',
    data: '20/10',
    resumo: 'Dados em saúde, estatística e visualização.',
    turnos: [
      {
        turno: 'Manhã',
        intervalo: '08h — 12h',
        atividades: [
          {
            inicio: '08h00',
            fim: '10h00',
            tipo: 'minicurso',
            titulo: 'Introdução ao Python aplicado à saúde · Parte 2',
            palestranteId: 'rafael-bittencourt',
            local: 'Laboratório de Informática',
            detalhe:
              'Continuação prática da parte 1: limpeza de dados e cálculo de indicadores sobre uma base fictícia de atendimentos ambulatoriais.',
          },
          INTERVALO_MANHA,
          {
            inicio: '10h20',
            fim: '12h00',
            tipo: 'palestra',
            titulo: 'Indicadores de saúde pública: o que os números do DATASUS contam',
            palestranteId: 'beatriz-ribeiro',
            local: 'Auditório',
            detalhe:
              'Leitura crítica de séries históricas de saúde pública e os erros mais comuns na interpretação de indicadores municipais.',
          },
        ],
      },
      {
        turno: 'Tarde',
        intervalo: '13h — 17h',
        atividades: [
          {
            inicio: '13h00',
            fim: '15h20',
            tipo: 'minicurso',
            titulo: 'Visualização de dados em saúde com Python',
            palestranteId: 'beatriz-ribeiro',
            local: 'Laboratório de Informática',
            detalhe:
              'Construção de gráficos com Pandas e Matplotlib a partir de séries históricas do DATASUS. Vagas limitadas a 30 participantes.',
          },
          INTERVALO_TARDE,
          {
            inicio: '15h40',
            fim: '17h00',
            tipo: 'oficina',
            titulo: 'Oficina: montando um painel de indicadores da unidade de saúde',
            palestranteId: 'beatriz-ribeiro',
            local: 'Sala 1',
            detalhe:
              'Atividade em grupo, sem computador: quais indicadores um serviço precisa acompanhar e como organizá-los em um painel legível.',
          },
        ],
      },
    ],
  },

  /* ------------------------------- QUARTA ------------------------------ */
  {
    id: 'quarta',
    dia: 'Quarta-feira',
    diaCurto: 'Qua',
    data: '21/10',
    resumo: 'Telessaúde e o cuidado no território amazônico.',
    turnos: [
      {
        turno: 'Manhã',
        intervalo: '08h — 12h',
        atividades: [
          {
            inicio: '08h00',
            fim: '10h00',
            tipo: 'palestra',
            titulo: 'Telessaúde e o cuidado a populações ribeirinhas',
            palestranteId: 'luana-costa',
            local: 'Auditório',
            detalhe:
              'Estudos de caso de teleconsulta e teleorientação em municípios ribeirinhos do Pará, incluindo limitações de conectividade e estratégias adotadas em campo.',
          },
          INTERVALO_MANHA,
          {
            inicio: '10h20',
            fim: '12h00',
            tipo: 'oficina',
            titulo: 'Oficina: conduzindo uma teleconsulta',
            palestranteId: 'luana-costa',
            local: 'Sala 2',
            detalhe:
              'Simulação prática de atendimento remoto, com foco em comunicação, registro e encaminhamento. Atividade em duplas.',
          },
        ],
      },
      {
        turno: 'Tarde',
        intervalo: '13h — 17h',
        atividades: [
          {
            inicio: '13h00',
            fim: '15h20',
            tipo: 'minicurso',
            titulo: 'Georreferenciamento de dados de saúde com Python',
            palestranteId: 'rafael-bittencourt',
            local: 'Laboratório de Informática',
            detalhe:
              'Mapeamento de cobertura de serviços de saúde na região metropolitana de Belém usando dados públicos e bibliotecas de geoprocessamento.',
          },
          INTERVALO_TARDE,
          {
            inicio: '15h40',
            fim: '17h00',
            tipo: 'mesa',
            titulo: 'Mesa-redonda: tecnologia, dados e equidade em saúde',
            palestranteId: 'anderson-souza',
            local: 'Auditório',
            detalhe:
              'Debate aberto, com participação do público, sobre o acesso desigual à saúde digital na região Norte. Com convidados da SESPA e da SESMA.',
          },
        ],
      },
    ],
  },

  /* ------------------------------- QUINTA ------------------------------ */
  {
    id: 'quinta',
    dia: 'Quinta-feira',
    diaCurto: 'Qui',
    data: '22/10',
    resumo: 'Sistemas, interoperabilidade, IA e proteção de dados.',
    turnos: [
      {
        turno: 'Manhã',
        intervalo: '08h — 12h',
        atividades: [
          {
            inicio: '08h00',
            fim: '10h00',
            tipo: 'palestra',
            titulo: 'Prontuário eletrônico e interoperabilidade no SUS',
            palestranteId: 'camila-andrade',
            local: 'Auditório',
            detalhe:
              'Desafios de integração entre sistemas municipais, estaduais e federais, e o papel do padrão de dados na continuidade do cuidado.',
          },
          INTERVALO_MANHA,
          {
            inicio: '10h20',
            fim: '12h00',
            tipo: 'palestra',
            titulo: 'Inteligência artificial aplicada ao diagnóstico por imagem',
            palestranteId: 'henrique-nogueira',
            local: 'Auditório',
            detalhe:
              'Exemplos de modelos de IA já usados em radiologia, critérios de validação clínica e os obstáculos práticos de adoção em hospitais públicos.',
          },
        ],
      },
      {
        turno: 'Tarde',
        intervalo: '13h — 17h',
        atividades: [
          {
            inicio: '13h00',
            fim: '15h20',
            tipo: 'minicurso',
            titulo: 'Construindo uma API de dados clínicos',
            palestranteId: 'henrique-nogueira',
            local: 'Laboratório de Informática',
            detalhe:
              'Atividade prática voltada aos estudantes de Engenharia de Software do campus: como expor e consumir dados de saúde com segurança.',
          },
          INTERVALO_TARDE,
          {
            inicio: '15h40',
            fim: '17h00',
            tipo: 'oficina',
            titulo: 'Segurança e privacidade de dados em saúde (LGPD)',
            palestranteId: 'igor-farias',
            local: 'Sala 3',
            detalhe:
              'Boas práticas de tratamento de dados pessoais sensíveis em sistemas de informação em saúde, com análise de casos reais de incidentes.',
          },
        ],
      },
    ],
  },

  /* -------------------------------- SEXTA ------------------------------ */
  {
    id: 'sexta',
    dia: 'Sexta-feira',
    diaCurto: 'Sex',
    data: '23/10',
    resumo: 'Apresentação dos artigos e encerramento.',
    turnos: [
      {
        turno: 'Manhã',
        intervalo: '08h — 12h',
        atividades: [
          {
            inicio: '08h00',
            fim: '10h00',
            tipo: 'projetos',
            titulo: 'Sessão de apresentação de artigos · Bloco 1',
            local: 'Auditório',
            detalhe:
              'Apresentação oral dos trabalhos aprovados pela comissão científica, em blocos de 15 minutos com arguição.',
          },
          INTERVALO_MANHA,
          {
            inicio: '10h20',
            fim: '12h00',
            tipo: 'projetos',
            titulo: 'Sessão de apresentação de artigos · Bloco 2',
            local: 'Auditório',
            detalhe:
              'Continuação das apresentações orais, seguida de comentários da banca avaliadora.',
          },
        ],
      },
      {
        turno: 'Tarde',
        intervalo: '13h — 17h',
        atividades: [
          {
            inicio: '13h00',
            fim: '15h20',
            tipo: 'projetos',
            titulo: 'Mostra de pôsteres e projetos do PET',
            local: 'Hall de entrada e Sala 4',
            detalhe:
              'Exposição simultânea dos pôsteres, com os autores disponíveis para conversar com o público que circula.',
          },
          INTERVALO_TARDE,
          {
            inicio: '15h40',
            fim: '17h00',
            tipo: 'institucional',
            titulo: 'Premiação, encerramento e entrega de certificados',
            palestranteId: 'camila-andrade',
            local: 'Auditório',
            detalhe:
              'Anúncio dos trabalhos premiados, avaliação da semana pelos participantes e entrega dos certificados de 40 horas.',
          },
        ],
      },
    ],
  },
]
