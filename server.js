app.post('/cadastrar-matricula', async (req, res) => {
  console.log('Dados recebidos no backend:', req.body);

  const {
    cursoId: cp_mt_curso,
    usuarioId: cp_mt_usuario,
    cpfUsuario: cp_mt_cadastro_usuario,
    valorCurso: cp_mt_valor_curso,
    numeroParcelas: cp_mt_quantas_parcelas,
    status: cp_status_matricula,
    escolaId: cp_mt_escola,
    escolaridade: cp_mt_escolaridade,
    localNascimento: cp_mt_local_nascimento,
    redeSocial: cp_mt_rede_social,
    nomePai: cp_mt_nome_pai,
    contatoPai: cp_mt_contato_pai,
    nomeMae: cp_mt_nome_mae,
    contatoMae: cp_mt_contato_mae,
    horarioInicio: cp_mt_horario_inicio,
    horarioFim: cp_mt_horario_fim,
    nivelIdioma: cp_mt_nivel,
    primeiraDataPagamento: cp_mt_primeira_parcela,
    nomeUsuario: cp_mt_nome_usuario,
    isMensalidade,
    diasSemana
  } = req.body;

  const newMatricula = {
    cp_mt_curso,
    cp_mt_usuario,
    cp_mt_cadastro_usuario,
    cp_mt_valor_curso,
    cp_mt_quantas_parcelas,
    cp_mt_parcelas_pagas: 0,
    cp_status_matricula,
    cp_mt_escola,
    cp_mt_escolaridade,
    cp_mt_nivel,
    cp_mt_local_nascimento,
    cp_mt_rede_social,
    cp_mt_nome_pai,
    cp_mt_contato_pai,
    cp_mt_nome_mae,
    cp_mt_contato_mae,
    cp_mt_horario_inicio,
    cp_mt_horario_fim,
    cp_mt_primeira_parcela,
    cp_mt_nome_usuario,
    cp_mt_tipo_pagamento: isMensalidade ? 'mensalidade' : 'parcelado',
    dias_semana: diasSemana ? diasSemana.join(',') : null
  };

// ==================== ROTAS DE EVENTOS ====================

// Criar novo evento
app.post('/eventos', (req, res) => {
  const { title, start, end, description, category, allDay } = req.body;

  const novoEvento = {
    ev_titulo: title,
    ev_data_inicio: start,
    ev_data_fim: end || start,
    ev_descricao: description || null,
    ev_categoria: category || 'default',
    ev_dia_todo: allDay || false,
    ev_criado_em: new Date().toISOString().slice(0, 19).replace('T', ' ')
  };

  db.query('INSERT INTO eventos SET ?', novoEvento, (err, resultado) => {
    if (err) {
      console.error('Erro ao criar evento:', err);
      return res.status(500).send({ msg: 'Erro ao criar evento' });
    }
    res.send({ 
      msg: 'Evento criado com sucesso', 
      eventoId: resultado.insertId 
    });
  });
});

// Listar todos os eventos
app.get('/eventos', (req, res) => {
  db.query('SELECT * FROM eventos ORDER BY ev_data_inicio ASC', (err, resultados) => {
    if (err) {
      console.error('Erro ao buscar eventos:', err);
      return res.status(500).send({ msg: 'Erro ao buscar eventos' });
    }

    // Converter para formato do FullCalendar
    const eventos = resultados.map(evento => ({
      id: evento.ev_id,
      title: evento.ev_titulo,
      start: evento.ev_data_inicio,
      end: evento.ev_data_fim,
      allDay: evento.ev_dia_todo,
      extendedProps: {
        description: evento.ev_descricao,
        category: evento.ev_categoria,
        isManual: false
      }
    }));

    res.send(eventos);
  });
});

// Buscar evento por ID
app.get('/eventos/:eventoId', (req, res) => {
  const { eventoId } = req.params;

  db.query('SELECT * FROM eventos WHERE ev_id = ?', [eventoId], (err, resultado) => {
    if (err) {
      console.error('Erro ao buscar evento:', err);
      return res.status(500).send({ msg: 'Erro ao buscar evento' });
    }

    if (resultado.length === 0) {
      return res.status(404).send({ msg: 'Evento não encontrado' });
    }

    const evento = resultado[0];
    res.send({
      id: evento.ev_id,
      title: evento.ev_titulo,
      start: evento.ev_data_inicio,
      end: evento.ev_data_fim,
      allDay: evento.ev_dia_todo,
      description: evento.ev_descricao,
      category: evento.ev_categoria
    });
  });
});

// Editar evento
app.put('/eventos/:eventoId', (req, res) => {
  const { eventoId } = req.params;
  const { title, start, end, description, category, allDay } = req.body;

  const eventoAtualizado = {
    ev_titulo: title,
    ev_data_inicio: start,
    ev_data_fim: end || start,
    ev_descricao: description || null,
    ev_categoria: category || 'default',
    ev_dia_todo: allDay || false
  };

  db.query(
    'UPDATE eventos SET ? WHERE ev_id = ?', 
    [eventoAtualizado, eventoId], 
    (err, resultado) => {
      if (err) {
        console.error('Erro ao editar evento:', err);
        return res.status(500).send({ msg: 'Erro ao editar evento' });
      }

      if (resultado.affectedRows === 0) {
        return res.status(404).send({ msg: 'Evento não encontrado' });
      }

      res.send({ msg: 'Evento editado com sucesso' });
    }
  );
});

// Deletar evento
app.delete('/eventos/:eventoId', (req, res) => {
  const { eventoId } = req.params;

  db.query('DELETE FROM eventos WHERE ev_id = ?', [eventoId], (err, resultado) => {
    if (err) {
      console.error('Erro ao deletar evento:', err);
      return res.status(500).send({ msg: 'Erro ao deletar evento' });
    }

    if (resultado.affectedRows === 0) {
      return res.status(404).send({ msg: 'Evento não encontrado' });
    }

    res.send({ msg: 'Evento deletado com sucesso' });
  });
});

// Buscar eventos por data específica
app.get('/eventos/data/:data', (req, res) => {
  const { data } = req.params;

  db.query(
    'SELECT * FROM eventos WHERE DATE(ev_data_inicio) = ? ORDER BY ev_data_inicio ASC', 
    [data], 
    (err, resultados) => {
      if (err) {
        console.error('Erro ao buscar eventos por data:', err);
        return res.status(500).send({ msg: 'Erro ao buscar eventos' });
      }

      const eventos = resultados.map(evento => ({
        id: evento.ev_id,
        title: evento.ev_titulo,
        start: evento.ev_data_inicio,
        end: evento.ev_data_fim,
        allDay: evento.ev_dia_todo,
        extendedProps: {
          description: evento.ev_descricao,
          category: evento.ev_categoria,
          isManual: false
        }
      }));

      res.send(eventos);
    }
  );
});

// Buscar eventos por categoria
app.get('/eventos/categoria/:categoria', (req, res) => {
  const { categoria } = req.params;

  db.query(
    'SELECT * FROM eventos WHERE ev_categoria = ? ORDER BY ev_data_inicio ASC', 
    [categoria], 
    (err, resultados) => {
      if (err) {
        console.error('Erro ao buscar eventos por categoria:', err);
        return res.status(500).send({ msg: 'Erro ao buscar eventos' });
      }

      const eventos = resultados.map(evento => ({
        id: evento.ev_id,
        title: evento.ev_titulo,
        start: evento.ev_data_inicio,
        end: evento.ev_data_fim,
        allDay: evento.ev_dia_todo,
        extendedProps: {
          description: evento.ev_descricao,
          category: evento.ev_categoria,
          isManual: false
        }
      }));

      res.send(eventos);
    }
  );
});

// ==================== ROTAS DE MATRÍCULAS ====================

// Rota para listar todas as matrículas
app.get('/matriculas', (req, res) => {