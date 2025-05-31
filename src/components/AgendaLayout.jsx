import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './calendar.css'

function AgendaLayout() {
    const [events, setEvents] = useState([]);
    const [allEvents, setAllEvents] = useState([]);
    const [currentView, setCurrentView] = useState('dayGridMonth');
    const [isLoading, setIsLoading] = useState(false);

    // Eventos manuais pré-definidos com ícones específicos
    const eventosManual = [
        { name: "Ano Novo", date: "2025-01-01T00:00:00Z", icon: "🎊", category: "holiday" },
        { name: "Férias escolares", date: "2025-01-01T00:00:00Z", icon: "🏖️", category: "school" },
        { name: "Treinamento profes kids", date: "2025-01-29T00:00:00Z", icon: "👶", category: "training" },
        { name: "Matrículas", date: "2025-02-01T00:00:00Z", icon: "📝", category: "academic" },
        { name: "Treinamento profes", date: "2025-02-01T00:00:00Z", icon: "👨‍🏫", category: "training" },
        { name: "Carnaval", date: "2025-02-12T00:00:00Z", icon: "🎭", category: "holiday" },
        { name: "Quaresma", date: "2025-02-14T00:00:00Z", icon: "✝️", category: "religious" },
        { name: "Valentine's Day", date: "2025-02-14T00:00:00Z", icon: "💕", category: "holiday" },
        { name: "Aniversário CIPEX", date: "2025-02-15T00:00:00Z", icon: "🎂", category: "institutional" },
        { name: "Reunião pedagógica", date: "2025-02-17T00:00:00Z", icon: "👥", category: "meeting" },
        { name: "Início do ano letivo", date: "2025-02-19T00:00:00Z", icon: "📚", category: "academic" },
        { name: "Jornada pedagógica", date: "2025-02-24T00:00:00Z", icon: "🎯", category: "training" },
        { name: "Dia dos povos indígenas", date: "2025-04-19T00:00:00Z", icon: "🏹", category: "cultural" },
        { name: "Reunião pedagógica", date: "2025-04-20T00:00:00Z", icon: "👥", category: "meeting" },
        { name: "Tiradentes", date: "2025-04-21T00:00:00Z", icon: "🇧🇷", category: "holiday" },
        { name: "Descobrimento do Brasil", date: "2025-04-22T00:00:00Z", icon: "⛵", category: "holiday" },
        { name: "Dia mundial do livro", date: "2025-04-23T00:00:00Z", icon: "📖", category: "cultural" },
        { name: "Palestra intercâmbio", date: "2025-04-25T00:00:00Z", icon: "🌍", category: "event" },
        { name: "Dia do trabalho", date: "2025-05-01T00:00:00Z", icon: "⚒️", category: "holiday" },
        { name: "Dia das mães", date: "2025-05-11T00:00:00Z", icon: "👩‍👧‍👦", category: "holiday" },
        { name: "Reunião pedagógica", date: "2025-05-18T00:00:00Z", icon: "👥", category: "meeting" },
        { name: "Corpus Christi", date: "2025-06-19T00:00:00Z", icon: "✝️", category: "religious" },
        { name: "Dia mundial do meio ambiente", date: "2025-06-05T00:00:00Z", icon: "🌱", category: "environmental" },
        { name: "Dia dos namorados", date: "2025-06-12T00:00:00Z", icon: "💕", category: "holiday" },
        { name: "Início do inverno", date: "2025-06-20T00:00:00Z", icon: "❄️", category: "seasonal" },
        { name: "São João", date: "2025-06-24T00:00:00Z", icon: "🔥", category: "cultural" },
        { name: "Matrículas e rematrículas", date: "2025-07-01T00:00:00Z", icon: "📋", category: "academic" },
        { name: "Independence Day USA", date: "2025-07-04T00:00:00Z", icon: "🇺🇸", category: "international" },
        { name: "Dia do amigo", date: "2025-07-20T00:00:00Z", icon: "🤝", category: "social" },
        { name: "Encerramento 1° semestre letivo", date: "2025-07-20T00:00:00Z", icon: "🎓", category: "academic" },
        { name: "Férias escolares", date: "2025-07-22T00:00:00Z", icon: "🏖️", category: "school" },
        { name: "Treinamentos profes", date: "2025-07-22T00:00:00Z", icon: "👨‍🏫", category: "training" },
        { name: "Jornada pedagógica", date: "2025-07-27T00:00:00Z", icon: "🎯", category: "training" },
        { name: "Treinamentos profes", date: "2025-07-29T00:00:00Z", icon: "👨‍🏫", category: "training" },
        { name: "Início das aulas 2 semestre letivo", date: "2025-08-05T00:00:00Z", icon: "📚", category: "academic" },
        { name: "Dia dos pais", date: "2025-08-10T00:00:00Z", icon: "👨‍👧‍👦", category: "holiday" },
        { name: "Dia do estudante", date: "2025-08-11T00:00:00Z", icon: "🎒", category: "academic" },
        { name: "Reunião pedagógica", date: "2025-08-17T00:00:00Z", icon: "👥", category: "meeting" },
        { name: "Dia do folclore", date: "2025-08-22T00:00:00Z", icon: "🎭", category: "cultural" },
        { name: "Independência do Brasil", date: "2025-09-07T00:00:00Z", icon: "🇧🇷", category: "holiday" },
        { name: "Reunião pedagógica", date: "2025-09-14T00:00:00Z", icon: "👥", category: "meeting" },
        { name: "Revolução Farroupilha", date: "2025-09-20T00:00:00Z", icon: "⚔️", category: "historical" },
        { name: "Dia da árvore", date: "2025-09-21T00:00:00Z", icon: "🌳", category: "environmental" },
        { name: "Início da primavera", date: "2025-09-22T00:00:00Z", icon: "🌸", category: "seasonal" },
        { name: "Dia das crianças", date: "2025-10-12T00:00:00Z", icon: "🧸", category: "holiday" },
        { name: "Dia do professor", date: "2025-10-15T00:00:00Z", icon: "👩‍🏫", category: "professional" },
        { name: "Oktoberfest", date: "2025-10-26T00:00:00Z", icon: "🍺", category: "cultural" },
        { name: "Halloween / Dia do Saci", date: "2025-10-31T00:00:00Z", icon: "🎃", category: "cultural" },
        { name: "Finados", date: "2025-11-02T00:00:00Z", icon: "🕯️", category: "religious" },
        { name: "Proclamação da república", date: "2025-11-15T00:00:00Z", icon: "🏛️", category: "holiday" },
        { name: "Dia nacional da consciência negra", date: "2025-11-20T00:00:00Z", icon: "✊🏾", category: "awareness" },
        { name: "Encerramento das aulas 2° semestre", date: "2025-12-20T00:00:00Z", icon: "🎓", category: "academic" },
        { name: "Entrega de certificados e boletins", date: "2025-12-20T00:00:00Z", icon: "📜", category: "academic" },
        { name: "Encerramento do ano letivo", date: "2025-12-21T00:00:00Z", icon: "🏆", category: "academic" },
        { name: "Natal", date: "2025-12-25T00:00:00Z", icon: "🎄", category: "holiday" },
        { name: "Véspera de Ano Novo", date: "2025-12-31T00:00:00Z", icon: "🎆", category: "holiday" }
    ];

    // Função para obter cores por categoria
    const getCategoryColor = (category) => {
        const colors = {
            holiday: { bg: '#fef3e2', border: '#f59e0b', text: '#92400e' },
            academic: { bg: '#e0f2fe', border: '#0284c7', text: '#075985' },
            training: { bg: '#f0fdf4', border: '#16a34a', text: '#15803d' },
            meeting: { bg: '#f3e8ff', border: '#9333ea', text: '#7c3aed' },
            cultural: { bg: '#fdf2f8', border: '#ec4899', text: '#be185d' },
            religious: { bg: '#f8fafc', border: '#64748b', text: '#475569' },
            institutional: { bg: '#fffbeb', border: '#f59e0b', text: '#d97706' },
            environmental: { bg: '#ecfdf5', border: '#10b981', text: '#059669' },
            seasonal: { bg: '#f0f9ff', border: '#0ea5e9', text: '#0284c7' },
            international: { bg: '#fef2f2', border: '#ef4444', text: '#dc2626' },
            social: { bg: '#f9fafb', border: '#6b7280', text: '#4b5563' },
            professional: { bg: '#eef2ff', border: '#6366f1', text: '#4f46e5' },
            historical: { bg: '#fefce8', border: '#eab308', text: '#ca8a04' },
            awareness: { bg: '#f7fee7', border: '#84cc16', text: '#65a30d' },
            default: { bg: '#f1f5f9', border: '#64748b', text: '#475569' }
        };
        return colors[category] || colors.default;
    };

    useEffect(() => {
        setIsLoading(true);
        // Transformar eventos manuais no formato do FullCalendar
        const eventosFormatados = eventosManual.map((evento, index) => {
            const colors = getCategoryColor(evento.category);
            return {
                id: `manual-${index}`,
                title: `${evento.icon} ${evento.name}`,
                start: evento.date.split('T')[0],
                backgroundColor: colors.bg,
                borderColor: colors.border,
                textColor: colors.text,
                classNames: ['event-official'],
                extendedProps: {
                    isManual: true,
                    description: evento.name,
                    icon: evento.icon,
                    category: evento.category
                }
            };
        });

        setAllEvents([...eventosFormatados, ...events]);
        setIsLoading(false);
    }, [events]);
    const [modalOpen, setModalOpen] = useState(false);
    const [eventModalOpen, setEventModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [newEvent, setNewEvent] = useState({ 
        title: '', 
        description: '', 
        date: '', 
        time: '',
        category: 'event',
        icon: '📌'
    });

    const categoryOptions = [
        { value: 'event', label: 'Evento Geral', icon: '📌' },
        { value: 'meeting', label: 'Reunião', icon: '👥' },
        { value: 'training', label: 'Treinamento', icon: '👨‍🏫' },
        { value: 'academic', label: 'Acadêmico', icon: '📚' },
        { value: 'holiday', label: 'Feriado', icon: '🎉' },
        { value: 'cultural', label: 'Cultural', icon: '🎭' }
    ];

    const handleDateClick = (info) => {
        setNewEvent({ ...newEvent, date: info.dateStr, time: '' });
        setModalOpen(true);
    };

    const handleEventClick = (info) => {
        if (info.event.extendedProps.isManual) {
            // Para eventos oficiais, apenas mostrar detalhes
            setSelectedEvent({
                title: info.event.title,
                description: info.event.extendedProps.description,
                date: info.event.startStr,
                category: info.event.extendedProps.category,
                isManual: true
            });
            setEventModalOpen(true);
        } else {
            // Para eventos criados pelo usuário, permitir exclusão
            if (window.confirm(`Deseja excluir o evento '${info.event.title}'?`)) {
                info.event.remove();
                setEvents(events.filter(event => event.id !== info.event.id));
            }
        }
    };

    const handleAddEvent = () => {
        if (newEvent.title && newEvent.date) {
            const categoryData = categoryOptions.find(cat => cat.value === newEvent.category);
            const colors = getCategoryColor(newEvent.category);
            
            const novoEvento = { 
                id: `user-${Date.now()}`,
                title: `${categoryData.icon} ${newEvent.title}`,
                start: newEvent.time ? `${newEvent.date}T${newEvent.time}` : newEvent.date,
                backgroundColor: colors.bg,
                borderColor: colors.border,
                textColor: colors.text,
                classNames: ['event-user'],
                extendedProps: {
                    isManual: false,
                    description: newEvent.description,
                    icon: categoryData.icon,
                    category: newEvent.category
                }
            };
            setEvents([...events, novoEvento]);
            setNewEvent({ title: '', description: '', date: '', time: '', category: 'event', icon: '📌' });
            setModalOpen(false);
        } else {
            alert('Por favor, preencha pelo menos o título e a data.');
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
        <div className="agenda-container container-fluid p-0">
            {isLoading && (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Carregando...</span>
                    </div>
                </div>
            )}
            
            <div className="row g-4 p-4">
                {/* Sidebar com eventos */}
                <div className="col-xl-3 col-lg-4 col-md-5 col-12">
                    <div className="modern-card h-100">
                        <div className="card-header-modern">
                            <h5 className="card-title-modern">📋 Resumo de Eventos</h5>
                        </div>
                        
                        {/* Filtros de visualização */}
                        <div className="view-controls mb-4">
                            <div className="btn-group w-100" role="group">
                                <button 
                                    type="button" 
                                    className={`btn btn-sm ${currentView === 'dayGridMonth' ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => setCurrentView('dayGridMonth')}
                                >
                                    Mês
                                </button>
                                <button 
                                    type="button" 
                                    className={`btn btn-sm ${currentView === 'timeGridWeek' ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => setCurrentView('timeGridWeek')}
                                >
                                    Semana
                                </button>
                                <button 
                                    type="button" 
                                    className={`btn btn-sm ${currentView === 'timeGridDay' ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => setCurrentView('timeGridDay')}
                                >
                                    Dia
                                </button>
                            </div>
                        </div>

                        {/* Eventos de Hoje */}
                        <div className="event-section mb-4">
                            <h6 className="event-section-title">
                                <span className="badge bg-success rounded-pill me-2">
                                    {getEventosDeHoje().length}
                                </span>
                                Eventos de Hoje
                            </h6>
                            <div className="event-list-modern">
                                {getEventosDeHoje().map((event, index) => (
                                    <div key={index} className="event-item-modern today-event">
                                        <div className="event-content">
                                            <div className="event-title">{event.title}</div>
                                            {event.extendedProps?.description && (
                                                <div className="event-description">{event.extendedProps.description}</div>
                                            )}
                                            <div className="event-meta">
                                                {event.extendedProps?.isManual ? (
                                                    <span className="badge bg-primary rounded-pill">Oficial</span>
                                                ) : (
                                                    <span className="badge bg-secondary rounded-pill">Personalizado</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {getEventosDeHoje().length === 0 && (
                                    <div className="no-events">
                                        <i className="text-muted">Nenhum evento hoje</i>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Próximos Eventos */}
                        <div className="event-section mb-4">
                            <h6 className="event-section-title">
                                <span className="badge bg-warning rounded-pill me-2">
                                    {getProximosEventos().length}
                                </span>
                                Próximos 5 Dias
                            </h6>
                            <div className="event-list-modern">
                                {getProximosEventos().map((event, index) => (
                                    <div key={index} className="event-item-modern upcoming-event">
                                        <div className="event-content">
                                            <div className="event-title">{event.title}</div>
                                            <div className="event-date">
                                                📅 {new Date(event.start).toLocaleDateString('pt-BR', {
                                                    weekday: 'short',
                                                    day: 'numeric',
                                                    month: 'short'
                                                })}
                                            </div>
                                            {event.extendedProps?.description && (
                                                <div className="event-description">{event.extendedProps.description}</div>
                                            )}
                                            <div className="event-meta">
                                                {event.extendedProps?.isManual ? (
                                                    <span className="badge bg-primary rounded-pill">Oficial</span>
                                                ) : (
                                                    <span className="badge bg-secondary rounded-pill">Personalizado</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {getProximosEventos().length === 0 && (
                                    <div className="no-events">
                                        <i className="text-muted">Nenhum evento próximo</i>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Botão para adicionar evento */}
                        <div className="mt-auto">
                            <button 
                                className="btn btn-primary w-100 modern-btn" 
                                onClick={() => setModalOpen(true)}
                            >
                                <i className="me-2">➕</i>
                                Novo Evento
                            </button>
                        </div>
                    </div>
                </div>

                {/* Calendário Principal */}
                <div className="col-xl-9 col-lg-8 col-md-7 col-12">
                    <div className="modern-card h-100">
                        <div className="card-header-modern">
                            <h5 className="card-title-modern">📅 Calendário Anual</h5>
                            <div className="card-actions">
                                <span className="badge bg-info rounded-pill">
                                    {allEvents.length} eventos
                                </span>
                            </div>
                        </div>
                        
                        <div className="calendar-wrapper-modern">
                            <FullCalendar
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                initialView={currentView}
                                view={currentView}
                                events={allEvents}
                                dateClick={handleDateClick}
                                eventClick={handleEventClick}
                                locale="pt-br"
                                height="auto"
                                eventDisplay="block"
                                nowIndicator={true}
                                weekNumbers={false}
                                dayMaxEvents={3}
                                moreLinkClick="popover"
                                headerToolbar={{
                                    left: 'prev,next today',
                                    center: 'title',
                                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                                }}
                                buttonText={{
                                    today: 'Hoje',
                                    month: 'Mês',
                                    week: 'Semana',
                                    day: 'Dia'
                                }}
                                slotMinTime="06:00:00"
                                slotMaxTime="22:00:00"
                                allDaySlot={true}
                                editable={false}
                                selectable={true}
                                selectMirror={true}
                                aspectRatio={1.8}
                                eventMouseEnter={(info) => {
                                    info.el.style.transform = 'scale(1.02)';
                                    info.el.style.transition = 'transform 0.2s ease';
                                }}
                                eventMouseLeave={(info) => {
                                    info.el.style.transform = 'scale(1)';
                                }}
                                viewDidMount={(view) => {
                                    setCurrentView(view.view.type);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Cadastro de Evento */}
            {modalOpen && (
                <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content modern-modal">
                            <div className="modal-header-modern">
                                <h5 className="modal-title-modern">
                                    <i className="me-2">➕</i>
                                    Criar Novo Evento
                                </h5>
                                <button 
                                    type="button" 
                                    className="btn-close-modern" 
                                    onClick={() => setModalOpen(false)}
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="modal-body-modern">
                                <div className="row g-3">
                                    <div className="col-md-8">
                                        <label className="form-label-modern">
                                            <i className="me-1">📝</i>
                                            Título do Evento *
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control-modern"
                                            placeholder="Digite o título do evento..."
                                            value={newEvent.title}
                                            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label-modern">
                                            <i className="me-1">🏷️</i>
                                            Categoria
                                        </label>
                                        <select
                                            className="form-control-modern"
                                            value={newEvent.category}
                                            onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                                        >
                                            {categoryOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.icon} {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label-modern">
                                            <i className="me-1">📅</i>
                                            Data *
                                        </label>
                                        <input
                                            type="date"
                                            className="form-control-modern"
                                            value={newEvent.date}
                                            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label-modern">
                                            <i className="me-1">🕒</i>
                                            Horário (opcional)
                                        </label>
                                        <input
                                            type="time"
                                            className="form-control-modern"
                                            value={newEvent.time}
                                            onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label-modern">
                                            <i className="me-1">📄</i>
                                            Descrição
                                        </label>
                                        <textarea
                                            className="form-control-modern"
                                            rows="3"
                                            placeholder="Adicione uma descrição para o evento..."
                                            value={newEvent.description}
                                            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer-modern">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary-modern" 
                                    onClick={() => setModalOpen(false)}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-primary-modern" 
                                    onClick={handleAddEvent}
                                >
                                    <i className="me-1">💾</i>
                                    Salvar Evento
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Visualização de Evento */}
            {eventModalOpen && selectedEvent && (
                <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content modern-modal">
                            <div className="modal-header-modern">
                                <h5 className="modal-title-modern">
                                    <i className="me-2">📋</i>
                                    Detalhes do Evento
                                </h5>
                                <button 
                                    type="button" 
                                    className="btn-close-modern" 
                                    onClick={() => setEventModalOpen(false)}
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="modal-body-modern">
                                <div className="event-detail-card">
                                    <h6 className="event-detail-title">{selectedEvent.title}</h6>
                                    <div className="event-detail-meta mb-3">
                                        <span className="badge bg-primary rounded-pill me-2">
                                            {selectedEvent.isManual ? 'Evento Oficial' : 'Evento Personalizado'}
                                        </span>
                                        <span className="text-muted">
                                            📅 {new Date(selectedEvent.date).toLocaleDateString('pt-BR', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    {selectedEvent.description && (
                                        <div className="event-detail-description">
                                            <strong>Descrição:</strong>
                                            <p className="mt-2">{selectedEvent.description}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="modal-footer-modern">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary-modern w-100" 
                                    onClick={() => setEventModalOpen(false)}
                                >
                                    Fechar
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