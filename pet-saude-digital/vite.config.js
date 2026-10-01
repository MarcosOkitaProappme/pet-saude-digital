import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // base relativo: permite publicar o site em subpasta (ex: uepa.br/petsaude)
  // sem quebrar os caminhos dos assets gerados pelo build.
  base: '/',
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': 'http://127.0.0.1:3001',
    },
  },
  preview: {
    port: 4173,
    strictPort: true,
    // Necessario para compartilhar o build por um tunel (Cloudflare, ngrok):
    // o Vite bloqueia requisicoes cujo Host nao seja localhost. Vale apenas
    // para o `npm run preview`, que serve somente os arquivos ja compilados
    // de dist/ — o servidor de desenvolvimento continua restrito.
    allowedHosts: true,
  },
})
