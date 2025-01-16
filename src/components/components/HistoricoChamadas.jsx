import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Table, Badge, Button, Modal, Form } from "react-bootstrap";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import axios from "axios";
import { API_BASE_URL } from "./../config";

const getBadgeVariant = (status) => {
  switch (status) {
    case "Presente":
      return "success";
    case "Ausente":
      return "danger";
    case "Justificado":
      return "warning";
    default:
      return "secondary";
  }
};

const HistoricoChamadas = ({ turmaId, historico, onUpdateStatus, fetchResumoMaterial, alunos }) => {
  console.log("Turma ID recebido:", turmaId);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState(null);
  const [showResumoForm, setShowResumoForm] = useState(false);
  const [resumos, setResumos] = useState([]);
  const [selectedChamadaId, setSelectedChamadaId] = useState(null);
  const [usuariosDisponiveis, setUsuariosDisponiveis] = useState([]);
  const [formData, setFormData] = useState({
    alunoId: "",
    data: dayjs().format("YYYY-MM-DD"),
    hora: dayjs().format("HH:mm"),
    status: "Presente",
  });
  const [resumoData, setResumoData] = useState({
    resumo: "",
    link: "",
    linkYoutube: "",
    arquivo: null,
    aula: "",
  });

  const confirmStatusUpdate = (chamadaId, status) => {
    if (!chamadaId) {
      console.error("Erro: chamadaId não foi passado para confirmStatusUpdate");
      return;
    }
    setPendingStatusUpdate({ chamadaId, status });
    setShowConfirmModal(true);
  };

  const handleDeleteChamada = async (chamadaId) => {
    try {
      await axios.delete(`${API_BASE_URL}/chamadas/${chamadaId}`);
      toast.success("Chamada deletada com sucesso.");
      // Atualizar a lista de chamadas localmente
    } catch (error) {
      console.error("Erro ao deletar chamada:", error);
      toast.error("Erro ao deletar chamada. Tente novamente mais tarde.");
    }
  };

  const handleOpenResumoForm = (chamadaId) => {
    setSelectedChamadaId(chamadaId);
    setShowResumoForm(true);
    fetchResumos(chamadaId);
  };

  const fetchResumos = async (chamadaId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/resumos/${chamadaId}/${turmaId}`);
      setResumos(response.data);
    } catch (error) {
      console.error("Erro ao buscar resumos:", error);
    }
  };

  const handleConfirmStatusUpdate = () => {
    if (pendingStatusUpdate) {
      // Chama a função passada por props, com os parâmetros do status pendente
      onUpdateStatus(pendingStatusUpdate.chamadaId, pendingStatusUpdate.status);
      setPendingStatusUpdate(null); // Reseta o estado
      setShowConfirmModal(false); // Fecha o modal
    } else {
      toast.error("Erro ao confirmar a atualização do status.");
    }
  };

  const handleSaveResumo = async () => {
    const formData = new FormData();
    formData.append("turmaId", turmaId);
    formData.append("resumo", resumoData.resumo);
    formData.append("link", resumoData.link);
    formData.append("linkYoutube", resumoData.linkYoutube);
    formData.append("aula", resumoData.aula);
    if (resumoData.arquivo) {
      formData.append("arquivo", resumoData.arquivo);
    }

    try {
      await axios.post(`${API_BASE_URL}/resumos`, formData);
      toast.success("Resumo salvo com sucesso.");
      setResumoData({ resumo: "", link: "", linkYoutube: "", arquivo: null, aula: "" });
      fetchResumos(selectedChamadaId);
    } catch (error) {
      console.error("Erro ao salvar resumo:", error);
      toast.error("Erro ao salvar resumo. Tente novamente mais tarde.");
    }
  };

  const totalPaginas = Math.ceil(historico.length / itemsPerPage);
  const currentItems = historico.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginasVisiveis = [];
  for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPaginas, currentPage + 2); i++) {
    paginasVisiveis.push(i);
  }

  useEffect(() => {
    if (!turmaId) {
      console.error("turmaId está indefinido");
      return;
    }

    console.log("Buscando alunos para turmaId:", turmaId);

    axios
      .get(`${API_BASE_URL}/turmas/${turmaId}/alunos`)
      .then((response) => {
        setUsuariosDisponiveis(response.data);
        console.log("Alunos recebidos:", response.data);

        if (response.data.length === 1) {
          setFormData((prev) => ({
            ...prev,
            alunoId: response.data[0].cp_id,
          }));
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar alunos:", error);
        toast.error("Erro ao buscar alunos. Tente novamente.");
      });
  }, [turmaId]);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  useEffect(() => {
    if (alunos.length === 1) {
      setFormData((prev) => ({ ...prev, alunoId: alunos[0].cp_id }));
    }
  }, [alunos]);



  const handleCadastrarChamada = async () => {
    console.log("Form Data Atual:", formData);

    const { alunoId, data, hora, status } = formData;

    if (!alunoId || !data || !hora || !status || !turmaId) {
      console.error("Dados incompletos:", { turmaId, alunoId, data, hora, status });
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      console.log("Enviando dados para o back-end:", { turmaId, alunoId, data, hora, status });

      const response = await axios.post(`${API_BASE_URL}/chamadas`, { turmaId, alunoId, data, hora, status });


      console.log("Resposta do servidor:", response.data);
      toast.success("Chamada cadastrada com sucesso!");

      setFormData({
        alunoId: "",
        data: dayjs().format("YYYY-MM-DD"),
        hora: dayjs().format("HH:mm"),
        status: "Presente",
      });

      const chamadasAtualizadas = await axios.get(`${API_BASE_URL}/chamadas/turma/${turmaId}`);
      onUpdateStatus(chamadasAtualizadas.data);
    } catch (error) {
      console.error("Erro ao cadastrar chamada:", error.response?.data || error);
      toast.error("Erro ao cadastrar chamada. Tente novamente.");
    }
  };


  return (
    <div>

      <div className="mb-3 p-3 border rounded">
        <h5>Cadastrar Nova Chamada</h5>
        <Form className="d-flex align-items-center gap-3">
          <Form.Group controlId="alunoId" className="w-25">
            <Form.Label>Aluno</Form.Label>
            {alunos.length === 1 ? (
              <Form.Control
                type="text"
                value={alunos[0].cp_nome} // Mostra o nome do único aluno
                readOnly
                onFocus={() =>
                  setFormData((prev) => ({ ...prev, alunoId: alunos[0].cp_id })) // Atualiza automaticamente o alunoId
                }
              />
            ) : (
              <Form.Select
                name="alunoId"
                value={formData.alunoId}
                onChange={handleInputChange}
              >
                <option value="">Selecione um aluno</option>
                {alunos.map((aluno) => (
                  <option key={aluno.cp_id} value={aluno.cp_id}>
                    {aluno.cp_nome}
                  </option>
                ))}
              </Form.Select>
            )}
          </Form.Group>
          <Form.Group controlId="data" className="w-25">
            <Form.Label>Data</Form.Label>
            <Form.Control
              type="date"
              name="data"
              value={formData.data} // Controlado pelo estado
              onChange={handleInputChange} // Atualiza o estado ao alterar
            />
          </Form.Group>
          <Form.Group controlId="hora" className="w-25">
            <Form.Label>Hora</Form.Label>
            <Form.Control
              type="time"
              name="hora"
              value={formData.hora} // Controlado pelo estado
              onChange={handleInputChange} // Atualiza o estado ao alterar
            />
          </Form.Group>
          <Form.Group controlId="status" className="w-25">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={formData.status} // Controlado pelo estado
              onChange={handleInputChange} // Atualiza o estado ao alterar
            >
              <option value="Presente">Presente</option>
              <option value="Ausente">Ausente</option>
              <option value="Justificado">Justificado</option>
            </Form.Select>
          </Form.Group>
          <Button style={{ marginTop: "34px" }} variant="primary" onClick={handleCadastrarChamada}>
            Cadastrar
          </Button>
        </Form>
      </div>

      <div className={`d-flex`}>
        {/* Tabela */}
        <div className={`table-container ${showResumoForm ? "col-8" : "col-12"}`}>
          <div className="table-responsive scroll-sm">
            <Table className="table bordered-table sm-table mb-0">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Data</th>
                  <th>Hora</th>
                  <th>Status</th>
                  <th className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((chamada) => (
                    <tr key={chamada.cp_ch_id}>
                      <td>{chamada.cp_nome_aluno}</td>
                      <td>{dayjs(chamada.cp_ch_data).format("DD/MM/YYYY")}</td>
                      <td>{chamada.cp_ch_hora}</td>
                      <td>
                        <Badge bg={getBadgeVariant(chamada.cp_ch_status)}>
                          {chamada.cp_ch_status}
                        </Badge>
                      </td>
                      <td className="text-center d-flex gap-2 justify-content-center">
                        <Button
                          variant="link"
                          className="bg-success text-white rounded-circle"
                          onClick={() => confirmStatusUpdate(chamada.cp_ch_id, "Presente")}
                          title="Marcar como Presente"
                        >
                          <Icon icon="mdi:check-circle" />
                        </Button>
                        <Button
                          variant="link"
                          className="bg-warning text-dark rounded-circle"
                          onClick={() => confirmStatusUpdate(chamada.cp_ch_id, "Justificado")}
                          title="Marcar como Justificado"
                        >
                          <Icon icon="mdi:account-alert" />
                        </Button>
                        <Button
                          variant="link"
                          className="bg-danger-hover text-white rounded-circle"
                          onClick={() => confirmStatusUpdate(chamada.cp_ch_id, "Ausente")}
                          title="Marcar como Ausente"
                        >
                          <Icon icon="mdi:cancel" />
                        </Button>
                        <Button
                          variant="link"
                          className="bg-primary text-white rounded-circle"
                          onClick={() => handleOpenResumoForm(chamada.cp_ch_id)}
                          title="Cadastrar Resumo"
                        >
                          <Icon icon="mdi:note-plus" />
                        </Button>
                        <Button
                          variant="link"
                          className="bg-danger-focus text-danger-main rounded-circle"
                          onClick={() => handleDeleteChamada(chamada.cp_ch_id)}
                          title="Excluir Chamada"
                        >
                          <Icon icon="mingcute:delete-2-line" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      Nenhuma chamada encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
          <div className="d-flex align-items-center justify-content-between mt-24">
            <span>
              Mostrando {currentPage} de {totalPaginas} páginas
            </span>
            <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center">
              <li className="page-item">
                <button
                  className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px text-md"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  <Icon icon="ep:d-arrow-left" />
                </button>
              </li>
              <li className="page-item">
                <button
                  className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px text-md"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </button>
              </li>
              {paginasVisiveis.map((page) => (
                <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
                  <button
                    className={`page-link text-md fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px ${currentPage === page ? "bg-primary-600 text-white" : "bg-neutral-200 text-secondary-light"}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                </li>
              ))}
              {totalPaginas > 5 && currentPage + 2 < totalPaginas && (
                <li className="page-item">
                  <span className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px">
                    ...
                  </span>
                </li>
              )}
              <li className="page-item">
                <button
                  className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px text-md"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPaginas))}
                  disabled={currentPage === totalPaginas}
                >
                  Próximo
                </button>
              </li>
              <li className="page-item">
                <button
                  className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px text-md"
                  onClick={() => setCurrentPage(totalPaginas)}
                  disabled={currentPage === totalPaginas}
                >
                  <Icon icon="ep:d-arrow-right" />
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Coluna de Resumo */}
        {showResumoForm && (
          <div className="col-4 p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5>Cadastrar Resumo</h5>
              <Button
                variant="light"
                className="btn-close"
                aria-label="Close"
                onClick={() => setShowResumoForm(false)}
                title="Fechar"
              />
            </div>
            <Form>
              <Form.Group>
                <Form.Label>Resumo</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={resumoData.resumo}
                  onChange={(e) =>
                    setResumoData((prev) => ({ ...prev, resumo: e.target.value }))
                  }
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>Link</Form.Label>
                <Form.Control
                  type="text"
                  value={resumoData.link}
                  onChange={(e) =>
                    setResumoData((prev) => ({ ...prev, link: e.target.value }))
                  }
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>Link do YouTube</Form.Label>
                <Form.Control
                  type="text"
                  value={resumoData.linkYoutube}
                  onChange={(e) =>
                    setResumoData((prev) => ({ ...prev, linkYoutube: e.target.value }))
                  }
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>Arquivo</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) =>
                    setResumoData((prev) => ({ ...prev, arquivo: e.target.files[0] }))
                  }
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>Aula</Form.Label>
                <Form.Control
                  type="text"
                  value={resumoData.aula}
                  onChange={(e) =>
                    setResumoData((prev) => ({ ...prev, aula: e.target.value }))
                  }
                />
              </Form.Group>
              <Button className="mt-3" onClick={handleSaveResumo}>
                Salvar Resumo
              </Button>
            </Form>
            <hr />
            <h5>Resumos Cadastrados</h5>
            {resumos.length > 0 ? (
              resumos.map((resumo) => (
                <div key={resumo.cp_res_id} className="mb-3">
                  <p>{resumo.cp_res_resumo}</p>
                  {resumo.cp_res_link && (
                    <a href={resumo.cp_res_link} target="_blank" rel="noopener noreferrer">
                      Link
                    </a>
                  )}
                  {resumo.cp_res_linkYoutube && (
                    <a href={resumo.cp_res_linkYoutube} target="_blank" rel="noopener noreferrer">
                      Vídeo
                    </a>
                  )}
                  {resumo.cp_res_arquivo && (
                    <a href={resumo.cp_res_arquivo} target="_blank" rel="noopener noreferrer">
                      Material
                    </a>
                  )}
                </div>
              ))
            ) : (
              <p>Nenhum resumo cadastrado.</p>
            )}
          </div>
        )}

      </div>

      {/* Modal de confirmação status */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmação</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Você tem certeza que deseja alterar o status para <strong>{pendingStatusUpdate?.status}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleConfirmStatusUpdate}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>

  );
};

export default HistoricoChamadas;
