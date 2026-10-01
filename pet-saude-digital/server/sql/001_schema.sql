CREATE TABLE IF NOT EXISTS config (
  id TINYINT PRIMARY KEY DEFAULT 1,
  taxa_base DECIMAL(10,2) NOT NULL DEFAULT 15.00,
  conta_pix VARCHAR(255) NOT NULL DEFAULT '',
  prazo_cancelamento_dias INT NOT NULL DEFAULT 7,
  percentual_reembolso DECIMAL(5,2) NOT NULL DEFAULT 100.00,
  inscricoes_abertas TINYINT NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS atividades (
  id VARCHAR(80) PRIMARY KEY,
  dia_id VARCHAR(32) NOT NULL,
  dia_rotulo VARCHAR(64) NOT NULL,
  data_curta VARCHAR(16) NOT NULL,
  tipo VARCHAR(32) NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  preco_extra DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  vagas INT NULL,
  ordem INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS participantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  numero CHAR(6) NOT NULL UNIQUE,
  nome_completo VARCHAR(180) NOT NULL,
  usa_nome_social TINYINT NOT NULL DEFAULT 0,
  nome_social VARCHAR(180) DEFAULT NULL,
  genero VARCHAR(40) NOT NULL,
  nascimento DATE NOT NULL,
  cpf CHAR(11) NOT NULL UNIQUE,
  email VARCHAR(180) NOT NULL UNIQUE,
  telefone VARCHAR(20) NOT NULL,
  senha_hash VARCHAR(80) NOT NULL,
  aceite_lgpd TINYINT NOT NULL DEFAULT 1,
  asaas_customer_id VARCHAR(64) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inscricoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  participante_id INT NOT NULL UNIQUE,
  status ENUM('rascunho','aguardando_pix','aguardando_gratuidade','pago','cancelada') NOT NULL DEFAULT 'aguardando_pix',
  valor DECIMAL(10,2) NOT NULL,
  asaas_payment_id VARCHAR(64) DEFAULT NULL,
  pix_payload TEXT,
  pix_qrcode TEXT,
  pix_expira_em DATETIME DEFAULT NULL,
  gratuidade_motivo TEXT,
  credenciado_em DATETIME DEFAULT NULL,
  cancelada_em DATETIME DEFAULT NULL,
  cancelada_por VARCHAR(20) DEFAULT NULL,
  status_antes_cancelar VARCHAR(40) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (participante_id) REFERENCES participantes(id)
);

CREATE TABLE IF NOT EXISTS inscricao_atividades (
  inscricao_id INT NOT NULL,
  atividade_id VARCHAR(80) NOT NULL,
  PRIMARY KEY (inscricao_id, atividade_id),
  FOREIGN KEY (inscricao_id) REFERENCES inscricoes(id) ON DELETE CASCADE,
  FOREIGN KEY (atividade_id) REFERENCES atividades(id)
);

CREATE TABLE IF NOT EXISTS webhook_eventos (
  id VARCHAR(128) PRIMARY KEY,
  payment_id VARCHAR(64) DEFAULT NULL,
  tipo VARCHAR(64) DEFAULT NULL,
  recebido_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
