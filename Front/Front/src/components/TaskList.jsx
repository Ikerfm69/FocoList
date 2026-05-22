import { useState, useEffect } from 'react';
import { taskService } from '../services/taskServices';
import api from '../services/api';

export const TaskList = ({ onEditTask }) => {
    const [tasks, setTasks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filtros
    const [filterTitle, setFilterTitle] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterPriority, setFilterPriority] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterTag, setFilterTag] = useState('');

    const fetchTasks = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await taskService.getAllTasks();
            setTasks(data);
        } catch (err) {
            setError('No se pudieron cargar las tareas. ¿Está el backend encendido?');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
        // Cargar categorías y etiquetas para los filtros
        api.get('/categories').then(r => setCategories(r.data)).catch(() => { });
        api.get('/tags').then(r => setTags(r.data)).catch(() => { });
    }, []);

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = (currentStatus === 'COMPLETED' || currentStatus === 'completed')
            ? 'PENDING' : 'COMPLETED';
        try {
            await taskService.updateStatus(id, newStatus);
            fetchTasks();
        } catch {
            alert('No se pudo actualizar el estado de la tarea.');
        }
    };

    const handleDeleteTask = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
            try {
                await taskService.deleteTask(id);
                fetchTasks();
            } catch {
                alert('No se pudo eliminar la tarea.');
            }
        }
    };

    const clearFilters = () => {
        setFilterTitle('');
        setFilterStatus('');
        setFilterPriority('');
        setFilterCategory('');
        setFilterTag('');
    };

    const hasActiveFilters = filterTitle || filterStatus || filterPriority || filterCategory || filterTag;

    // Filtrado en cliente
    const filteredTasks = tasks.filter(task => {
        const matchTitle = !filterTitle ||
            task.title?.toLowerCase().includes(filterTitle.toLowerCase());

        const matchStatus = !filterStatus ||
            task.status?.toUpperCase() === filterStatus.toUpperCase();

        const matchPriority = !filterPriority ||
            task.priority?.toUpperCase() === filterPriority.toUpperCase();

        const matchCategory = !filterCategory ||
            task.categoryTitle?.toLowerCase().includes(filterCategory.toLowerCase());

        const matchTag = !filterTag ||
            (task.tags && task.tags.some(t => t.toLowerCase().includes(filterTag.toLowerCase())));

        return matchTitle && matchStatus && matchPriority && matchCategory && matchTag;
    });

    const getPriorityBadge = (priority) => {
        switch (priority?.toUpperCase()) {
            case 'HIGH': return { text: '🔴 Alta', cls: 'border-danger-subtle text-danger bg-danger-subtle' };
            case 'LOW': return { text: '🟢 Baja', cls: 'border-success-subtle text-success bg-success-subtle' };
            default: return { text: '🟡 Media', cls: 'border-warning-subtle text-warning bg-warning-subtle' };
        }
    };

    const getStatusBadge = (status) => {
        switch (status?.toUpperCase()) {
            case 'COMPLETED': return { text: '✅ Completada', cls: 'bg-success-subtle text-success' };
            case 'IN_PROGRESS': return { text: '🔄 En progreso', cls: 'bg-info-subtle text-info' };
            default: return { text: '⏳ Pendiente', cls: 'bg-warning-subtle text-warning' };
        }
    };

    const catColors = ['primary', 'warning', 'info', 'success', 'danger'];
    const getCatColor = (title = 'GENERAL') => {
        let hash = 0;
        for (let i = 0; i < title.length; i++) hash += title.charCodeAt(i);
        return catColors[hash % catColors.length];
    };

    return (
        <div className="d-flex flex-column gap-4">

            {/* CABECERA */}
            <div className="d-flex align-items-center justify-content-between">
                <div>
                    <h2 className="fw-bold text-dark m-0">Mis Tareas</h2>
                    <p className="text-muted small m-0">
                        {filteredTasks.length} tarea{filteredTasks.length !== 1 ? 's' : ''} encontrada{filteredTasks.length !== 1 ? 's' : ''}
                        {hasActiveFilters && <span className="text-primary"> (filtrado)</span>}
                    </p>
                </div>
                <button
                    onClick={() => onEditTask(null)}
                    className="btn btn-primary border-0 px-4 py-2 rounded-4 fw-bold shadow-sm"
                    style={{ background: 'linear-gradient(145deg, #0d6efd, #0b5ed7)' }}
                >
                    <i className="bi bi-plus-lg me-2"></i> Nueva Tarea
                </button>
            </div>

            {/* PANEL DE FILTROS */}
            <div className="bg-white rounded-4 shadow-sm p-4" style={{ border: '1px solid #f0f0f0' }}>
                <div className="row g-3 align-items-end">

                    {/* Título */}
                    <div className="col-12 col-md-4 col-xl">
                        <label className="form-label fw-bold mb-2" style={{ fontSize: '0.78rem', color: '#3d4f73' }}>
                            Buscador por Título
                        </label>
                        <input
                            type="text"
                            className="form-control rounded-3 border"
                            placeholder="Buscar..."
                            value={filterTitle}
                            onChange={e => setFilterTitle(e.target.value)}
                            style={{ background: '#fafafa', fontSize: '0.9rem' }}
                        />
                    </div>

                    {/* Estado */}
                    <div className="col-6 col-md-4 col-xl">
                        <label className="form-label fw-bold mb-2" style={{ fontSize: '0.78rem', color: '#3d4f73' }}>
                            Filtrar por Estado
                        </label>
                        <select
                            className="form-select rounded-3 border"
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value)}
                            style={{ background: '#fafafa', fontSize: '0.9rem' }}
                        >
                            <option value="">Todos los Estados</option>
                            <option value="PENDING">⏳ Pendiente</option>
                            <option value="IN_PROGRESS">🔄 En Progreso</option>
                            <option value="COMPLETED">✅ Completada</option>
                        </select>
                    </div>

                    {/* Prioridad */}
                    <div className="col-6 col-md-4 col-xl">
                        <label className="form-label fw-bold mb-2" style={{ fontSize: '0.78rem', color: '#3d4f73' }}>
                            Filtrar por Prioridad
                        </label>
                        <select
                            className="form-select rounded-3 border"
                            value={filterPriority}
                            onChange={e => setFilterPriority(e.target.value)}
                            style={{ background: '#fafafa', fontSize: '0.9rem' }}
                        >
                            <option value="">Todas las Prioridades</option>
                            <option value="HIGH">🔴 Alta</option>
                            <option value="MEDIUM">🟡 Media</option>
                            <option value="LOW">🟢 Baja</option>
                        </select>
                    </div>

                    {/* Categoría */}
                    <div className="col-6 col-md-6 col-xl">
                        <label className="form-label fw-bold mb-2" style={{ fontSize: '0.78rem', color: '#3d4f73' }}>
                            Categoría
                        </label>
                        <select
                            className="form-select rounded-3 border"
                            value={filterCategory}
                            onChange={e => setFilterCategory(e.target.value)}
                            style={{ background: '#fafafa', fontSize: '0.9rem' }}
                        >
                            <option value="">Todas</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.title}>{cat.title}</option>
                            ))}
                        </select>
                    </div>

                    {/* Etiqueta */}
                    <div className="col-6 col-md-6 col-xl">
                        <label className="form-label fw-bold mb-2" style={{ fontSize: '0.78rem', color: '#3d4f73' }}>
                            Etiqueta
                        </label>
                        <select
                            className="form-select rounded-3 border"
                            value={filterTag}
                            onChange={e => setFilterTag(e.target.value)}
                            style={{ background: '#fafafa', fontSize: '0.9rem' }}
                        >
                            <option value="">Todas</option>
                            {tags.map(tag => (
                                <option key={tag.id} value={tag.name}>{tag.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Limpiar */}
                    {hasActiveFilters && (
                        <div className="col-auto d-flex align-items-end">
                            <button
                                onClick={clearFilters}
                                className="btn btn-outline-danger rounded-3 fw-semibold px-3"
                                style={{ fontSize: '0.85rem' }}
                            >
                                <i className="bi bi-x-circle me-1"></i> Limpiar
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ESTADOS DE CARGA Y ERROR */}
            {loading && (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary mb-2" role="status"></div>
                    <p className="text-muted small">Sincronizando con el servidor...</p>
                </div>
            )}

            {error && (
                <div className="alert alert-warning rounded-4 border-0 shadow-sm small">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
                </div>
            )}

            {/* LISTADO DE TAREAS */}
            {!loading && !error && filteredTasks.length === 0 && (
                <div className="neumorphic-card p-5 text-center text-muted">
                    <i className="bi bi-folder-x fs-2 d-block mb-2 text-primary"></i>
                    <p className="small m-0">
                        {hasActiveFilters
                            ? 'Ninguna tarea coincide con los filtros aplicados.'
                            : 'Aún no tienes tareas. ¡Crea la primera!'}
                    </p>
                </div>
            )}

            {!loading && !error && filteredTasks.length > 0 && (
                <div className="row g-4">
                    {filteredTasks.map(task => {
                        const priorityBadge = getPriorityBadge(task.priority);
                        const statusBadge = getStatusBadge(task.status);
                        const catTitle = task.categoryTitle || 'General';
                        const bgColor = getCatColor(catTitle);
                        const textColor = ['warning', 'info'].includes(bgColor) ? 'text-dark' : 'text-white';

                        return (
                            <div key={task.id} className="col-12 col-md-6 col-xl-4">
                                <div className="neumorphic-card p-4 h-100 d-flex flex-column justify-content-between">
                                    <div>
                                        {/* Header tarjeta */}
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <span className={`badge bg-${bgColor} ${textColor} px-3 py-2 rounded-pill shadow-sm`} style={{ fontSize: '0.65rem' }}>
                                                <i className="bi bi-folder2-open me-1"></i>{catTitle}
                                            </span>
                                            <div className="dropdown">
                                                <button className="btn p-0 text-muted border-0 bg-transparent" type="button" data-bs-toggle="dropdown">
                                                    <i className="bi bi-three-dots-vertical fs-5"></i>
                                                </button>
                                                <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg rounded-4 p-2">
                                                    <li>
                                                        <button
                                                            onClick={() => handleToggleStatus(task.id, task.status)}
                                                            className="dropdown-item rounded-3 small py-2 d-flex align-items-center gap-2"
                                                        >
                                                            <i className={`bi ${task.status === 'COMPLETED' ? 'bi-arrow-counterclockwise' : 'bi-check-circle'} text-success`}></i>
                                                            {task.status === 'COMPLETED' ? 'Marcar Pendiente' : 'Completar'}
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button
                                                            onClick={() => onEditTask(task)}
                                                            className="dropdown-item rounded-3 small py-2 d-flex align-items-center gap-2"
                                                        >
                                                            <i className="bi bi-pencil-square text-primary"></i> Editar
                                                        </button>
                                                    </li>
                                                    <li><hr className="dropdown-divider opacity-10" /></li>
                                                    <li>
                                                        <button
                                                            onClick={() => handleDeleteTask(task.id)}
                                                            className="dropdown-item rounded-3 small py-2 d-flex align-items-center gap-2 text-danger"
                                                        >
                                                            <i className="bi bi-trash"></i> Eliminar
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Contenido */}
                                        <h5 className="fw-bold text-dark mb-2">{task.title}</h5>
                                        <p className="text-muted small lh-base mb-3">{task.description}</p>

                                        {/* Estado */}
                                        <span className={`badge ${statusBadge.cls} px-2 py-1 rounded-3 small mb-3`}>
                                            {statusBadge.text}
                                        </span>

                                        {/* Tags */}
                                        {task.tags?.length > 0 && (
                                            <div className="d-flex flex-wrap gap-1 mb-2">
                                                {task.tags.map(tagName => (
                                                    <span key={tagName} className="badge bg-secondary bg-opacity-75 text-white px-2 py-1 rounded-2" style={{ fontSize: '0.62rem' }}>
                                                        <i className="bi bi-tag-fill me-1"></i>{tagName}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer tarjeta */}
                                    <div className="d-flex justify-content-between align-items-center pt-3 border-top border-light-subtle mt-2">
                                        <span className={`badge ${priorityBadge.cls} px-2 py-1 rounded-3 fw-bold`} style={{ fontSize: '0.65rem' }}>
                                            {priorityBadge.text}
                                        </span>
                                        <span className="text-primary fw-bold small" style={{ fontSize: '0.7rem', backgroundColor: 'rgba(13,110,253,0.08)', padding: '4px 8px', borderRadius: '8px' }}>
                                            <i className="bi bi-calendar3 me-1"></i>
                                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString('es-ES') : 'Sin fecha'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* BOTÓN CREAR NUEVA TAREA (abajo) */}
            {!loading && (
                <div className="d-flex justify-content-center pt-2">
                    <button
                        onClick={() => onEditTask(null)}
                        className="btn btn-outline-primary rounded-4 px-5 py-2 fw-semibold"
                    >
                        <i className="bi bi-plus-circle me-2"></i>
                        Crear nueva tarea
                    </button>
                </div>
            )}

        </div>
    );
};