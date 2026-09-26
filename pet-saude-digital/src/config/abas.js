/*
 * Registro das abas da SPA.
 *
 * O `id` e usado como estado da aba ativa e tambem como hash da URL
 * (ex: .../#programacao), o que permite divulgar um link direto para uma
 * secao especifica no WhatsApp sem quebrar a navegacao por abas.
 */

export const abas = [
  { id: 'sobre', numero: '01', rotulo: 'Sobre', rotuloCurto: 'Sobre' },
  { id: 'programacao', numero: '02', rotulo: 'Programação', rotuloCurto: 'Program.' },
  { id: 'palestrantes', numero: '03', rotulo: 'Palestrantes', rotuloCurto: 'Palestr.' },
  { id: 'submissao', numero: '04', rotulo: 'Submissão', rotuloCurto: 'Artigos' },
  { id: 'local', numero: '05', rotulo: 'Local', rotuloCurto: 'Local' },
  { id: 'apoiadores', numero: '06', rotulo: 'Apoiadores', rotuloCurto: 'Apoio' },
  { id: 'contato', numero: '07', rotulo: 'Contato', rotuloCurto: 'Contato' },
]

export const abaInicial = 'sobre'
