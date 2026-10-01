# PET Saúde Digital · UEPA — site do I Simpósio

SPA em React construída para o evento **I Simpósio PET Saúde Digital**, da Universidade do
Estado do Pará — 19 a 23 de outubro de 2026, no **Campus XXII, em Ananindeua/PA**.

O endereço e a estrutura do campus são reais (Av. Independência, s/n, Icuí-Guajará, ao lado da
Usina da Paz do Icuí; auditório, cinco salas e **um único** laboratório de informática — por
isso os minicursos práticos nunca acontecem em paralelo). Nomes de pessoas, datas, valores e
contatos seguem **fictícios**, conforme acordado nas reuniões de levantamento de requisitos.

As fotografias em `src/assets/palestrantes/` foram recortadas em quadrado (500×500) e
comprimidas: 4,6 MB no original viraram ~250 KB no total.

---

## Como rodar

```bash
npm install
npm run dev      # ambiente de desenvolvimento em http://localhost:5173
npm run api      # API Express + MySQL (porta 3001) — use com o Vite
npm run build    # gera a versão de produção em dist/
npm run preview  # serve o build gerado, para conferência antes de publicar
```

### Docker (Nginx + front + API + MySQL)

Uma porta só: **http://localhost**. O Nginx encaminha `/` ao site e `/api` à API.

```bash
cp .env.example .env   # opcional — as chaves Asaas/Resend podem ficar vazias no trabalho
docker compose up --build
```

Admin: `http://localhost/admin` (padrão `admin@petsaude.local` / `admin123`). Sem `ASAAS_API_KEY`, o Pix é simulado e o comprovante vai para `server/outbox/`.

> No Windows, o `npm run dev` mantém um handle aberto em `dist/`. Se o build
> falhar com "o processo não pode acessar o arquivo", pare o dev server antes.

### Verificação automática de layout

```bash
npm run preview      # em um terminal
npm run verificar    # em outro
```

O script abre o site em Chrome headless, percorre as sete abas em 390px, 768px
e 1440px e falha se algum elemento vazar para fora da tela, se algum painel
vier vazio ou se houver erro de JavaScript. Para salvar as capturas:

```bash
npm run verificar -- http://localhost:4173 ./capturas
```

Usa o Chrome já instalado (via `puppeteer-core`, sem baixar Chromium). Se o
caminho do Chrome for outro, defina `CHROME_PATH`.

### Medir a rolagem por aba

```bash
node scripts/medir-altura.mjs
```

Mostra, por aba e por tamanho de tela, quantas vezes o conteúdo excede a altura
visível — `1.00x` significa "coube exatamente". É o número que guia qualquer
decisão de acrescentar conteúdo a uma aba: se passar de ~1.3x no celular, o
conteúdo novo deve entrar em um item de `Sanfona`, não solto na tela.

### Compartilhar por um túnel

```bash
npm run build && npm run preview
npx cloudflared tunnel --url http://localhost:4173
```

O `preview.allowedHosts` já está liberado no `vite.config.js` para isso. O
link só funciona enquanto os dois processos estiverem rodando.

O `vite.config.js` usa `base: './'`, então a pasta `dist/` pode ser publicada tanto na raiz de
um domínio quanto em uma subpasta (ex.: `uepa.br/petsaude`) sem ajuste adicional.

---

## Decisões que vieram do cliente

