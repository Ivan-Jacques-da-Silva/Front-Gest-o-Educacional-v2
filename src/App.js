
import { HashRouter, Route, Routes } from "react-router-dom";
import RouteScrollToTop from "./helper/RouteScrollToTop";

// Importação centralizada de todas as páginas
import {
  // Auth Pages
  Login,
  ErrorPage,
  
  // Main Pages
  Home,
  
  // Cadastro Pages
  PaginaCadastroUsuario,
  PaginaCadastroEscola,
  PaginaCadastroMatricula,
  PaginaCadastroTurma,
  PaginaCadastroAudio,
  
  // Management Pages
  UsuarioPage,
  MatriculaPage,
  TurmaPage,
  EscolaPage,
  FinanceiroPage,
  AudioPage,
  
  // Education Pages
  TreinamentoPage,
  MaterialExtraPage,
  SalaDeAulaPage,
  SalaDeAulaAlunoPage,
  AgendaPage
} from "./pages";

function App() {
  return (
    <HashRouter>
      <RouteScrollToTop />
      <Routes>
        {/* Auth Routes */}
        <Route exact path="/" element={<Login />} />
        <Route exact path="/home" element={<Home />} />

        {/* Cadastro Routes */}
        <Route exact path="/cadastro-usuario" element={<PaginaCadastroUsuario />} />
        <Route exact path="/cadastro-usuario/:id" element={<PaginaCadastroUsuario />} />
        <Route exact path="/cadastro-escola" element={<PaginaCadastroEscola />} />
        <Route exact path="/cadastro-escola/:id" element={<PaginaCadastroEscola />} />
        <Route exact path="/cadastro-turma" element={<PaginaCadastroTurma />} />
        <Route exact path="/cadastro-turma/:id" element={<PaginaCadastroTurma />} />
        <Route exact path="/cadastro-matricula" element={<PaginaCadastroMatricula />} />
        <Route exact path="/cadastro-matricula/:matriculaId" element={<PaginaCadastroMatricula />} />
        <Route exact path="/cadastro-audio" element={<PaginaCadastroAudio />} />
        <Route exact path="/cadastro-audio/:id" element={<PaginaCadastroAudio />} />

        {/* Management Routes */}
        <Route exact path="/matriculas" element={<MatriculaPage />} />
        <Route exact path="/usuarios" element={<UsuarioPage />} />
        <Route exact path="/escolas" element={<EscolaPage />} />
        <Route exact path="/turmas" element={<TurmaPage />} />
        <Route exact path="/financeiro" element={<FinanceiroPage />} />
        <Route exact path="/audios" element={<AudioPage />} />

        {/* Education Routes */}
        <Route exact path="/treinamento" element={<TreinamentoPage />} />
        <Route exact path="/material-extra" element={<MaterialExtraPage />} />
        <Route exact path="/sala-de-aula" element={<SalaDeAulaPage />} />
        <Route exact path="/sala-de-aula-aluno" element={<SalaDeAulaAlunoPage />} />
        <Route exact path="/agenda" element={<AgendaPage />} />

        {/* Error Route */}
        <Route exact path="*" element={<ErrorPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
