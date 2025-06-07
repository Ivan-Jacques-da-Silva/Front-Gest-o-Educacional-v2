
import { useNavigate } from 'react-router-dom';
import { ROUTES, buildRoute } from '../config/routes';

/**
 * Hook personalizado para navegação centralizada
 * Facilita a navegação e manutenção das rotas
 */
export const useNavigation = () => {
  const navigate = useNavigate();

  const navigateTo = {
    // Auth
    login: () => navigate(ROUTES.LOGIN),
    home: () => navigate(ROUTES.HOME),
    
    // Cadastros
    cadastroUsuario: (id = null) => navigate(id ? buildRoute(ROUTES.CADASTRO_USUARIO_EDIT, { id }) : ROUTES.CADASTRO_USUARIO),
    cadastroEscola: (id = null) => navigate(id ? buildRoute(ROUTES.CADASTRO_ESCOLA_EDIT, { id }) : ROUTES.CADASTRO_ESCOLA),
    cadastroTurma: (id = null) => navigate(id ? buildRoute(ROUTES.CADASTRO_TURMA_EDIT, { id }) : ROUTES.CADASTRO_TURMA),
    cadastroMatricula: (matriculaId = null) => navigate(matriculaId ? buildRoute(ROUTES.CADASTRO_MATRICULA_EDIT, { matriculaId }) : ROUTES.CADASTRO_MATRICULA),
    cadastroAudio: (id = null) => navigate(id ? buildRoute(ROUTES.CADASTRO_AUDIO_EDIT, { id }) : ROUTES.CADASTRO_AUDIO),
    
    // Management
    usuarios: () => navigate(ROUTES.USUARIOS),
    matriculas: () => navigate(ROUTES.MATRICULAS),
    escolas: () => navigate(ROUTES.ESCOLAS),
    turmas: () => navigate(ROUTES.TURMAS),
    financeiro: () => navigate(ROUTES.FINANCEIRO),
    audios: () => navigate(ROUTES.AUDIOS),
    
    // Education
    treinamento: () => navigate(ROUTES.TREINAMENTO),
    materialExtra: () => navigate(ROUTES.MATERIAL_EXTRA),
    salaDeAula: () => navigate(ROUTES.SALA_DE_AULA),
    salaDeAulaAluno: () => navigate(ROUTES.SALA_DE_AULA_ALUNO),
    agenda: () => navigate(ROUTES.AGENDA),
    
    // Generic navigation
    goTo: (path) => navigate(path),
    goBack: () => navigate(-1),
    goForward: () => navigate(1)
  };

  return navigateTo;
};