| Requisito levantado na reunião | Como foi resolvido no código |
| --- | --- |
| "Não quero telas extensas com scroll; quero um menu que troque o conteúdo" | SPA de abas: `useAbas` guarda a aba ativa e `App.jsx` monta só a seção correspondente. Ticker, cabeçalho e menu ficam fixos; apenas o `<main>` rola. |
| Paleta do PET (azul fechado + laranja), e não a da UEPA | Paleta B registrada em `tailwind.config.js` como `pet.navy`, `pet.deep`, `pet.orange`, `pet.sky`, `pet.ice`. |
| Tipografia: opção de família única | IBM Plex Sans em todos os níveis — a hierarquia vem de peso, tamanho e entreletra. |
| "Tentar minimizar de tal forma que caiba tudo em uma tela" | Cada aba mostra só um núcleo sempre visível; o resto fica em `Sanfona` (um item aberto por vez), **fechada por padrão no celular** e com o primeiro item aberto no desktop. A programação mostra um turno por vez no celular. |
| "Se eu clicar na palestra, aparece o detalhe; no palestrante também" | Linhas da programação expandem no clique; palestrantes abrem um painel com minicurrículo e as atividades em que participam. |
| "Posso acessar todos os palestrantes em conjunto" | Aba 03 lista os oito palestrantes de forma independente da grade. |
| "Parceiros é uma coisa, patrocinadores é outra, e quem promove é outra" | Aba 06 separa **Realização**, **Patrocinadores** e **Parceiros** em blocos distintos. |
| "Quando a UEPA promove, a marca dela fica embaixo" | Assinatura da UEPA no rodapé, e não no cabeçalho. |
| Inscrição paga de R$ 15,00, contato por WhatsApp | CTA fixo no cabeçalho (desktop) e barra fixa inferior (mobile), ambas para `wa.me`. |
| Submissão por e-mail e WhatsApp, sem formulário | Aba 04 com blocos de ação `mailto:` e `wa.me`. |
| Divulgação principalmente por WhatsApp | Layout mobile-first e hash na URL (`#programacao`) para compartilhar link direto de uma seção. |

---

## Estrutura

```
src/
├── App.jsx                    estrutura da SPA e troca de abas
├── main.jsx                   ponto de entrada
├── index.css                  base do Tailwind + utilitários do projeto
│
├── config/
│   └── abas.js                registro das sete abas (id, número, rótulo)
│
├── data/                      conteúdo do evento — trocar aqui, não nos componentes
│   ├── evento.js              dados institucionais, números, links de contato
│   ├── palestrantes.js        lista única de palestrantes (fonte de verdade)
│   ├── programacao.js         grade por dia > turno > atividade
│   └── apoiadores.js          realização, patrocinadores e parceiros
│
├── hooks/
│   └── useAbas.js             aba ativa, hash da URL, direção da animação, setas do teclado
│
├── lib/
│   └── motion.js              variantes de animação compartilhadas
│
└── components/
    ├── layout/                Ticker, Cabecalho, MenuAbas, Rodape, BarraInscricao
    ├── ui/                    TituloSecao, Monograma, BlocoAcao
    └── sections/              uma seção por aba (Sobre … Contato)
```

### Para atualizar o conteúdo

Nada em `components/` precisa ser tocado para trocar informação do evento:

- **datas, valores, contatos** → `src/data/evento.js`
- **palestrantes** → `src/data/palestrantes.js` (o `id` é o que liga à programação)
- **grade** → `src/data/programacao.js`
- **instituições** → `src/data/apoiadores.js`

---

## Detalhes de implementação

- **Navegação por teclado** — setas ← e → trocam de aba; `Esc` fecha o perfil do palestrante.
- **Link direto** — a aba ativa é gravada no hash (`#submissao`), então dá para mandar no
  WhatsApp um link que abre direto na seção certa.
- **Sem biblioteca de ícones** — as poucas setas são SVG inline, o que evita 300 kB de
  dependência para meia dúzia de traços.
- **Fotos e logos** — enquanto as imagens não chegam, `Monograma` ocupa o lugar delas sem
  quebrar o layout. Substituir por `<img>` quando os arquivos forem enviados.
- **`prefers-reduced-motion`** — as animações são desligadas para quem configurou o sistema
  para reduzir movimento.

---

## Pendências do inventário de conteúdo

Itens que dependem de terceiros e ainda não chegaram:

- [ ] Logos da UEPA e do PET Saúde em vetor (SVG/AI/EPS)
- [ ] Fotografias dos palestrantes + autorização de uso de imagem
- [ ] Endereço oficial, com nome correto do prédio e das salas
- [ ] Grade final validada pela comissão científica
- [ ] E-mail e WhatsApp institucionais reais
