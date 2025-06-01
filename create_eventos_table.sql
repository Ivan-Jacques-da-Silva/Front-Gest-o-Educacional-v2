
-- Criar tabela de eventos para a agenda
CREATE TABLE IF NOT EXISTS eventos (
    ev_id INT AUTO_INCREMENT PRIMARY KEY,
    ev_titulo VARCHAR(255) NOT NULL,
    ev_data_inicio DATETIME NOT NULL,
    ev_data_fim DATETIME,
    ev_descricao TEXT,
    ev_categoria VARCHAR(50) DEFAULT 'default',
    ev_dia_todo BOOLEAN DEFAULT FALSE,
    ev_criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ev_atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX idx_eventos_data_inicio ON eventos(ev_data_inicio);
CREATE INDEX idx_eventos_categoria ON eventos(ev_categoria);
CREATE INDEX idx_eventos_data_inicio_categoria ON eventos(ev_data_inicio, ev_categoria);
