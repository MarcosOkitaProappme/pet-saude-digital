/*
 * Dados institucionais do evento.
 *
 * O endereco e a estrutura do campus sao reais (UEPA - Campus XXII, em
 * Ananindeua). Nomes de pessoas, datas, valores e contatos seguem FICTICIOS,
 * conforme acordado nas reunioes de levantamento de requisitos.
 */

export const evento = {
  nome: 'I Simpósio PET Saúde Digital',
  edicao: '2026',
  instituicao: 'Universidade do Estado do Pará',
  sigla: 'UEPA',
  chamada: 'Uma semana sobre tecnologia, dados e cuidado em saúde na Amazônia.',
  data: '19 a 23 de outubro de 2026',
  dataCurta: '19 — 23 out',
  diasSemana: 'de segunda a sexta',
  horario: '08h às 17h',
  cidade: 'Ananindeua — Pará',
  local: 'Campus XXII da UEPA — Ananindeua',
  endereco: 'Av. Independência, s/n — Icuí-Guajará',
  cep: 'Ananindeua — PA, CEP 67125-118',
  referencia: 'Ao lado da Usina da Paz do Icuí',
  taxa: 'R$ 15,00',
  cargaHoraria: '40 horas',
  publico: 'Comunidade acadêmica e profissionais de saúde e tecnologia',
  email: 'petsaudedigital@uepa.br',
  whatsapp: '5591991234567',
  whatsappExibicao: '(91) 99123-4567',
  instagram: '@petsaudedigital.uepa',
}

export const numeros = [
  { valor: '05', rotulo: 'dias de programação' },
  { valor: '40', rotulo: 'horas de atividades' },
  { valor: '08', rotulo: 'palestrantes' },
  { valor: '80', rotulo: 'vagas presenciais' },
]

export const objetivos = [
  'Divulgar o andamento dos projetos desenvolvidos pelo PET Saúde Digital.',
  'Aproximar a prática em saúde do uso aplicado de tecnologia e de Python.',
  'Oferecer minicursos práticos de formação técnica à comunidade acadêmica.',
  'Receber submissões de artigos e dar visibilidade à produção dos estudantes.',
]

/** Monta um link de WhatsApp com mensagem pré-preenchida. */
export function linkWhatsApp(mensagem) {
  return `https://wa.me/${evento.whatsapp}?text=${encodeURIComponent(mensagem)}`
}

/** Monta um link de e-mail com assunto pré-preenchido. */
export function linkEmail(assunto) {
  return `mailto:${evento.email}?subject=${encodeURIComponent(assunto)}`
}
