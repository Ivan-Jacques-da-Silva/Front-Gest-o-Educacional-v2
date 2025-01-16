// SalaDeAula.js
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import Turmas from "./components/Turmas.jsx";
import HistoricoChamadas from "./components/HistoricoChamadas.jsx";
import ResumoMaterial from "./components/ResumoMaterial.jsx";
import { API_BASE_URL } from "./config";
import axios from "axios";

const SalaDeAula = () => {
    const [turmas, setTurmas] = useState([]);
    const [selectedTurma, setSelectedTurma] = useState(null);
    const [alunos, setAlunos] = useState([]);
    const [historicoChamadas, setHistoricoChamadas] = useState([]);
    const [selectedChamadaId, setSelectedChamadaId] = useState(null);
    const [showResumoCard, setShowResumoCard] = useState(false);

    const onOpenResumo = (chamadaId) => {
        setSelectedChamadaId(chamadaId);
        setShowResumoCard(true);
    };

    const onCloseResumo = () => {
        setShowResumoCard(false);
        setSelectedChamadaId(null);
    };

    useEffect(() => {
        if (!selectedTurma) return;

        // Buscar alunos da turma selecionada
        axios.get(`${API_BASE_URL}/turmas/${selectedTurma}/alunos`)
            .then((response) => setAlunos(response.data))
            .catch((error) => {
                console.error("Erro ao buscar alunos:", error);
                toast.error("Erro ao buscar alunos. Tente novamente mais tarde.");
            });

        // Buscar histórico de chamadas da turma selecionada
        axios.get(`${API_BASE_URL}/chamadas/turma/${selectedTurma}`)
            .then((response) => setHistoricoChamadas(response.data))
            .catch((error) => console.error("Erro ao buscar histórico de chamadas:", error));
    }, [selectedTurma]); // Executa sempre que a turma selecionada muda


    useEffect(() => {
        const schoolId = localStorage.getItem("schoolId");
        const userId = localStorage.getItem("userId");

        axios.get(`${API_BASE_URL}/turmasComAlunos`)
            .then((response) => {
                const filteredTurmas = response.data.filter(
                    (turma) => turma.cp_tr_id_escola === parseInt(schoolId) && turma.cp_tr_id_professor === parseInt(userId)
                );
                setTurmas(filteredTurmas);
            })
            .catch((error) => console.error("Erro ao buscar turmas:", error));
    }, []);

    const handleSelectTurma = (turmaId) => {
        setSelectedTurma(turmaId);

        axios.get(`${API_BASE_URL}/turmas/${turmaId}/alunos`)
            .then((response) => setAlunos(response.data))
            .catch((error) => {
                console.error("Erro ao buscar alunos:", error);
                toast.error("Erro ao buscar alunos. Tente novamente mais tarde.");
            });

        axios.get(`${API_BASE_URL}/chamadas/turma/${turmaId}`)
            .then((response) => setHistoricoChamadas(response.data))
            .catch((error) => console.error("Erro ao buscar histórico de chamadas:", error));
    };


    const handleOpenResumo = (chamadaId) => {
        setSelectedChamadaId(chamadaId);
        setShowResumoCard(true);
    };

    const handleCloseResumo = () => {
        setShowResumoCard(false);
        setSelectedChamadaId(null);
    };

    const handleUpdateStatus = async (chamadaId, status) => {
        try {
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().split('T')[0];
            const formattedTime = currentDate.toTimeString().split(' ')[0];

            await axios.put(`${API_BASE_URL}/chamadas/${chamadaId}`, {
                data: formattedDate,
                hora: formattedTime,
                status,
            });

            toast.success(`Status atualizado para: ${status}`);

            // Atualiza o histórico após o sucesso
            const response = await axios.get(`${API_BASE_URL}/chamadas/turma/${selectedTurma}`);
            setHistoricoChamadas(response.data);
        } catch (error) {
            console.error("Erro ao atualizar status:", error);
            toast.error("Erro ao atualizar status. Tente novamente.");
        }
    };



    const fetchResumoMaterial = async (chamadaId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/resumos/${chamadaId}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar materiais e resumos:", error);
            toast.error("Erro ao buscar materiais e resumos. Tente novamente mais tarde.");
            return null;
        }
    };

    return (
        <Container fluid>
            <ToastContainer />
            <Row className="justify-content-center my-4">
                <Col xs={12} md={12}>
                    <Card>
                        <Card.Body>
                            <h2 className="text-center mb-4">Sala de Aula</h2>
                            <Turmas turmas={turmas} onSelectTurma={handleSelectTurma} />

                            {selectedTurma && (
                                <>
                                    <HistoricoChamadas
                                        historico={historicoChamadas}
                                        onUpdateStatus={handleUpdateStatus}
                                        fetchResumoMaterial={fetchResumoMaterial}
                                        onOpenResumo={onOpenResumo}
                                        turmaId={selectedTurma}
                                        alunos={alunos}
                                    />

                                    {/* <ResumoMaterial turmaId={selectedTurma} /> */}
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                {showResumoCard && (
                    <Col md={6}>
                        <Card>
                            <Card.Body>
                                <Button variant="secondary" onClick={handleCloseResumo}>
                                    Fechar
                                </Button>
                                <ResumoMaterial turmaId={selectedTurma} chamadaId={selectedChamadaId} />
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default SalaDeAula;
