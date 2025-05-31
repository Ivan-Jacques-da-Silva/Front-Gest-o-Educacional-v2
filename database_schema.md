
# Variáveis para Adicionar no Banco de Dados

## Tabela: matriculas
- `dias_semana` (VARCHAR/TEXT) - Armazena os dias da semana selecionados (ex: "terça,quarta" ou JSON format)
- `mensalidade` (BOOLEAN) - Indica se o pagamento é mensal (true) ou parcelado (false)

## Tabela: financeiro 
- `tipo_pagamento` (ENUM) - Valores: 'mensal', 'parcelado'
- `valor_mensal` (DECIMAL) - Valor da mensalidade quando tipo = 'mensal'
- `numero_parcelas` (INT) - Número de parcelas quando tipo = 'parcelado'
- `valor_parcela` (DECIMAL) - Valor de cada parcela

## Tabela: eventos (nova tabela)
- `id` (INT) - Primary key
- `titulo` (VARCHAR) - Título do evento
- `descricao` (TEXT) - Descrição do evento
- `data_evento` (DATE) - Data do evento
- `hora_evento` (TIME) - Hora do evento (opcional)
- `categoria` (VARCHAR) - Categoria do evento (meeting, training, academic, etc.)
- `icone` (VARCHAR) - Ícone do evento
- `cor_fundo` (VARCHAR) - Cor de fundo do evento
- `cor_borda` (VARCHAR) - Cor da borda do evento
- `cor_texto` (VARCHAR) - Cor do texto do evento
- `eh_oficial` (BOOLEAN) - Se é evento oficial ou criado pelo usuário
- `criado_por` (INT) - ID do usuário que criou (FK)
- `escola_id` (INT) - ID da escola (FK)
- `created_at` (TIMESTAMP) - Data de criação
- `updated_at` (TIMESTAMP) - Data de atualização

## Atualizações Necessárias:

### Matriculas:
```sql
ALTER TABLE matriculas ADD COLUMN dias_semana TEXT;
ALTER TABLE matriculas ADD COLUMN mensalidade BOOLEAN DEFAULT FALSE;
```

### Financeiro:
```sql
ALTER TABLE financeiro ADD COLUMN tipo_pagamento ENUM('mensal', 'parcelado') DEFAULT 'parcelado';
ALTER TABLE financeiro ADD COLUMN valor_mensal DECIMAL(10,2);
ALTER TABLE financeiro ADD COLUMN numero_parcelas INT;
ALTER TABLE financeiro ADD COLUMN valor_parcela DECIMAL(10,2);
```

### Nova tabela Eventos:
```sql
CREATE TABLE eventos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    data_evento DATE NOT NULL,
    hora_evento TIME,
    categoria VARCHAR(50) DEFAULT 'event',
    icone VARCHAR(10) DEFAULT '📌',
    cor_fundo VARCHAR(20) DEFAULT '#f1f5f9',
    cor_borda VARCHAR(20) DEFAULT '#64748b',
    cor_texto VARCHAR(20) DEFAULT '#475569',
    eh_oficial BOOLEAN DEFAULT FALSE,
    criado_por INT,
    escola_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (criado_por) REFERENCES usuarios(id),
    FOREIGN KEY (escola_id) REFERENCES escolas(id)
);
```

## Funcionalidades Implementadas:

### Na tela da Matrícula:
- Campo para seleção múltipla de dias da semana
- Toggle para indicar se é mensalidade ou parcelado

### Na tela Financeira:
- Exibição diferenciada para mensalidades (uma fatura com indicador visual)
- Para alunos: exibição simplificada de uma fatura

### Na tela da Agenda:
- Eventos pré-carregados do sistema
- Capacidade de criar eventos personalizados
- Categorização de eventos com cores
- Interface moderna e responsiva
- Visualização por mês, semana e dia
- Lista de eventos de hoje e próximos 5 dias
