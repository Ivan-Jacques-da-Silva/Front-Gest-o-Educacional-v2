
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { API_BASE_URL } from "./config";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSpring, animated } from "react-spring";
import "./audio.css"
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Audios = () => {
    const [cursos, setCursos] = useState([]);
    const [audios, setAudios] = useState([]);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [itemsPerPageCursos, setItemsPerPageCursos] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortDirection, setSortDirection] = useState("asc");
    const [selectedCursoId, setSelectedCursoId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [paginaAtualCursos, setPaginaAtualCursos] = useState(1);
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [cursoParaExcluir, setCursoParaExcluir] = useState(null);

    const tipoUser = localStorage.getItem("userType");
    const editarCurso = (idCurso) => {
        navigate(`/cadastro-audio/${idCurso}`);
    };

    // Animação para o cabeçalho
    const headerAnimation = useSpring({
        from: { opacity: 0, transform: 'translateY(-20px)' },
        to: { opacity: 1, transform: 'translateY(0px)' },
        config: { tension: 200, friction: 25 }
    });

    // Animação para loading
    const loadingAnimation = useSpring({
        opacity: loading ? 1 : 0,
        transform: loading ? 'scale(1)' : 'scale(0.8)',
        config: { tension: 300, friction: 30 }
    });

    useEffect(() => {
        fetchCursos();
    }, []);

    const deletarCurso = async () => {
        try {
            await axios.delete(`${API_BASE_URL}/delete-curso/${cursoParaExcluir}`);
            toast.success("Curso excluído com sucesso");
            setShowDeleteModal(false);
            setSelectedCursoId(null);
            setAudios([]);
            fetchCursos();
        } catch (error) {
            console.error("Erro ao excluir curso:", error);
            toast.error("Erro ao excluir curso");
        }
    };

    const fetchCursos = async () => {
        const professorId = localStorage.getItem('userId');
        const tipoUsuario = localStorage.getItem('userType');

        if (tipoUsuario === "1") {
            try {
                const response = await fetch(`${API_BASE_URL}/cursos`);
                const todosCursos = await response.json();

                const cursosComAudio = await Promise.all(
                    todosCursos.map(async (curso) => {
                        const response = await fetch(`${API_BASE_URL}/audios-curso/${curso.cp_curso_id}`);
                        const audios = await response.json();
                        return audios.length > 0 ? curso : null;
                    })
                );

                const cursosFiltrados = cursosComAudio.filter(curso => curso !== null);
                cursosFiltrados.sort((a, b) => a.cp_nome_curso.localeCompare(b.cp_nome_curso, undefined, { numeric: true, sensitivity: 'base' }));
                setCursos(cursosFiltrados);

            } catch (error) {
                console.error("Erro ao buscar todos os cursos:", error);
            }
            return;
        }

        try {
            const responseTurmas = await fetch(`${API_BASE_URL}/cp_turmas/professor/${professorId}`);
            const turmas = await responseTurmas.json();
            const cursoIds = turmas.map(turma => turma.cp_tr_curso_id);

            if (cursoIds.length > 0) {
                const responseCursos = await fetch(`${API_BASE_URL}/cursos/batch`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cursoIds })
                });
                const cursos = await responseCursos.json();

                const cursosComAudio = await Promise.all(
                    cursos.map(async (curso) => {
                        const response = await fetch(`${API_BASE_URL}/audios-curso/${curso.cp_curso_id}`);
                        const audios = await response.json();
                        return audios.length > 0 ? curso : null;
                    })
                );

                const cursosFiltrados = cursosComAudio.filter(curso => curso !== null);
                cursosFiltrados.sort((a, b) => a.cp_nome_curso.localeCompare(b.cp_nome_curso, undefined, { numeric: true, sensitivity: 'base' }));
                setCursos(cursosFiltrados);

            } else {
                setCursos([]);
            }
        } catch (error) {
            console.error("Erro ao buscar cursos:", error);
        }
    };

    const fetchAudios = async (cursoId) => {
        setLoading(true);
        setPaginaAtual(1);
        try {
            const response = await fetch(`${API_BASE_URL}/audios-curso/${cursoId}`);
            const data = await response.json();
            data.sort((a, b) => a.cp_nome_audio.localeCompare(b.cp_nome_audio, undefined, { numeric: true, sensitivity: 'base' }));
            setAudios(data);
            setSelectedCursoId(cursoId);
        } catch (error) {
            console.error("Erro ao buscar áudios:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSortChange = () => {
        const newDirection = sortDirection === "asc" ? "desc" : "asc";
        setSortDirection(newDirection);
        const sortedCursos = [...cursos].sort((a, b) => {
            const nomeA = a.cp_nome_curso.toLowerCase();
            const nomeB = b.cp_nome_curso.toLowerCase();
            return newDirection === "asc"
                ? nomeA.localeCompare(nomeB)
                : nomeB.localeCompare(nomeA);
        });
        setCursos(sortedCursos);
    };

    const filteredAudios = audios.slice(
        (paginaAtual - 1) * 10,
        paginaAtual * 10
    );

    const totalPaginasAudiosCurso = Math.ceil(audios.length / 10);

    const filteredCursos = cursos.filter((curso) =>
        curso.cp_nome_curso.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const currentCursos =
        itemsPerPageCursos === "all"
            ? filteredCursos
            : filteredCursos.slice(
                (paginaAtualCursos - 1) * itemsPerPageCursos,
                paginaAtualCursos * itemsPerPageCursos
            );

    const totalPaginasCursos =
        itemsPerPageCursos === "all"
            ? 1
            : Math.ceil(filteredCursos.length / itemsPerPageCursos);

    const totalPaginas = itemsPerPage === "all" ? 1 : Math.ceil(filteredCursos.length / itemsPerPage);

    return (
        <motion.div 
            className="card h-100 p-0 radius-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <animated.div 
                style={headerAnimation}
                className="card-header border-bottom py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between"
                style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white'
                }}
            >
                <div className="d-flex align-items-center flex-wrap gap-3">
                    <motion.span 
                        className="text-md fw-medium mb-0"
                        whileHover={{ scale: 1.05 }}
                    >
                        Mostrar
                    </motion.span>
                    <motion.select
                        className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px"
                        value={itemsPerPageCursos}
                        onChange={(e) => {
                            const value = e.target.value === "all" ? "all" : Number(e.target.value);
                            setItemsPerPageCursos(value);
                            setPaginaAtualCursos(1);
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                        <option value="all">Ver Todos</option>
                    </motion.select>

                    <motion.form 
                        className="navbar-search"
                        whileHover={{ scale: 1.02 }}
                    >
                        <input
                            type="text"
                            className="bg-base h-40-px w-auto"
                            placeholder="Pesquisar"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Icon icon="ion:search-outline" className="icon" />
                    </motion.form>
                    
                    <motion.button
                        className="btn btn-outline-light text-md py-6 radius-12 h-40-px d-flex align-items-center gap-2"
                        onClick={handleSortChange}
                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <motion.div
                            animate={{ rotate: sortDirection === "asc" ? 0 : 180 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Icon icon="solar:sort-vertical-bold" />
                        </motion.div>
                        Ordenar por {sortDirection === "asc" ? "A-Z" : "Z-A"}
                    </motion.button>
                </div>
            </animated.div>
            
            <div className="row">
                <div className="col-12 col-md-4 border-md-end mb-3 mb-md-0">
                    <div className="card-body p-24">
                        <motion.ul 
                            className="align-items-center justify-content-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <AnimatePresence>
                                {currentCursos.map((curso, index) => (
                                    <motion.div
                                        key={curso.cp_curso_id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ delay: index * 0.1 }}
                                        style={{
                                            borderBottom: index === currentCursos.length - 1 ? "none" : "1px solid #ddd",
                                            padding: "3px",
                                        }}
                                        whileHover={{ 
                                            backgroundColor: 'rgba(102, 126, 234, 0.05)',
                                            transition: { duration: 0.2 }
                                        }}
                                    >
                                        <li
                                            className={`p-2 d-flex justify-content-between align-items-center ${selectedCursoId === curso.cp_curso_id ? "active" : ""
                                                }`}
                                        >
                                            <span>
                                                {tipoUser === "1" && (
                                                    <div className="d-inline-flex align-items-center gap-1">
                                                        <motion.div
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                        >
                                                            <Link
                                                                style={{ marginRight: "4px" }}
                                                                to={`/cadastro-audio/${curso.cp_curso_id}`}
                                                                className="w-32-px h-32-px bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center"
                                                            >
                                                                <Icon icon="lucide:edit" />
                                                            </Link>
                                                        </motion.div>
                                                    </div>
                                                )}
                                                {curso.cp_nome_curso}
                                            </span>
                                            <motion.button
                                                className="btn btn-sm"
                                                onClick={() => fetchAudios(curso.cp_curso_id)}
                                                style={{
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                    border: 'none',
                                                    color: 'white',
                                                    borderRadius: '20px',
                                                    padding: '8px 16px',
                                                    fontSize: '12px',
                                                    fontWeight: '500',
                                                    backdropFilter: 'blur(10px)',
                                                    WebkitBackdropFilter: 'blur(10px)',
                                                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.2)'
                                                }}
                                                whileHover={{ 
                                                    scale: 1.05, 
                                                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                                                    y: -2
                                                }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Icon icon="solar:music-notes-bold" className="me-1" />
                                                Ver Áudios
                                            </motion.button>
                                        </li>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            
                            <motion.div 
                                className="d-flex flex-column align-items-center justify-content-center mt-24"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <div className="d-flex align-items-center justify-content-between w-100 mb-3">
                                    <span>
                                        Mostrando {paginaAtualCursos} de {totalPaginasCursos} páginas
                                    </span>
                                    <motion.select
                                        className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px"
                                        value={paginaAtualCursos}
                                        onChange={(e) => setPaginaAtualCursos(Number(e.target.value))}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        {Array.from({ length: totalPaginasCursos }, (_, idx) => (
                                            <option key={idx + 1} value={idx + 1}>
                                                Página {idx + 1}
                                            </option>
                                        ))}
                                    </motion.select>
                                </div>

                                <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center">
                                    <motion.li className="page-item" whileHover={{ scale: 1.05 }}>
                                        <button
                                            className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px text-md"
                                            onClick={() => setPaginaAtualCursos(1)}
                                            disabled={paginaAtualCursos === 1}
                                        >
                                            <Icon icon="ep:d-arrow-left" />
                                        </button>
                                    </motion.li>
                                    <motion.li className="page-item" whileHover={{ scale: 1.05 }}>
                                        <button
                                            className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px text-md"
                                            onClick={() => setPaginaAtualCursos(prev => Math.max(prev - 1, 1))}
                                            disabled={paginaAtualCursos === 1}
                                        >
                                            Anterior
                                        </button>
                                    </motion.li>
                                    {Array.from({ length: totalPaginasCursos }, (_, idx) => idx + 1)
                                        .filter(page => page === 1 || page === totalPaginasCursos || (page >= paginaAtualCursos - 2 && page <= paginaAtualCursos + 2))
                                        .map((page, idx, pages) => {
                                            if (idx > 0 && page > pages[idx - 1] + 1) {
                                                return (
                                                    <li key={`ellipsis-${idx}`} className="page-item">
                                                        <span className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px">
                                                            ...
                                                        </span>
                                                    </li>
                                                );
                                            }
                                            return (
                                                <motion.li 
                                                    key={page} 
                                                    className={`page-item ${paginaAtualCursos === page ? "active" : ""}`}
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <button
                                                        className={`page-link text-md fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px ${paginaAtualCursos === page ? "bg-primary-600 text-white" : "bg-neutral-200 text-secondary-light"}`}
                                                        onClick={() => setPaginaAtualCursos(page)}
                                                    >
                                                        {page}
                                                    </button>
                                                </motion.li>
                                            );
                                        })}
                                    <motion.li className="page-item" whileHover={{ scale: 1.05 }}>
                                        <button
                                            className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px text-md"
                                            onClick={() => setPaginaAtualCursos(prev => Math.min(prev + 1, totalPaginasCursos))}
                                            disabled={paginaAtualCursos === totalPaginasCursos}
                                        >
                                            Próximo
                                        </button>
                                    </motion.li>
                                    <motion.li className="page-item" whileHover={{ scale: 1.05 }}>
                                        <button
                                            className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px text-md"
                                            onClick={() => setPaginaAtualCursos(totalPaginasCursos)}
                                            disabled={paginaAtualCursos === totalPaginasCursos}
                                        >
                                            <Icon icon="ep:d-arrow-right" />
                                        </button>
                                    </motion.li>
                                </ul>
                            </motion.div>
                        </motion.ul>
                    </div>
                </div>
                
                <div className="col-12 col-md-8">
                    <div className="card-body p-24">
                        <AnimatePresence mode="wait">
                            {(!selectedCursoId || audios.length === 0) && !loading ? (
                                <motion.div 
                                    className="fw-bold text-primary d-flex align-items-center justify-content-center flex-column"
                                    style={{ minHeight: '200px' }}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                >
                                    <motion.div
                                        animate={{ 
                                            rotate: [0, 10, -10, 0],
                                            scale: [1, 1.1, 1]
                                        }}
                                        transition={{ 
                                            duration: 2,
                                            repeat: Infinity,
                                            repeatType: "reverse"
                                        }}
                                    >
                                        <Icon icon="solar:music-notes-bold-duotone" className="fs-1 mb-3" />
                                    </motion.div>
                                    Clique em "Ver Áudios"
                                </motion.div>
                            ) : (
                                <motion.div 
                                    className="table-responsive scroll-sm"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <table className="table bordered-table sm-table mb-0">
                                        <thead>
                                            <tr>
                                                <th>Nome do Áudio</th>
                                                <th className="text-center">Ação</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <AnimatePresence>
                                                {loading ? (
                                                    <motion.tr
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                    >
                                                        <td colSpan="2" className="text-center">
                                                            <animated.div style={loadingAnimation}>
                                                                <motion.div
                                                                    animate={{ rotate: 360 }}
                                                                    transition={{ 
                                                                        duration: 1,
                                                                        repeat: Infinity,
                                                                        ease: "linear"
                                                                    }}
                                                                    className="d-inline-block"
                                                                >
                                                                    <Icon icon="solar:loading-minimalistic-bold" className="fs-3 text-primary" />
                                                                </motion.div>
                                                                <div className="mt-2">Carregando...</div>
                                                            </animated.div>
                                                        </td>
                                                    </motion.tr>
                                                ) : (
                                                    filteredAudios.map((audio, index) => (
                                                        <motion.tr 
                                                            key={audio.cp_audio_id}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -20 }}
                                                            transition={{ delay: index * 0.1 }}
                                                            whileHover={{ 
                                                                backgroundColor: 'rgba(102, 126, 234, 0.02)',
                                                                transition: { duration: 0.2 }
                                                            }}
                                                        >
                                                            <td style={{ maxWidth: '260px', wordWrap: 'break-word' }}>
                                                                <motion.span
                                                                    whileHover={{ color: '#667eea' }}
                                                                >
                                                                    {audio.cp_nome_audio}
                                                                </motion.span>
                                                            </td>
                                                            <td className="text-center">
                                                                <motion.div 
                                                                    className="modern-audio-container"
                                                                    whileHover={{ scale: 1.02 }}
                                                                    initial={{ opacity: 0, y: 10 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    transition={{ delay: index * 0.1 }}
                                                                >
                                                                    <motion.div 
                                                                        className="audio-preview-card p-3 rounded-4 shadow-sm"
                                                                        style={{
                                                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                                            border: 'none',
                                                                            backdropFilter: 'blur(16px)',
                                                                            WebkitBackdropFilter: 'blur(16px)'
                                                                        }}
                                                                        whileHover={{
                                                                            boxShadow: '0 15px 35px rgba(102, 126, 234, 0.3)',
                                                                            transform: 'translateY(-3px)'
                                                                        }}
                                                                    >
                                                                        <div className="d-flex align-items-center gap-3">
                                                                            <motion.div 
                                                                                className="audio-icon-wrapper"
                                                                                whileHover={{ rotate: 180 }}
                                                                                transition={{ duration: 0.5 }}
                                                                            >
                                                                                <div 
                                                                                    className="d-flex align-items-center justify-content-center rounded-circle"
                                                                                    style={{
                                                                                        width: '45px',
                                                                                        height: '45px',
                                                                                        background: 'rgba(255,255,255,0.2)',
                                                                                        border: '2px solid rgba(255,255,255,0.3)'
                                                                                    }}
                                                                                >
                                                                                    <Icon icon="solar:music-note-3-bold" className="text-white fs-5" />
                                                                                </div>
                                                                            </motion.div>
                                                                            <div className="flex-grow-1">
                                                                                <audio 
                                                                                    controls 
                                                                                    preload="none" 
                                                                                    controlsList="nodownload"
                                                                                    className="w-100 premium-audio-player"
                                                                                    style={{
                                                                                        height: '40px',
                                                                                        borderRadius: '25px',
                                                                                        background: 'rgba(255,255,255,0.1)',
                                                                                        border: '1px solid rgba(255,255,255,0.2)'
                                                                                    }}
                                                                                >
                                                                                    <source src={`${API_BASE_URL}/audio/${audio.cp_nome_audio}`} type="audio/mpeg" />
                                                                                    Seu navegador não suporta o elemento <code>audio</code>.
                                                                                </audio>
                                                                            </div>
                                                                        </div>
                                                                    </motion.div>
                                                                </motion.div>
                                                            </td>
                                                        </motion.tr>
                                                    ))
                                                )}
                                            </AnimatePresence>
                                        </tbody>
                                    </table>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                        <motion.div 
                            className="d-flex flex-column flex-md-row align-items-center justify-content-between mt-24"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <span className="mb-3 mb-md-0">
                                Mostrando {paginaAtual} de {totalPaginasAudiosCurso} páginas
                            </span>
                            <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center mb-3 mb-md-0">
                                <motion.li className="page-item" whileHover={{ scale: 1.05 }}>
                                    <button
                                        className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px text-md"
                                        onClick={() => setPaginaAtual(1)}
                                        disabled={paginaAtual === 1}
                                    >
                                        <Icon icon="ep:d-arrow-left" />
                                    </button>
                                </motion.li>
                                <motion.li className="page-item" whileHover={{ scale: 1.05 }}>
                                    <button
                                        className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px text-md"
                                        onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
                                        disabled={paginaAtual === 1}
                                    >
                                        Anterior
                                    </button>
                                </motion.li>
                                {Array.from({ length: totalPaginasAudiosCurso }, (_, idx) => idx + 1)
                                    .filter((page) => {
                                        return (
                                            page === 1 ||
                                            page === totalPaginasAudiosCurso ||
                                            (page >= paginaAtual - 2 && page <= paginaAtual + 2)
                                        );
                                    })
                                    .map((page, idx, pages) => {
                                        if (idx > 0 && page > pages[idx - 1] + 1) {
                                            return (
                                                <li key={`ellipsis-${idx}`} className="page-item">
                                                    <span className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px">
                                                        ...
                                                    </span>
                                                </li>
                                            );
                                        }
                                        return (
                                            <motion.li
                                                key={page}
                                                className={`page-item ${paginaAtual === page ? "active" : ""}`}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <button
                                                    className={`page-link text-md fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px ${paginaAtual === page
                                                        ? "bg-primary-600 text-white"
                                                        : "bg-neutral-200 text-secondary-light"
                                                        }`}
                                                    onClick={() => setPaginaAtual(page)}
                                                >
                                                    {page}
                                                </button>
                                            </motion.li>
                                        );
                                    })}
                                <motion.li className="page-item" whileHover={{ scale: 1.05 }}>
                                    <button
                                        className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px text-md"
                                        onClick={() => setPaginaAtual((prev) => Math.min(prev + 1, totalPaginasAudiosCurso))}
                                        disabled={paginaAtual === totalPaginasAudiosCurso}
                                    >
                                        Próximo
                                    </button>
                                </motion.li>
                                <motion.li className="page-item" whileHover={{ scale: 1.05 }}>
                                    <button
                                        className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px text-md"
                                        onClick={() => setPaginaAtual(totalPaginasAudiosCurso)}
                                        disabled={paginaAtual === totalPaginasAudiosCurso}
                                    >
                                        <Icon icon="ep:d-arrow-right" />
                                    </button>
                                </motion.li>
                            </ul>
                            <motion.select
                                className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px"
                                value={paginaAtual}
                                onChange={(e) => setPaginaAtual(Number(e.target.value))}
                                whileHover={{ scale: 1.02 }}
                            >
                                {Array.from({ length: totalPaginasAudiosCurso }, (_, idx) => (
                                    <option key={idx + 1} value={idx + 1}>
                                        Página {idx + 1}
                                    </option>
                                ))}
                            </motion.select>
                        </motion.div>
                    </div>
                </div>
            </div>
            
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div 
                        className="modal fade show d-block" 
                        tabIndex="-1" 
                        role="dialog"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                    >
                        <motion.div 
                            className="modal-dialog modal-dialog-centered" 
                            role="document"
                            initial={{ scale: 0.8, y: -50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, y: -50 }}
                        >
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Confirmar Exclusão</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)} />
                                </div>
                                <div className="modal-body">
                                    Tem certeza que deseja excluir este curso? Essa ação não poderá ser desfeita.
                                </div>
                                <div className="modal-footer">
                                    <motion.button 
                                        className="btn btn-secondary" 
                                        onClick={() => setShowDeleteModal(false)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Cancelar
                                    </motion.button>
                                    <motion.button 
                                        className="btn btn-danger" 
                                        onClick={deletarCurso}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Excluir
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <ToastContainer />
        </motion.div>
    );
};

export default Audios;
