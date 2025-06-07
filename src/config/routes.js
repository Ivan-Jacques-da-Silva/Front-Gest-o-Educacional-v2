
// Configuração centralizada de rotas do sistema
export const ROUTES = {
  // Auth Routes
  LOGIN: '/',
  HOME: '/home',
  
  // Cadastro Routes
  CADASTRO_USUARIO: '/cadastro-usuario',
  CADASTRO_USUARIO_EDIT: '/cadastro-usuario/:id',
  CADASTRO_ESCOLA: '/cadastro-escola',
  CADASTRO_ESCOLA_EDIT: '/cadastro-escola/:id',
  CADASTRO_TURMA: '/cadastro-turma',
  CADASTRO_TURMA_EDIT: '/cadastro-turma/:id',
  CADASTRO_MATRICULA: '/cadastro-matricula',
  CADASTRO_MATRICULA_EDIT: '/cadastro-matricula/:matriculaId',
  CADASTRO_AUDIO: '/cadastro-audio',
  CADASTRO_AUDIO_EDIT: '/cadastro-audio/:id',
  
  // Management Routes
  MATRICULAS: '/matriculas',
  USUARIOS: '/usuarios',
  ESCOLAS: '/escolas',
  TURMAS: '/turmas',
  FINANCEIRO: '/financeiro',
  AUDIOS: '/audios',
  
  // Education Routes
  TREINAMENTO: '/treinamento',
  MATERIAL_EXTRA: '/material-extra',
  SALA_DE_AULA: '/sala-de-aula',
  SALA_DE_AULA_ALUNO: '/sala-de-aula-aluno',
  AGENDA: '/agenda',
  
  // Error Route
  NOT_FOUND: '*'
};

// Função para construir rotas com parâmetros
export const buildRoute = (route, params = {}) => {
  let finalRoute = route;
  Object.keys(params).forEach(key => {
    finalRoute = finalRoute.replace(`:${key}`, params[key]);
  });
  return finalRoute;
};
