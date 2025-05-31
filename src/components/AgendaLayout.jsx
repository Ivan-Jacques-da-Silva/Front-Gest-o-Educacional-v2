import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import './calendar.css'

function AgendaLayout() {
    const [events, setEvents] = useState([]);
    const [allEvents, setAllEvents] = useState([]);

    // Eventos manuais pré-definidos
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

    useEffect(() => {
        // Transformar eventos manuais no formato do FullCalendar
        const eventosFormatados = eventosManual.map((evento, index) => ({
            id: `manual-${index}`,
            title: `🎉 ${evento.name}`, // Adicionar ícone
            start: evento.date.split('T')[0], // Apenas a data, sem hora
            backgroundColor: '#e3f2fd',
            borderColor: '#2196f3',
            textColor: '#1976d2',
            extendedProps: {
                isManual: true,
                description: evento.name,
                icon: '🎉'
            }
        }));

        setAllEvents([...eventosFormatados, ...events]);
    }, [events, eventosManual]);
    const [modalOpen, setModalOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '' });

    const handleDateClick = (info) => {
        setNewEvent({ ...newEvent, date: info.dateStr });
        setModalOpen(true);
    };

    const handleEventClick = (info) => {
        if (window.confirm(`Deseja excluir o evento '${info.event.title}'?`)) {
            info.event.remove();
            setEvents(events.filter(event => event.title !== info.event.title));
        }
    };

    const handleAddEvent = () => {
        if (newEvent.title && newEvent.date) {
            const novoEvento = { 
                id: `user-${Date.now()}`,
                title: `📌 ${newEvent.title}`, // Adicionar ícone para eventos de usuário
                start: newEvent.date, 
                description: newEvent.description,
                backgroundColor: '#4caf50',
                borderColor: '#388e3c',
                textColor: '#ffffff',
                extendedProps: {
                    isManual: false,
                    description: newEvent.description,
                    icon: '📌'
                }
            };
            setEvents([...events, novoEvento]);
            setNewEvent({ title: '', description: '', date: '' });
            setModalOpen(false);
        } else {
            alert('Por favor, preencha todos os campos.');
        }
    };

    const getEventosDodia = (data) => {
        return allEvents.filter(event => {
            const eventDate = new Date(event.start).toDateString();
            const selectedDate = new Date(data).toDateString();
            return eventDate === selectedDate;
        });
    };

    const getEventosDeHoje = () => {
        const hoje = new Date().toDateString();
        return allEvents.filter(event => {
            const eventDate = new Date(event.start).toDateString();
            return eventDate === hoje;
        });
    };

    const getProximosEventos = () => {
        const hoje = new Date();
        const proximosCincoDias = new Date();
        proximosCincoDias.setDate(hoje.getDate() + 5);
        
        return allEvents.filter(event => {
            const eventDate = new Date(event.start);
            return eventDate > hoje && eventDate <= proximosCincoDias;
        }).sort((a, b) => new Date(a.start) - new Date(b.start));
    };

    return (
        <div className="agenda-container container-fluid p-3">
            <div className="row">
                {/* Card da Esquerda */}
                <div className="col-md-4 col-12 mb-3">
                    <div className="card h-100 p-3">
                        {/* Eventos de Hoje */}
                        <div className="mb-4">
                            <span className="card-title text-success">📅 Eventos de Hoje</span>
                            <div className="event-list mt-2" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                {getEventosDeHoje().map((event, index) => (
                                    <div key={index} className="event-item mb-2 p-2 border rounded bg-light-success">
                                        <p className="mb-1"><strong>{event.title}</strong></p>
                                        {event.extendedProps?.description && (
                                            <p className="mb-0 small text-muted">{event.extendedProps.description}</p>
                                        )}
                                        {event.extendedProps?.isManual && (
                                            <span className="badge bg-success small">Evento Oficial</span>
                                        )}
                                    </div>
                                ))}
                                {getEventosDeHoje().length === 0 && (
                                    <p className="text-muted small">Nenhum evento para hoje</p>
                                )}
                            </div>
                        </div>

                        {/* Próximos Eventos */}
                        <div className="mb-4">
                            <span className="card-title text-warning">🔔 Próximos Eventos (5 dias)</span>
                            <div className="event-list mt-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                {getProximosEventos().map((event, index) => (
                                    <div key={index} className="event-item mb-2 p-2 border rounded bg-light-warning">
                                        <p className="mb-1"><strong>{event.title}</strong></p>
                                        <p className="mb-1 text-muted small">
                                            📆 {new Date(event.start).toLocaleDateString('pt-BR')}
                                        </p>
                                        {event.extendedProps?.description && (
                                            <p className="mb-0 small text-muted">{event.extendedProps.description}</p>
                                        )}
                                        {event.extendedProps?.isManual && (
                                            <span className="badge bg-warning small">Evento Oficial</span>
                                        )}
                                    </div>
                                ))}
                                {getProximosEventos().length === 0 && (
                                    <p className="text-muted small">Nenhum evento nos próximos 5 dias</p>
                                )}
                            </div>
                        </div>

                        <button className="btn btn-primary mt-auto" onClick={() => setModalOpen(true)}>➕ Cadastrar Evento</button>
                        <span className="small text-muted text-center mt-2">Em desenvolvimento</span>
                    </div>
                </div>

                {/* Card da Direita */}
                <div className="col-md-8 col-12">
                    <div className="card h-100 p-3">
                        <span className="card-title">Calendário</span>
                        <div className="calendar-wrapper mt-3">
                            <FullCalendar
                                plugins={[dayGridPlugin, interactionPlugin]}
                                initialView="dayGridMonth"
                                events={allEvents}
                                dateClick={handleDateClick}
                                eventClick={handleEventClick}
                                locale="pt-br"
                                height="auto"
                                eventDisplay="block"
                                headerToolbar={{
                                    left: 'prev,next',
                                    center: 'title',
                                    right: window.innerWidth <= 768 ? 'dayGridMonth,dayGridWeek,dayGridDay' : 'dayGridMonth,dayGridWeek,dayGridDay',
                                }}
                                buttonText={{
                                    today: 'Hoje',
                                    month: 'Mês',
                                    week: 'Semana',
                                    day: 'Dia',
                                }}
                                editable={true}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Cadastro de Evento */}
            {modalOpen && (
                <div className="modal fade show d-block" tabIndex={-1}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Cadastrar Evento</h5>
                                <button type="button" className="btn-close" onClick={() => setModalOpen(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Título</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newEvent.title}
                                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Descrição</label>
                                    <textarea
                                        className="form-control"
                                        value={newEvent.description}
                                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                    ></textarea>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Data</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={newEvent.date}
                                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancelar</button>
                                <button type="button" className="btn btn-primary" onClick={handleAddEvent}>Salvar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AgendaLayout;