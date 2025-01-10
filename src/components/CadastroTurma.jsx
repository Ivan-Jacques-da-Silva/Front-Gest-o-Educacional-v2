import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "./config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Row, Col, Button, Form, Table } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

const CadastroTurmaModal = ({ closeModal, isEdit, turmaDataToEdit }) => {
  const [turmaData, setTurmaData] = useState({
    cp_tr_nome: "",
    cp_tr_data: "",
    cp_tr_id_professor: "",
    cp_tr_id_escola: "",
    cp_tr_alunos: [],
    cp_tr_curso_id: "",
  });

  const [professores, setProfessores] = useState([]);
  const [escolas, setEscolas] = useState([]);
  const [alunosPorEscola, setAlunosPorEscola] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [alunosFiltrados, setAlunosFiltrados] = useState([]);

  useEffect(() => {
    fetchProfessores();
    fetchEscolas();
    fetchCursos();
  }, []);

  useEffect(() => {
    if (turmaData.cp_tr_id_escola) {
      fetchAlunosPorEscola(turmaData.cp_tr_id_escola);
    }
  }, [turmaData.cp_tr_id_escola]);

  useEffect(() => {
    if (isEdit && turmaDataToEdit) {
      const formattedDate = new Date(turmaDataToEdit.cp_tr_data)
        .toISOString()
        .split("T")[0];
      setTurmaData({
        ...turmaDataToEdit,
        cp_tr_data: formattedDate,
        cp_tr_alunos: Array.isArray(turmaDataToEdit.cp_tr_alunos)
          ? turmaDataToEdit.cp_tr_alunos.map((aluno) => aluno.cp_id)
          : [],
      });
    }
  }, [isEdit, turmaDataToEdit]);

  const fetchProfessores = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users-professores`);
      setProfessores(response.data);
    } catch (error) {
      console.error("Erro ao buscar os professores:", error);
    }
  };

  const fetchEscolas = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/escolas`);
      setEscolas(response.data);
    } catch (error) {
      console.error("Erro ao buscar as escolas:", error);
    }
  };

  const fetchAlunosPorEscola = async (escolaId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/escola/alunos/${escolaId}`);
      setAlunosPorEscola(response.data);
      setAlunosFiltrados(response.data);
    } catch (error) {
      console.error("Erro ao buscar os alunos da escola:", error);
    }
  };

  const fetchCursos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cursos`);
      setCursos(response.data);
    } catch (error) {
      console.error("Erro ao buscar os cursos:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "cp_tr_alunos") {
      const selectedValues = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setTurmaData((prevTurmaData) => ({
        ...prevTurmaData,
        [name]: selectedValues,
      }));
    } else if (name === "cp_tr_id_escola") {
      setTurmaData((prevTurmaData) => ({ ...prevTurmaData, [name]: value }));
      fetchAlunosPorEscola(value);
    } else {
      setTurmaData((prevTurmaData) => ({ ...prevTurmaData, [name]: value }));
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setAlunosFiltrados(
      alunosPorEscola.filter((aluno) =>
        aluno.cp_nome.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  const handleCheckboxChange = (e, alunoId) => {
    const isChecked = e.target.checked;
    setTurmaData((prevData) => {
      const updatedAlunos = isChecked
        ? [...prevData.cp_tr_alunos, alunoId]
        : prevData.cp_tr_alunos.filter((id) => id !== alunoId);

      return { ...prevData, cp_tr_alunos: updatedAlunos };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const alunosSelecionados = turmaData.cp_tr_alunos.map((alunoId) =>
        alunosFiltrados.find((aluno) => aluno.cp_id === alunoId)
      );

      const dataToSend = {
        ...turmaData,
        cp_tr_alunos: alunosSelecionados.map((aluno) => aluno.cp_id),
      };

      await axios.post(`${API_BASE_URL}/register-turma`, dataToSend);
      toast.success("Turma cadastrada com sucesso");
      closeModal();
    } catch (error) {
      console.error("Erro durante o processamento:", error);
      toast.error("Erro ao realizar a solicitação");
    }
  };

  return (
    <div>
      <form className="form-container-cad" onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <div className="card mb-3">
              <div className="card-header">
                <h6 className="card-title mb-0">Informações da Turma</h6>
              </div>
              <div className="card-body">
                <Row className="gy-3">
                  <Col md={12}>
                    <label htmlFor="cp_tr_nome">Nome<span className="required">*</span>:</label>
                    <input
                      type="text"
                      id="cp_tr_nome"
                      name="cp_tr_nome"
                      value={turmaData.cp_tr_nome}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Nome da turma"
                      required
                    />
                  </Col>
                  <Col md={12}>
                    <label htmlFor="cp_tr_data">Data<span className="required">*</span>:</label>
                    <input
                      type="date"
                      id="cp_tr_data"
                      name="cp_tr_data"
                      value={turmaData.cp_tr_data}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </Col>
                  <Col md={12}>
                    <label htmlFor="cp_tr_id_professor">Professor<span className="required">*</span>:</label>
                    <select
                      id="cp_tr_id_professor"
                      name="cp_tr_id_professor"
                      value={turmaData.cp_tr_id_professor}
                      onChange={handleChange}
                      className="form-control"
                      required
                    >
                      <option value="">Selecione o professor</option>
                      {professores.map((professor) => (
                        <option key={professor.cp_id} value={professor.cp_id}>
                          {professor.cp_nome}
                        </option>
                      ))}
                    </select>
                  </Col>
                </Row>
              </div>
            </div>

            <div className="card mb-3">
              <div className="card-header">
                <h6 className="card-title mb-0">Detalhes Adicionais</h6>
              </div>
              <div className="card-body">
                <Row className="gy-3">
                  <Col md={12}>
                    <label htmlFor="cp_tr_curso_id">Curso<span className="required">*</span>:</label>
                    <select
                      id="cp_tr_curso_id"
                      name="cp_tr_curso_id"
                      value={turmaData.cp_tr_curso_id}
                      onChange={handleChange}
                      className="form-control"
                      required
                    >
                      <option value="">Selecione o curso</option>
                      {cursos.map((curso) => (
                        <option key={curso.cp_curso_id} value={curso.cp_curso_id}>
                          {curso.cp_nome_curso}
                        </option>
                      ))}
                    </select>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>

          <Col md={6}>
            <div className="card mb-3">
              <div className="card-header">
                <h6 className="card-title mb-0">Alunos</h6>
              </div>
              <div className="card-body">
                <Row className="gy-3">
                  <Col md={12}>
                    <label htmlFor="search">Buscar Aluno:</label>
                    <div className="input-group">
                      <input
                        type="text"
                        id="search"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="form-control"
                        placeholder="Digite o nome do aluno"
                      />
                      <Button variant="outline-secondary">
                        <FaSearch />
                      </Button>
                    </div>
                  </Col>

                  <Col md={12}>
                    <div className="table-responsive">
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Nome</th>
                          </tr>
                        </thead>
                        <tbody>
                          {alunosFiltrados.map((aluno) => (
                            <tr key={aluno.cp_id}>
                              <td>
                                <Form.Check
                                  type="checkbox"
                                  checked={turmaData.cp_tr_alunos.includes(aluno.cp_id)}
                                  onChange={(e) => handleCheckboxChange(e, aluno.cp_id)}
                                />
                              </td>
                              <td>{aluno.cp_nome}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>

        <div className="mt-4 text-center">
          <Button type="submit" variant="primary">
            {isEdit ? "Salvar Alterações" : "Cadastrar Turma"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CadastroTurmaModal;
