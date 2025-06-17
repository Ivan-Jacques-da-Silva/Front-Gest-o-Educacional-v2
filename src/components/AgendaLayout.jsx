import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import { Icon } from '@iconify/react/dist/iconify.js';
import './calendar.css'

const API_BASE_URL = 'https://testes.cursoviolaocristao.com.br';

const eventosManual = [
    { name: "Ano Novo", date: "2024-01-01T00:00:00Z" },
    { name: "Férias escolares", date: "2024-01-01T00:00:00Z" },
    { name: "Treinamento profes kids", date: "2024-01-29T00:00:00Z" },
    { name: "Matrículas", date: "2024-02-01T00:00:00Z" },
    { name: "Treinamento profes", date: "2024-02-01T00:00:00Z" },
    { name: "Carnaval", date: "2024-02-12T00:00:00Z" },
    { name: "Quaresma", date: "2024-02-14T00:00:00Z" },
    { name: "Valentine's Day", date: "2024-02-14T00:00:00Z" },
    { name: "Aniversário CIPEX", date: "2024-02-15T00:00:00Z" },
    { name: "Reunião pedagógica", date: "2024-02-17T00:00:00Z" },
    { name: "Início do ano letivo", date: "2024-02-19T00:00:00Z" },
    { name: "Jornada pedagógica", date: "2024-02-24T00:00:00Z" },
    { name: "Dia dos povos indígenas", date: "2024-04-19T00:00:00Z" },
    { name: "Reunião pedagógica", date: "2024-04-20T00:00:00Z" },
    { name: "Tiradentes", date: "2024-04-24T00:00:00Z" },
    { name: "Descobrimento do Brasil", date: "2024-04-22T00:00:00Z" },
    { name: "Dia mundial do livro", date: "2024-04-23T00:00:00Z" },
    { name: "Palestra intercâmbio", date: "2024-04-25T00:00:00Z" },
    { name: "Dia do trabalho", date: "2024-05-01T00:00:00Z" },
    { name: "Dia das mães", date: "2024-05-12T00:00:00Z" },
    { name: "Reunião pedagógica", date: "2024-05-18T00:00:00Z" },
    { name: "Corpus Christi", date: "2024-05-30T00:00:00Z" },
    { name: "Dia mundial do meio ambiente", date: "2024-06-05T00:00:00Z" },
    { name: "Dia dos namorados", date: "2024-06-12T00:00:00Z" },
    { name: "Início do inverno", date: "2024-06-20T00:00:00Z" },
    { name: "São João", date: "2024-06-24T00:00:00Z" },
    { name: "Matrículas e rematrículas", date: "2024-07-01T00:00:00Z" },
    { name: "Independence Day USA", date: "2024-07-04T00:00:00Z" },
    { name: "Dia do amigo", date: "2024-07-20T00:00:00Z" },
    { name: "Encerramento 1° semestre letivo", date: "2024-07-20T00:00:00Z" },
    { name: "Férias escolares", date: "2024-07-22T00:00:00Z" },
    { name: "Treinamentos profes", date: "2024-07-22T00:00:00Z" },
    { name: "Jornada pedagógica", date: "2024-07-27T00:00:00Z" },
    { name: "Treinamentos profes", date: "2024-07-29T00:00:00Z" },
    { name: "Início das aulas 2 semestre letivo", date: "2024-08-05T00:00:00Z" },
    { name: "Dia dos pais", date: "2024-08-11T00:00:00Z" },
    { name: "Dia do estudante", date: "2024-08-11T00:00:00Z" },
    { name: "Reunião pedagógica", date: "2024-08-17T00:00:00Z" },
    { name: "Dia do folclore", date: "2024-08-22T00:00:00Z" },
    { name: "Independência do Brasil", date: "2024-09-07T00:00:00Z" },
    { name: "Reunião pedagógica", date: "2024-09-14T00:00:00Z" },
    { name: "Revolução Farroupilha", date: "2024-09-20T00:00:00Z" },
    { name: "Dia da árvore", date: "2024-09-21T00:00:00Z" },
    { name: "Início da primavera", date: "2024-09-22T00:00:00Z" },
    { name: "Dia das crianças", date: "2024-10-12T00:00:00Z" },
    { name: "Dia do professor", date: "2024-10-15T00:00:00Z" },
    { name: "Oktoberfest", date: "2024-10-26T00:00:00Z" },
    { name: "Halloween / Dia do Saci", date: "2024-10-31T00:00:00Z" },
    { name: "Finados", date: "2024-11-02T00:00:00Z" },
    { name: "Proclamação da república", date: "2024-11-15T00:00:00Z" },
    { name: "Dia nacional da consciência negra", date: "2024-11-20T00:00:00Z" },
    { name: "Encerramento das aulas 2° semestre", date: "2024-12-20T00:00:00Z" },
    { name: "Entrega de certificados e boletins", date: "2024-12-20T00:00:00Z" },
    { name: "Encerramento do ano letivo", date: "2024-12-21T00:00:00Z" },
    { name: "Natal", date: "2024-12-25T00:00:00Z" },
    { name: "Véspera de Ano Novo", date: "2024-12-31T00:00:00Z" }
];

