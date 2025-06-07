
import { HashRouter, Route, Routes } from "react-router-dom";
import RouteScrollToTop from "./helper/RouteScrollToTop";

// Pages - Auth
import Login from "./pages/Login";
import ErrorPage from "./pages/ErrorPage";

// Pages - Main
import Home from "./pages/Home";

// Pages - Cadastros (Forms)
import CadastroUsuario from "./pages/PaginaCadastroUsuario";
import CadastroEscola from "./pages/PaginaCadastroEscola";
import CadastroMatricula from "./pages/PaginaCadastroMatricula";
import CadastroTurma from "./pages/PaginaCadastroTurma";
import CadastroAudio from "./pages/PaginaCadastroAudio";
import CadastroAudioEditar from "./pages/PaginaCadastroAudio";

// Pages - Edit Forms
import PaginaCadastroUsuario from "./pages/PaginaCadastroUsuario.jsx";
import PaginaCadastroEscola from "./pages/PaginaCadastroEscola";
import PaginaCadastroMatricula from "./pages/PaginaCadastroMatricula";
import PaginaCadastroTurma from "./pages/PaginaCadastroTurma";

// Pages - Management
import UsuarioPage from "./pages/UsuarioPage.jsx";
import MatriculaPage from "./pages/MatriculaPage";
import Turmas from "./pages/TurmaPage.jsx";
import Escolas from "./pages/EscolaPage.jsx";
import Financeiro from "./pages/FinanceiroPage.jsx";
import Audios from "./pages/AudioPage.jsx";

// Pages - Education
import Treinamento from "./pages/TreinamentoPage.jsx";
import MaterialExtra from "./pages/MaterialExtraPage.jsx";
import SalaDeAula from "./pages/SalaDeAulaPage.jsx";
import SalaDeAulaAluno from "./pages/SalaDeAulaAlunoPage.jsx";
import Agenda from "./pages/AgendaPage.jsx";

function App() {
  return (
    <HashRouter>
      <RouteScrollToTop />
      <Routes>
        {/* Auth Routes */}
        <Route exact path="/" element={<Login />} />
        <Route exact path="/home" element={<Home />} />

        {/* Cadastro Routes */}
        <Route exact path="/cadastro-usuario" element={<CadastroUsuario />} />
        <Route exact path="/cadastro-usuario/:id" element={<PaginaCadastroUsuario />} />
        <Route exact path="/cadastro-escola" element={<CadastroEscola />} />
        <Route exact path="/cadastro-escola/:id" element={<PaginaCadastroEscola />} />
        <Route exact path="/cadastro-turma" element={<CadastroTurma />} />
        <Route exact path="/cadastro-turma/:id" element={<PaginaCadastroTurma />} />
        <Route exact path="/cadastro-matricula" element={<CadastroMatricula />} />
        <Route exact path="/cadastro-matricula/:matriculaId" element={<PaginaCadastroMatricula />} />
        <Route exact path="/cadastro-audio" element={<CadastroAudio />} />
        <Route exact path="/cadastro-audio/:id" element={<CadastroAudioEditar />} />

        {/* Management Routes */}
        <Route exact path="/matriculas" element={<MatriculaPage />} />
        <Route exact path="/usuarios" element={<UsuarioPage />} />
        <Route exact path="/escolas" element={<Escolas />} />
        <Route exact path="/turmas" element={<Turmas />} />
        <Route exact path="/financeiro" element={<Financeiro />} />
        <Route exact path="/audios" element={<Audios />} />

        {/* Education Routes */}
        <Route exact path="/treinamento" element={<Treinamento />} />
        <Route exact path="/material-extra" element={<MaterialExtra />} />
        <Route exact path="/sala-de-aula" element={<SalaDeAula />} />
        <Route exact path="/sala-de-aula-aluno" element={<SalaDeAulaAluno />} />
        <Route exact path="/agenda" element={<Agenda />} />

        {/* Error Route */}
        <Route exact path="*" element={<ErrorPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
