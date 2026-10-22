const GENEROS = ['Feminino', 'Masculino', 'Não binário', 'Outro', 'Prefiro não informar']

export function soDigitos(valor = '') {
  return String(valor).replace(/\D/g, '')
}

export function cpfValido(cpf) {
  const d = soDigitos(cpf)
  if (d.length !== 11 || /^(\d)\1+$/.test(d)) return false
  const calc = (base) => {
    let soma = 0
    for (let i = 0; i < base; i++) soma += Number(d[i]) * (base + 1 - i)
    const resto = (soma * 10) % 11
    return resto === 10 ? 0 : resto
  }
  return calc(9) === Number(d[9]) && calc(10) === Number(d[10])
}

export function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim())
}

export function nascimentoValido(data) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) return false
  const dt = new Date(`${data}T00:00:00`)
  if (Number.isNaN(dt.getTime())) return false
  const hoje = new Date()
  return dt < hoje && dt.getFullYear() > 1900
}

export function telefoneValido(tel) {
  const d = soDigitos(tel)
  return d.length === 10 || d.length === 11
}

export function nomeCompletoValido(nome) {
  return String(nome || '').trim().split(/\s+/).filter(Boolean).length >= 2
}

export function erro(status, mensagem) {
  const e = new Error(mensagem)
  e.status = status
  return e
}

export function validarCadastro(corpo, { senhaObrigatoria = true } = {}) {
  const nomeCompleto = String(corpo.nomeCompleto || '').trim()
  const usaNomeSocial = Boolean(corpo.usaNomeSocial)
  const nomeSocial = String(corpo.nomeSocial || '').trim()
  const genero = String(corpo.genero || '')
  const nascimento = String(corpo.nascimento || '')
  const cpf = soDigitos(corpo.cpf)
  const email = String(corpo.email || '').trim().toLowerCase()
  const telefone = soDigitos(corpo.telefone)
  const senha = String(corpo.senha || '')
  const senha2 = String(corpo.senha2 || '')
  const aceiteLgpd = Boolean(corpo.aceiteLgpd)
  const atividades = [...new Set(Array.isArray(corpo.atividades) ? corpo.atividades.map(String) : [])]

  if (!nomeCompletoValido(nomeCompleto)) throw erro(400, 'Informe o nome completo (pelo menos duas palavras).')
  if (usaNomeSocial && nomeSocial.length < 2) throw erro(400, 'Informe o nome social.')
  if (!GENEROS.includes(genero)) throw erro(400, 'Selecione um gênero.')
  if (!nascimentoValido(nascimento)) throw erro(400, 'Informe uma data de nascimento válida.')
  if (!cpfValido(cpf)) throw erro(400, 'CPF inválido.')
  if (!emailValido(email)) throw erro(400, 'E-mail inválido.')
  if (!telefoneValido(telefone)) throw erro(400, 'Telefone inválido. Use DDD + número.')
  if (senhaObrigatoria) {
    if (senha.length < 8) throw erro(400, 'A senha precisa ter pelo menos 8 caracteres.')
    if (senha !== senha2) throw erro(400, 'As senhas não coincidem.')
    if (!aceiteLgpd) throw erro(400, 'É preciso aceitar a política de privacidade.')
  }

  return {
    nomeCompleto,
    usaNomeSocial,
    nomeSocial: usaNomeSocial ? nomeSocial : null,
    genero,
    nascimento,
    cpf,
    email,
    telefone,
    senha,
    atividades,
  }
}

export { GENEROS }
