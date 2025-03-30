import React, { useState, useEffect } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";
import { API_BASE_URL } from "./config";
import './financeiro.css'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, Button, Form } from "react-bootstrap";


const Financeiro = () => {
    const [dados, setDados] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [nomeFiltro, setNomeFiltro] = useState("");
    const [statusFiltro, setStatusFiltro] = useState("");
    const [totalAtrasado, setTotalAtrasado] = useState(0);
    const [valorMensal, setValorMensal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [userType] = useState(parseInt(localStorage.getItem("userType"), 10));
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedParcela, setSelectedParcela] = useState(null);
    const [newStatus, setNewStatus] = useState("");

    const handleOpenModal = (parcela) => {
        setSelectedParcela(parcela);
        const initialStatus =
            parcela.cp_mtPar_status === "Vencido" ? "à vencer" : parcela.cp_mtPar_status; // Mapeia "Vencido" para "à vencer"
        setNewStatus(initialStatus); // Inicializa com o status correto
        setModalOpen(true);
    };


    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedParcela(null);
        setNewStatus("");
    };

    const handleSaveStatus = async () => {
        try {
            setLoading(true);

            // Garantir que "Vencido" seja tratado como "à vencer" ao salvar
            const statusToSave =
                newStatus === "Pago"
                    ? "Pago"
                    : newStatus === "Não Pago" || newStatus === "Vencido"
                        ? "à vencer"
                        : newStatus;

            const response = await axios.put(
                `${API_BASE_URL}/update-status/${selectedParcela.cp_mtPar_id}`,
                { status: statusToSave }
            );

            if (response.status === 200) {
                // Atualize o estado local com o novo status
                setDados((prevDados) =>
                    prevDados.map((item) =>
                        item.cp_mtPar_id === selectedParcela.cp_mtPar_id
                            ? { ...item, cp_mtPar_status: statusToSave }
                            : item
                    )
                );
                toast.success("Status atualizado com sucesso!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (error) {
            console.error("Erro ao atualizar o status:", error);
            toast.error("Erro ao atualizar o status. Tente novamente.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } finally {
            setLoading(false);
            handleCloseModal();
        }
    };


    useEffect(() => {
        fetchFinanceiro();
    }, []);

    const fetchFinanceiro = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/financeira`);
            const parcelas = response.data;

            const fetchNomes = async (id) => {
                try {
                    const response = await axios.get(`${API_BASE_URL}/financeira/${id}`);
                    const data = response.data[0];

                    const userType = parseInt(localStorage.getItem("userType"), 10);
                    const schoolId = parseInt(localStorage.getItem("schoolId"), 10);
                    const userName = localStorage.getItem("userName");

                    // console.log("Verificando - userType:", userType, "schoolId:", schoolId, "userName:", userName, "Data recebida:", data);

                    // Filtro principal e complementares
                    if (data && data.cp_status_matricula === "ativo") { // Filtro principal
                        if (
                            (userType === 1) || // Nível 1: Todos os dados
                            (userType === 5 && data.cp_mt_nome_usuario === userName && data.cp_mt_escola === schoolId) || // Nível 3
                            (userType !== 4 && userType !== 5 && data.cp_mt_escola === schoolId) // Nível 2 (geral para escolas)
                        ) {
                            // console.log("Dado aceito:", data.cp_mt_nome_usuario);
                            return data.cp_mt_nome_usuario;
                        }
                    }

                    // console.log("Dado rejeitado:", data ? data.cp_mt_nome_usuario : null);
                    return null; // Não atende aos critérios
                } catch (error) {
                    console.error("Erro ao buscar nome do usuário:", error);
                    return null;
                }
            };

            const verificarStatus = (status, dataVencimento) => {
                const hoje = new Date();
                const dataVenc = new Date(dataVencimento);

                // Apenas exibição; não altera o dado original
                if (status === "à vencer" && dataVenc < hoje) {
                    return "Vencido"; // Apenas para exibição no front-end
                }
                return status;
            };


            const formatarData = (data) => {
                const dataObj = new Date(data);
                const dia = String(dataObj.getDate()).padStart(2, "0");
                const mes = String(dataObj.getMonth() + 1).padStart(2, "0");
                const ano = dataObj.getFullYear();
                return `${dia}/${mes}/${ano}`;
            };

            const userType = parseInt(localStorage.getItem("userType"), 10);
            const schoolId = parseInt(localStorage.getItem("schoolId"), 10);
            const userName = localStorage.getItem("userName");

            // console.log("Informações do usuário:", { userType, schoolId, userName });

            // Caso o usuário seja do tipo 4, não deve exibir nada
            if (userType === 4) {
                setDados([]);
                setTotalAtrasado(0);
                setValorMensal(0);
                setLoading(false);
                return;
            }

            const dadosComNomes = await Promise.all(
                parcelas.map(async (parcela) => {
                    const nome = await fetchNomes(parcela.cp_mt_id);

                    if (!nome) {
                        return null; // Ignorar parcelas sem nome válido
                    }

                    const statusAtualizado = verificarStatus(
                        parcela.cp_mtPar_status,
                        parcela.cp_mtPar_dataParcela
                    );
                    const dataFormatada = formatarData(parcela.cp_mtPar_dataParcela); // Formata a data

                    return {
                        ...parcela,
                        nome,
                        cp_mtPar_status: statusAtualizado,
                        cp_mtPar_dataParcela: dataFormatada, // Usa a data formatada
                    };
                })
            );

            const dadosFiltrados = dadosComNomes.filter((dado) => dado !== null);

            setDados(dadosFiltrados);

            const totalAtrasado = dadosFiltrados
                .filter((dado) => dado.cp_mtPar_status === "Vencido")
                .reduce((acc, curr) => acc + parseFloat(curr.cp_mtPar_valorParcela), 0);
            setTotalAtrasado(totalAtrasado.toFixed(2));

            // Verificação de IDs únicos para o valor mensal
            const idsJaProcessados = new Set(); // Rastreador de IDs únicos
            let totalMensal = 0;

            dadosFiltrados.forEach((parcela) => {
                if (!idsJaProcessados.has(parcela.cp_mt_id)) {
                    // Soma o valor da primeira parcela do ID único
                    totalMensal += parseFloat(parcela.cp_mtPar_valorParcela);
                    idsJaProcessados.add(parcela.cp_mt_id); // Marca o ID como processado
                }
            });

            setValorMensal(totalMensal.toFixed(2));


        } catch (error) {
            console.error("Erro ao buscar dados financeiros:", error);
        } finally {
            setLoading(false);
        }
    };



    const filteredData = dados.filter((item) => {
        const matchesNome = item.nome?.toLowerCase().includes(nomeFiltro.toLowerCase()) ?? true;
        const updatedStatus =
            item.cp_mtPar_status === "à vencer" && new Date(item.cp_mtPar_dataParcela) < new Date()
                ? "Vencido"
                : item.cp_mtPar_status;
        const matchesStatus = !statusFiltro || updatedStatus === statusFiltro;
        return matchesNome && matchesStatus;
    });

    const totalPaginas = Math.ceil(filteredData.length / itemsPerPage);

    const paginasVisiveis = [];
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPaginas, currentPage + 2); i++) {
        paginasVisiveis.push(i);
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="card h-100 p-0 radius-12">
            <ToastContainer />
            <div className="row mb-3">
                <div className="col-12 col-md-6 mb-3 mb-md-0">
                    <div className="card p-3 shadow-sm border border-primary radius-12">
                        <div className="d-flex align-items-center gap-3">
                            <div className="icon-box bg-primary-600 text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px" }}>
                                <Icon icon="ion:cash-outline" width="24" height="24" />
                            </div>
                            <div>
                                <h4 className="fw-bold mb-0 text-primary-600">Valor mensal</h4>
                                <p className="text-lg fw-medium mb-0">R$ {valorMensal}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6">
                    <div className="card p-3 shadow-sm border border-danger radius-12">
                        <div className="d-flex align-items-center gap-3">
                            <div className="icon-box bg-danger-600 text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px" }}>
                                <Icon icon="ion:alert-circle-outline" width="24" height="24" />
                            </div>
                            <div>
                                <h4 className="fw-bold mb-0 text-danger-600">Valor em atraso</h4>
                                <p className="text-lg fw-medium mb-0">R$ {totalAtrasado}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
                <div className="d-flex align-items-center flex-wrap gap-3">
                    <span className="text-md fw-medium text-secondary-light mb-0">Mostrar</span>
                    <select
                        className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px"
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                    >
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                    </select>
                    <form className="navbar-search">
                        <input
                            type="text"
                            className="form-control bg-base h-40-px w-auto radius-12 border border-secondary"
                            placeholder="Pesquisar por nome"
                            value={nomeFiltro}
                            onChange={(e) => setNomeFiltro(e.target.value)}
                        />
                        <Icon icon="ion:search-outline" className="icon ms-2" />
                    </form>
                    <select
                        className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px"
                        value={statusFiltro}
                        onChange={(e) => setStatusFiltro(e.target.value)}
                    >
                        <option value="">Todos os Status</option>
                        <option value="Pago">Pago</option>
                        <option value="à vencer">À vencer</option>
                        <option value="Vencido">Vencido</option>
                    </select>
                </div>
            </div>

            <div className="card-body p-24">
                <div className="table-responsive scroll-sm">
                    <table className="table bordered-table sm-table mb-0">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Status</th>
                                <th>Data de Vencimento</th>
                                <th>Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="text-center">
                                        Carregando...
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((item, index) => (
                                    <tr key={item.cp_mtPar_id || index}>
                                        <td>{item.nome || "Desconhecido"}</td>
                                        <td>
                                            <span
                                                className={`badge text-sm fw-semibold rounded-pill px-20 py-9 radius-4 text-white ${item.cp_mtPar_status === "Pago"
                                                    ? "bg-success-600"
                                                    : item.cp_mtPar_status === "à vencer" &&
                                                        new Date(item.cp_mtPar_dataParcela) < new Date()
                                                        ? "bg-danger-600"
                                                        : item.cp_mtPar_status === "à vencer"
                                                            ? "bg-warning-600"
                                                            : "bg-danger-600"
                                                    } `}
                                            >
                                                {item.cp_mtPar_status === "à vencer" &&
                                                    new Date(item.cp_mtPar_dataParcela) < new Date()
                                                    ? "Vencido"
                                                    : item.cp_mtPar_status}
                                                {(userType === 1 || userType === 2 || userType === 3) && (
                                                    <Icon
                                                        style={{ marginLeft: '5px' }}
                                                        icon="mdi:pencil-outline"
                                                        className="cursor-pointer"
                                                        width="16"
                                                        height="16"
                                                        onClick={() => handleOpenModal(item)}
                                                    />
                                                )}
                                            </span>
                                        </td>
                                        <td>{item.cp_mtPar_dataParcela}</td>
                                        <td>R$ {item.cp_mtPar_valorParcela}</td>
                                    </tr>
                                ))
                            )}

                        </tbody>
                    </table>
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
                                    className={`page-link text-md fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px ${currentPage === page ? "bg-primary-600 text-white" : "bg-neutral-200 text-secondary-light"
                                        }`}
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
                    <select
                        className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px"
                        value={currentPage}
                        onChange={(e) => setCurrentPage(Number(e.target.value))}
                    >
                        {Array.from({ length: totalPaginas }, (_, idx) => (
                            <option key={idx + 1} value={idx + 1}>
                                Página {idx + 1}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {modalOpen && (
                <Modal show={modalOpen} onHide={handleCloseModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Alterar Status</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Parcela: {selectedParcela?.nome}</p>
                        <Form.Select
                            className="mt-2"
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                        >
                            <option value="Pago">Pago</option>
                            <option value="à vencer">Não Pago</option>
                        </Form.Select>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={handleSaveStatus}>
                            Salvar
                        </Button>
                    </Modal.Footer>
                </Modal>

            )}

        </div>


    );
};

export default Financeiro;
