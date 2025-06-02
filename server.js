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