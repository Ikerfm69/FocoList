import { useState, useEffect } from 'react';
import { taskService } from '../services/taskServices';

export const DashboardView = ({ onNavigate }) => {
    const [tasks, setTasks] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // 🔄 CORREGIDO: Ahora llama a getTaskStats() que coincide con tu servicio
                const [tasksData, statsData] = await Promise.all([
                    taskService.getAllTasks(),
                    taskService.getTaskStats()
                ]);
                setTasks(tasksData);
                setStats(statsData);
            } catch (err) {
                console.error("Error capturado en el Dashboard:", err);
                setError('No se pudieron cargar los datos. ¿Está el backend encendido?');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="text-center py-5">
            <div className="spinner-border text-primary mb-2" role="status"></div>
            <p className="text-muted small">Cargando dashboard...</p>
        </div>
    );

    if (error) return (
        <div className="alert alert-warning rounded-4 border-0 shadow-sm small">
            <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
        </div>
    );

    const now = new Date();
    const activeTasks = tasks.filter(t => t.status !== 'COMPLETED' && t.status !== 'completed');
    const overdueTasks = tasks.filter(t =>
        (t.status !== 'COMPLETED' && t.status !== 'completed') &&
        t.dueDate && new Date(t.dueDate) < now
    );

    const total = stats?.totalTasks ?? tasks.length;
    const completed = stats?.completedTasks ?? 0;
    const pending = stats?.pendingTasks ?? 0;
    const overdue = overdueTasks.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    const getPriorityBadge = (priority) => {
        switch (priority?.toUpperCase()) {
            case 'HIGH': return { text: '🔴 Alta', cls: 'bg-danger-subtle text-danger' };
            case 'LOW': return { text: '🟢 Baja', cls: 'bg-success-subtle text-success' };
            default: return { text: '🟡 Media', cls: 'bg-warning-subtle text-warning' };
        }
    };

    return (
        <div className="d-flex flex-column gap-4">

            {/* TÍTULO */}
            <div>
                <h3 className="text-muted small m-0">Resumen general de tu actividad</h3>
            </div>

            {/* FILA DE TARJETAS DE ESTADÍSTICAS */}
            <div className="row g-3">

                <div className="col-6 col-xl-3">
                    <div className="neumorphic-card p-4 d-flex align-items-center gap-3">
                        <div className="bg-primary bg-opacity-10 rounded-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', flexShrink: 0 }}>
                            <i className="bi bi-list-task text-primary fs-4"></i>
                        </div>
                        <div>
                            <p className="text-muted small fw-semibold m-0">Total</p>
                            <h3 className="fw-bold text-dark m-0">{total}</h3>
                        </div>
                    </div>
                </div>

                <div className="col-6 col-xl-3">
                    <div className="neumorphic-card p-4 d-flex align-items-center gap-3">
                        <div className="bg-success bg-opacity-10 rounded-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', flexShrink: 0 }}>
                            <i className="bi bi-check-circle text-success fs-4"></i>
                        </div>
                        <div>
                            <p className="text-muted small fw-semibold m-0">Completadas</p>
                            <h3 className="fw-bold text-dark m-0">{completed}</h3>
                        </div>
                    </div>
                </div>

                <div className="col-6 col-xl-3">
                    <div className="neumorphic-card p-4 d-flex align-items-center gap-3">
                        <div className="bg-warning bg-opacity-10 rounded-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', flexShrink: 0 }}>
                            <i className="bi bi-hourglass-split text-warning fs-4"></i>
                        </div>
                        <div>
                            <p className="text-muted small fw-semibold m-0">Pendientes</p>
                            <h3 className="fw-bold text-dark m-0">{pending}</h3>
                        </div>
                    </div>
                </div>

                <div className="col-6 col-xl-3">
                    <div className="neumorphic-card p-4 d-flex align-items-center gap-3">
                        <div className="bg-danger bg-opacity-10 rounded-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', flexShrink: 0 }}>
                            <i className="bi bi-alarm text-danger fs-4"></i>
                        </div>
                        <div>
                            <p className="text-muted small fw-semibold m-0">Atrasadas</p>
                            <h3 className="fw-bold text-dark m-0">{overdue}</h3>
                        </div>
                    </div>
                </div>

            </div>

            {/* FILA INFERIOR: Gráfica + Tareas activas */}
            <div className="row g-4">

                {/* GRÁFICA DE PROGRESO */}
                <div className="col-12 col-xl-4">
                    <div className="neumorphic-card p-4 text-center h-100 d-flex flex-column justify-content-between">
                        <h5 className="fw-bold text-dark text-start mb-3">Progreso General</h5>

                        <div className="d-flex justify-content-center my-3">
                            <div className="rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                                style={{
                                    width: '160px', height: '160px',
                                    background: `conic-gradient(#0d6efd ${percentage}%, #e6e9ef 0)`
                                }}>
                                <div className="bg-white rounded-circle d-flex flex-column align-items-center justify-content-center"
                                    style={{ width: '130px', height: '130px' }}>
                                    <h2 className="fw-bold m-0 text-dark">{percentage}%</h2>
                                    <span className="text-muted fw-bold" style={{ fontSize: '0.65rem' }}>COMPLETADO</span>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex flex-column gap-2 mt-3">
                            <div className="d-flex justify-content-between text-muted small fw-semibold px-1">
                                <span>✅ Completadas</span><span className="text-dark">{completed}</span>
                            </div>
                            <div className="d-flex justify-content-between text-muted small fw-semibold px-1">
                                <span>⏳ Pendientes</span><span className="text-dark">{pending}</span>
                            </div>
                            <div className="d-flex justify-content-between text-muted small fw-semibold px-1">
                                <span>🔴 Atrasadas</span><span className="text-danger fw-bold">{overdue}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TAREAS ACTIVAS */}
                <div className="col-12 col-xl-8">
                    <div className="neumorphic-card p-4 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold text-dark m-0">Tareas Activas</h5>
                            <button
                                onClick={() => onNavigate('tasks')}
                                className="btn btn-sm btn-link text-primary text-decoration-none fw-semibold p-0"
                            >
                                Ver todas <i className="bi bi-arrow-right ms-1"></i>
                            </button>
                        </div>

                        {activeTasks.length === 0 ? (
                            <div className="text-center py-5 text-muted small">
                                <i className="bi bi-check-all fs-2 d-block mb-2 text-success"></i>
                                ¡Todo al día! No hay tareas pendientes.
                            </div>
                        ) : (
                            <div className="d-flex flex-column gap-3" style={{ maxHeight: '380px', overflowY: 'auto' }}>
                                {activeTasks.map(task => {
                                    const badge = getPriorityBadge(task.priority);
                                    const isOverdue = task.dueDate && new Date(task.dueDate) < now;
                                    return (
                                        <div key={task.id} className={`d-flex align-items-center gap-3 p-3 rounded-4 ${isOverdue ? 'bg-danger bg-opacity-10' : 'bg-white'} shadow-sm`}>
                                            <div className={`rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 ${isOverdue ? 'bg-danger bg-opacity-25' : 'bg-primary bg-opacity-10'}`}
                                                style={{ width: '40px', height: '40px' }}>
                                                <i className={`bi ${isOverdue ? 'bi-alarm text-danger' : 'bi-clock text-primary'} fs-5`}></i>
                                            </div>
                                            <div className="flex-grow-1 min-w-0">
                                                <h6 className="fw-bold text-dark m-0 text-truncate">{task.title}</h6>
                                                <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                                                    {task.categoryTitle || 'Sin categoría'} &bull; {task.dueDate ? new Date(task.dueDate).toLocaleDateString('es-ES') : 'Sin fecha'}
                                                </span>
                                            </div>
                                            <span className={`badge ${badge.cls} px-2 py-1 rounded-3 flex-shrink-0`} style={{ fontSize: '0.65rem' }}>
                                                {badge.text}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};