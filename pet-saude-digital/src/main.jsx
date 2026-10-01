import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App.jsx'
import { SessaoProvider } from './contexto/Sessao.jsx'
import { InscricaoProvider } from './contexto/Inscricao.jsx'
import ModalInscricao from './components/inscricao/ModalInscricao.jsx'
import Entrar from './paginas/Entrar.jsx'
import MinhaInscricao from './paginas/MinhaInscricao.jsx'
import Admin from './paginas/Admin.jsx'
import Privacidade from './paginas/Privacidade.jsx'
import './index.css'

function Raiz() {
  return (
    <SessaoProvider>
      <InscricaoProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/entrar" element={<Entrar />} />
          <Route path="/minha-inscricao" element={<MinhaInscricao />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/privacidade" element={<Privacidade />} />
        </Routes>
        <ModalInscricao />
      </InscricaoProvider>
    </SessaoProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Raiz />
    </BrowserRouter>
  </React.StrictMode>,
)
