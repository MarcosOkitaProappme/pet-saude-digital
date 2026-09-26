/** @type {import('tailwindcss').Config} */

/*
 * Design tokens do projeto.
 *
 * Cores: Paleta B ("PET-Saude Digital"), aprovada pelo cliente na reuniao de
 * 03/09 — azul-marinho como base e laranja como cor de acao.
 * Tipografia: Opcao 6 ("Familia unica") — IBM Plex Sans em todos os niveis,
 * variando apenas peso, tamanho e entreletra.
 */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        pet: {
          navy: '#173C5E', // primaria — estrutura, cabecalho, titulos
          deep: '#0E2740', // primaria escura — rodape, texto de maior contraste
          ink: '#081A2B', // extensao da primaria para fundos de maior peso
          orange: '#E8531C', // destaque — acoes, marcadores, numeracao
          sky: '#5BA3D9', // apoio — detalhes graficos, palavras destacadas
          ice: '#E7F1F9', // fundo suave — areas alternadas
          paper: '#F7FAFC', // base clara de leitura
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        display: '-0.035em',
        label: '0.18em',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.85)', opacity: '0.7' },
          '70%': { transform: 'scale(1.6)', opacity: '0' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
      },
      animation: {
        marquee: 'marquee 38s linear infinite',
        'pulse-ring': 'pulseRing 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
