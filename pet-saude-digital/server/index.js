import express from 'express'
import session from 'express-session'
import cors from 'cors'
import { iniciarBanco } from './db.js'
import { publico } from './rotas/publico.js'
import { participante } from './rotas/participante.js'
import { admin } from './rotas/admin.js'
import { webhook } from './rotas/webhook.js'

const app = express()
const PORT = Number(process.env.PORT || 3001)

app.set('trust proxy', 1)
app.use(cors({ origin: true, credentials: true }))
app.use(express.json({ limit: '200kb' }))
app.use(
  session({
    name: 'psd.sid',
    secret: process.env.SESSION_SECRET || 'troque-isto-no-trabalho',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  }),
)

app.get('/api/saude', (_req, res) => res.json({ ok: true }))
app.use('/api', publico)
app.use('/api/inscricoes', participante)
app.use('/api/admin', admin)
app.use('/api/webhooks', webhook)

app.use((err, _req, res, _next) => {
  const status = err.status || 500
  if (status >= 500) console.error(err)
  res.status(status).json({ erro: err.message || 'Erro interno.' })
})

await iniciarBanco()
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API na porta ${PORT}`)
})
