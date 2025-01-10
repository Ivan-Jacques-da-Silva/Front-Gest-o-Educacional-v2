import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "./config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Row, Col, Button, Form } from "react-bootstrap";

const CadastroAudio = ({ closeModal, isEdit, audioDataToEdit }) => {
    const [isLoading, setIsLoading] = useState()
    const [audioData, setAudioData] = useState({
        cp_curso_id: "",
        cp_audio: null,
        cp_link_youtube: "",
        cp_pdfs: [],
    });

    const [cursos, setCursos] = useState([]);

    const opcoesCursos = [
        { value: "FERRIS WHEEL 1", label: "[ING] - FERRIS WHEEL 1" },
        { value: "FERRIS WHEEL 2", label: "[ING] - FERRIS WHEEL 2" },
        { value: "FERRIS WHEEL 3", label: "[ING] - FERRIS WHEEL 3" },
        { value: "BEST BUDDIES 1", label: "[ING] - BEST BUDDIES 1" },
        { value: "BEST BUDDIES 2", label: "[ING] - BEST BUDDIES 2" },
        { value: "BEST BUDDIES 3", label: "[ING] - BEST BUDDIES 3" },
        { value: "KIDS 1", label: "[ING] - Kids 1" },
        { value: "KIDS 2", label: "[ING] - Kids 2" },
        { value: "NEXT STATION STARTER", label: "[ING] - NEXT STATION STARTER" },
        { value: "NEXT STATION 2", label: "[ING] - NEXT STATION 2" },
        { value: "NEXT STATION 3", label: "[ING] - NEXT STATION 3" },
        { value: "CIPEX TWEENS 1", label: "[ING] - CIPEX TWEENS 1" },
        { value: "CIPEX TWEENS 2", label: "[ING] - CIPEX TWEENS 2" },
        { value: "CIPEX TWEENS 3", label: "[ING] - CIPEX TWEENS 3" },
        { value: "CIPEX TWEENS 4", label: "[ING] - CIPEX TWEENS 4" },
        { value: "CIPEX TEENS 5", label: "[ING] - CIPEX TEENS 5" },
        { value: "CIPEX ENGLISH BOOK 1", label: "[ING] - CIPEX ENGLISH BOOK 1" },
        { value: "CIPEX ENGLISH BOOK 2", label: "[ING] - CIPEX ENGLISH BOOK 2" },
        { value: "CIPEX ENGLISH BOOK 3", label: "[ING] - CIPEX ENGLISH BOOK 3" },
        { value: "CIPEX ENGLISH BOOK 4", label: "[ING] - CIPEX ENGLISH BOOK 4" },
        { value: "CIPEX ENGLISH BOOK 5", label: "[ING] - CIPEX ENGLISH BOOK 5" },
        { value: "CIPEX ENGLISH BOOK 6", label: "[ING] - CIPEX ENGLISH BOOK 6" },
        { value: "CIPEX ENGLISH BOOK 7", label: "[ING] - CIPEX ENGLISH BOOK 7" },
        { value: "TV BOX CONVERSATION VOL. 1", label: "[ING] - TV BOX CONVERSATION VOL. 1" },
        { value: "TV BOX CONVERSATION VOL. 2", label: "[ING] - TV BOX CONVERSATION VOL. 2" },
        { value: "THE BUSINESS PRE-INTERMEDIATE", label: "[ING] - The Business Pre-Intermediate" },
        { value: "THE BUSINESS INTERMEDIATE", label: "[ING] - The Business Intermediate" },
        { value: "THE BUSINESS UPPER-INTERMEDIATE", label: "[ING] - The Business Upper-Intermediate" },
        { value: "THE BUSINESS ADVANCED", label: "[ING] - The Business Advanced" },
        { value: "IN COMPANY 3.0 PRE-INTERMEDIATE", label: "[ING] - In Company 3.0 Pre-Intermediate" },
        { value: "IN COMPANY 3.0 INTERMEDIATE", label: "[ING] - In Company 3.0 Intermediate" },
        { value: "IN COMPANY 3.0 UPPER-INTERMEDIATE", label: "[ING] - In Company 3.0 Upper-Intermediate" },
        { value: "IN COMPANY 3.0 ADVANCED", label: "[ING] - In Company 3.0 Advanced" },
        { value: "NUEVO ESPAÑOL EN MARCHA 1", label: "[ESP] - NUEVO ESPAÑOL EN MARCHA 1" },
        { value: "NUEVO ESPAÑOL EN MARCHA 2", label: "[ESP] - NUEVO ESPAÑOL EN MARCHA 2" },
        { value: "NUEVO ESPAÑOL EN MARCHA 3", label: "[ESP] - NUEVO ESPAÑOL EN MARCHA 3" },
        { value: "NUEVO ESPAÑOL EN MARCHA 4", label: "[ESP] - NUEVO ESPAÑOL EN MARCHA 4" },
        { value: "ALFABETIZACAO", label: "[ALE] - ALFABETIZAÇÃO" },
        { value: "MOMENTE A1", label: "[ALE] - MOMENTE A1" },
        { value: "MOMENTE A2", label: "[ALE] - MOMENTE A2" },
        { value: "MOMENTE B1", label: "[ALE] - MOMENTE B1" },
        { value: "ASPEKTE B2", label: "[ALE] - ASPEKTE B2" },
        { value: "DAF+", label: "[ALE] - DAF+" },
        // { value: "TESTE", label: "[TT] - TESTE" }
    ];

    useEffect(() => {
        fetchCursos();
    }, []);

    useEffect(() => {
        if (isEdit && audioDataToEdit) {
            setAudioData(audioDataToEdit);
        }
    }, [isEdit, audioDataToEdit]);

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
        setAudioData((prevAudioData) => ({ ...prevAudioData, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { files, name } = e.target;

        if (name === "cp_audio") {
            setAudioData((prevAudioData) => ({ ...prevAudioData, cp_audio: files[0] }));
        } else if (name === "cp_pdfs") {
            const updatedFiles = Array.from(files).slice(0, 3).map((file) => ({ file, type: "pdf" }));
            setAudioData((prevAudioData) => ({
                ...prevAudioData,
                cp_pdfs: [...prevAudioData.cp_pdfs, ...updatedFiles].slice(0, 3),
            }));
        }
    };


    const removeFile = (index, type) => {
        if (type === "audio") {
            setAudioData((prevAudioData) => ({ ...prevAudioData, cp_audio: null }));
        } else if (type === "pdf") {
            setAudioData((prevAudioData) => ({
                ...prevAudioData,
                cp_pdfs: prevAudioData.cp_pdfs.filter((_, i) => i !== index),
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        let cursoId = audioData.cp_curso_id;

        try {
            const formData = new FormData();
            formData.append("cp_curso_id", audioData.cp_curso_id);
            formData.append("cp_link_youtube", audioData.cp_link_youtube);

            if (audioData.cp_audio) {
                formData.append("cp_audio", audioData.cp_audio);
            }

            audioData.cp_pdfs.forEach((pdf, index) => {
                formData.append(`pdf${index + 1}`, pdf.file);
            });

            if (isEdit) {
                // Atualização de áudio
                await axios.put(`${API_BASE_URL}/update-audio/${cursoId}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toast.success("Áudio atualizado com sucesso!");
            } else {
                // Cadastro de novo áudio
                await axios.post(`${API_BASE_URL}/register-audio`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toast.success("Áudio cadastrado com sucesso!");
            }

            closeModal();
        } catch (error) {
            console.error("Erro ao cadastrar ou editar o áudio:", error);
            toast.error("Erro ao cadastrar ou editar o áudio");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <form className="form-container-cad" onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <div className="card mb-3">
                            <div className="card-header">
                                <h6 className="card-title mb-0">Informações do Áudio</h6>
                            </div>
                            <div className="card-body">
                                <Form.Group>
                                    <Form.Label>Curso</Form.Label>
                                    <Form.Control
                                        as="select"
                                        id="cp_curso_id"
                                        name="cp_curso_id"
                                        value={audioData.cp_curso_id}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Selecione o curso</option>
                                        {opcoesCursos.map((curso, index) => (
                                            <option key={index} value={curso.value}>
                                                {curso.label}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group className="mt-3">
                                    <Form.Label>Link do YouTube</Form.Label>
                                    <Form.Control
                                        type="url"
                                        id="cp_link_youtube"
                                        name="cp_link_youtube"
                                        value={audioData.cp_link_youtube}
                                        onChange={handleChange}
                                        placeholder="Cole o link do YouTube"
                                    />
                                </Form.Group>
                            </div>
                        </div>
                    </Col>

                    <Col md={6}>
                        <div className="card mb-3">
                            <div className="card-header">
                                <h6 className="card-title mb-0">Uploads</h6>
                            </div>
                            <div className="card-body">
                                <Row className="gy-3">
                                    <Col md={12}>
                                        <div className="upload-wrapper d-flex align-items-center gap-3 flex-wrap">
                                            {/* Upload de Áudio */}
                                            {audioData.cp_audio && (
                                                <div className="uploaded-file-preview position-relative h-120-px w-120-px border input-form-light radius-8 overflow-hidden border-dashed bg-light">
                                                    <button
                                                        type="button"
                                                        className="remove-file position-absolute top-0 end-0 z-1 text-2xxl line-height-1 me-8 mt-8 d-flex"
                                                        onClick={() => removeFile(0, "audio")}
                                                    >
                                                        ×
                                                    </button>
                                                    <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                                                        <span style={{ fontSize: '40px' }} className="text-primary text-4xl">🎵</span>
                                                    </div>
                                                </div>
                                            )}
                                            {!audioData.cp_audio && (
                                                <label
                                                    className="upload-file-multiple h-120-px w-120-px border input-form-light radius-8 overflow-hidden border-dashed bg-light d-flex align-items-center flex-column justify-content-center gap-1"
                                                    htmlFor="upload-audio"
                                                >
                                                    <span className="text-secondary-light text-3xl">+</span>
                                                    <span className="fw-semibold text-secondary-light">Áudio</span>
                                                    <input
                                                        id="upload-audio"
                                                        type="file"
                                                        hidden
                                                        name="cp_audio"
                                                        accept="audio/*"
                                                        onChange={handleFileChange}
                                                    />
                                                </label>
                                            )}

                                            {/* Upload de PDFs */}
                                            {audioData.cp_pdfs.map((pdf, index) => (
                                                <div
                                                    key={index}
                                                    className="uploaded-file-preview position-relative h-120-px w-120-px border input-form-light radius-8 overflow-hidden border-dashed bg-light"
                                                >
                                                    <button
                                                        type="button"
                                                        className="remove-file position-absolute top-0 end-0 z-1 text-2xxl line-height-1 me-8 mt-8 d-flex"
                                                        onClick={() => removeFile(index, "pdf")}
                                                    >
                                                        ×
                                                    </button>
                                                    <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                                                        <span style={{ fontSize: '40px' }} className="text-dark text-5xl">📄</span>
                                                    </div>
                                                </div>
                                            ))}
                                            {audioData.cp_pdfs.length < 3 && (
                                                <label
                                                    className="upload-file-multiple h-120-px w-120-px border input-form-light radius-8 overflow-hidden border-dashed bg-light d-flex align-items-center flex-column justify-content-center gap-1"
                                                    htmlFor="upload-pdfs"
                                                >
                                                    <span className="text-secondary-light text-3xl">+</span>
                                                    <span className="fw-semibold text-secondary-light">PDFs</span>
                                                    <input
                                                        id="upload-pdfs"
                                                        type="file"
                                                        hidden
                                                        name="cp_pdfs"
                                                        accept="application/pdf"
                                                        multiple
                                                        onChange={handleFileChange}
                                                    />
                                                </label>
                                            )}
                                        </div>
                                    </Col>


                                </Row>
                            </div>
                        </div>
                    </Col>
                </Row>

                <div className="mt-4 text-center">
                    <Button type="submit" variant="primary">
                        {isEdit ? "Salvar Alterações" : "Cadastrar Áudio"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CadastroAudio;