function AgendaLayout() {
    const [events, setEvents] = useState([]);
    const [aniversariantes, setAniversariantes] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '' });
    const [loading, setLoading] = useState(true);
    const [eventoSelecionado, setEventoSelecionado] = useState(null);

    const inicializado = useRef(false);

    useEffect(() => {
        if (inicializado.current) return;
        inicializado.current = true;
        carregarTodosEventos();
    }, []);

    const carregarTodosEventos = async () => {
        try {
            // 1. Carregar eventos manuais (institucionais)
            const anoAtual = new Date().getFullYear();
            const institucionais = eventosManual.map(evt => {
                const [, mes, dia] = evt.date.split('T')[0].split('-');
                return {
                    title: evt.name,
                    start: `${anoAtual}-${mes}-${dia}`,
                    allDay: true,
                    color: '#6c5ce7',
                    textColor: '#ffffff',
                    classNames: ['evento-manual'],
                    extendedProps: {
                        tipo: 'institucional'
                    }
                };
            });


            // 2. Carregar aniversariantes
            const resp = await axios.get(`${API_BASE_URL}/aniversarios-agenda`);
            const schoolId = parseInt(localStorage.getItem('schoolId'));
            const anivers = resp.data
                .filter(p => p.cp_escola_id === schoolId)
                .map(p => {
                    const [mes, dia] = p.aniversario.split('-');
                    const ano = new Date().getFullYear();
                    const dateStr = `${ano}-${mes}-${dia}`;
                    console.log(`Evento: Aniversário: ${p.cp_nome} | Data: ${dateStr}`);
                    return {
                        title: `🎂 ${p.cp_nome}`,
                        start: dateStr,
                        color: '#e17055',
                        textColor: '#ffffff',
                        classNames: ['evento-aniversario'],
                        extendedProps: {
                            tipo: 'aniversario',
                            pessoa: p,
                            debug: `Original: ${p.aniversario} | Processado: ${dateStr}`
                        }
                    };
                });

            // 3. Juntar todos os eventos
            const allEvents = [...institucionais, ...anivers];
            setEvents(allEvents);
            console.log('Todos eventos:', allEvents);
            setAniversariantes(anivers.filter(e => e.extendedProps.tipo === 'aniversario'));
        } catch (error) {
            console.error('Erro ao carregar eventos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDateClick = (info) => {
        setNewEvent({ ...newEvent, date: info.dateStr });
        setModalOpen(true);
    };

    const handleEventClick = (info) => {
        setEventoSelecionado({
            title: info.event.title,
            date: info.event.startStr,
            description: info.event.extendedProps.description || '',
            tipo: info.event.extendedProps.tipo
        });
    };

    const handleAddEvent = () => {
        if (newEvent.title && newEvent.date) {
            const novoEvento = {
                title: newEvent.title,
                start: newEvent.date,
                description: newEvent.description,
                color: '#00b894',
                textColor: '#ffffff',
                extendedProps: {
                    tipo: 'personalizado'
                }
            };

            setEvents([...events, novoEvento]);
            setNewEvent({ title: '', description: '', date: '' });
            setModalOpen(false);
        } else {
            alert('Por favor, preencha todos os campos obrigatórios.');
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="agenda-container">
            {/* Cabeçalho Compacto */}
            <div className="agenda-header mb-3">
                <div className="container-fluid">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <div className="header-content">
                                <h3 className="header-title mb-1">
                                    <Icon icon="solar:calendar-mark-bold-duotone" className="me-2" />
                                    Calendário Acadêmico
                                </h3>
                            </div>
                        </div>
                        <div className="col-md-6 text-md-end">
                            <div className="header-actions d-flex align-items-center justify-content-end gap-2">
                                <button
                                    className="btn btn-primary btn-sm rounded-3 px-3"
                                    onClick={() => setModalOpen(true)}
                                >
                                    <Icon icon="ic:round-add" className="me-1" />
                                    Novo Evento
                                </button>
                                <div className="agenda-stats">
                                    <span className="stat-item-small">
                                        <Icon icon="solar:gift-bold" className="text-warning me-1" />
                                        {aniversariantes.length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Calendário Principal */}
            <div className="row">
                <div className="col-12">
                    <div className="card border-0 shadow-lg">
                        <div className="card-body p-4">
                            <div className="calendar-wrapper">
                                <FullCalendar
                                    plugins={[dayGridPlugin, interactionPlugin]}
                                    initialView="dayGridMonth"
                                    events={events}
                                    dateClick={handleDateClick}
                                    eventClick={handleEventClick}
                                    locale="pt-br"
                                    height="auto"
                                    headerToolbar={{
                                        left: 'prev,next today',
                                        center: 'title',
                                        right: window.innerWidth <= 768 ? '' : 'dayGridMonth,dayGridWeek',
                                    }}
                                    buttonText={{
                                        today: 'Hoje',
                                        month: 'Mês',
                                        week: 'Semana',
                                        day: 'Dia',
                                    }}
                                    editable={true}
                                    eventTimeFormat={{
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false
                                    }}
                                    selectable={true}
                                    selectMirror={true}
                                    dayMaxEvents={3}
                                    moreLinkText="mais"
                                    // eventDisplay="block"
                                    displayEventTime={false}
                                />
                                <Modal
                                    show={!!eventoSelecionado}
                                    onHide={() => setEventoSelecionado(null)}
                                    centered
                                    dialogClassName="modal-evento-custom"
                                >
                                    <Modal.Header
                                        closeButton
                                        className={`header-evento ${eventoSelecionado?.tipo === 'aniversario'
                                                ? 'header-evento-aniversario'
                                                : ''
                                            }`}
                                    >
                                        <Modal.Title className="titulo-evento">
                                            <Icon icon="solar:calendar-bold" /> {eventoSelecionado?.title}
                                        </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body className="body-evento">
                                        <p><strong>📅 Data:</strong> {eventoSelecionado?.date}</p>
                                        {eventoSelecionado?.description && (
                                            <p><strong>📝 Descrição:</strong> {eventoSelecionado.description}</p>
                                        )}
                                    </Modal.Body>
                                    <Modal.Footer className="footer-evento">
                                        <Button variant="outline-light" onClick={() => setEventoSelecionado(null)}>
                                            Cancelar
                                        </Button>
                                        <Button variant="light" onClick={() => setEventoSelecionado(null)}>
                                            OK
                                        </Button>
                                    </Modal.Footer>
                                </Modal>


                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Legenda */}
            <div className="row mt-4">
                <div className="col-12">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-3">
                            <div className="d-flex flex-wrap justify-content-center gap-4">
                                <div className="legend-item d-flex align-items-center">
                                    <div className="legend-color bg-success rounded me-2" style={{ width: '12px', height: '12px' }}></div>
                                    <small className="text-muted">Eventos Personalizados</small>
                                </div>
                                <div className="legend-item d-flex align-items-center">
                                    <div className="legend-color rounded me-2" style={{ width: '12px', height: '12px', backgroundColor: '#6c5ce7' }}></div>
                                    <small className="text-muted">Eventos Institucionais</small>
                                </div>
                                <div className="legend-item d-flex align-items-center">
                                    <div className="legend-color rounded me-2" style={{ width: '12px', height: '12px', backgroundColor: '#e17055' }}></div>
                                    <small className="text-muted">Aniversários</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Cadastro de Evento */}
            {modalOpen && (
                <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow">
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title d-flex align-items-center">
                                    <Icon icon="solar:calendar-add-bold" className="me-2 text-primary" />
                                    Novo Evento
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setModalOpen(false)}
                                ></button>
                            </div>
                            <div className="modal-body pt-0">
                                <div className="row g-3">
                                    <div className="col-12">
                                        <label className="form-label fw-semibold">
                                            <Icon icon="solar:text-bold" className="me-1" />
                                            Título do Evento *
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control rounded-3"
                                            placeholder="Digite o título do evento"
                                            value={newEvent.title}
                                            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label fw-semibold">
                                            <Icon icon="solar:calendar-bold" className="me-1" />
                                            Data *
                                        </label>
                                        <input
                                            type="date"
                                            className="form-control rounded-3"
                                            value={newEvent.date}
                                            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label fw-semibold">
                                            <Icon icon="solar:document-text-bold" className="me-1" />
                                            Descrição
                                        </label>
                                        <textarea
                                            className="form-control rounded-3"
                                            rows="3"
                                            placeholder="Descrição do evento (opcional)"
                                            value={newEvent.description}
                                            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer border-0 pt-0">
                                <button
                                    type="button"
                                    className="btn btn-light rounded-3"
                                    onClick={() => setModalOpen(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary rounded-3 d-flex align-items-center gap-2"
                                    onClick={handleAddEvent}
                                >
                                    <Icon icon="solar:diskette-bold" />
                                    Salvar Evento
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AgendaLayout;
