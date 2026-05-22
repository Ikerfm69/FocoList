import { useState, useEffect } from 'react';
import { taskService } from '../services/taskServices';
import { categoryService } from '../services/categoryService';

export const CreateTaskForm = ({ onTaskCreated, editingTask, onCancelEdit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('MEDIUM');
    const [dueDate, setDueDate] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [tagsInput, setTagsInput] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const isEditing = !!editingTask;

    useEffect(() => {
        categoryService.getAllCategories()
            .then(data => {
                setCategories(data);
                // Ahora que tenemos categorías, podemos buscar la del editingTask
                if (editingTask) {
                    const cat = data.find(c => c.title === editingTask.categoryTitle);
                    setCategoryId(cat ? String(cat.id) : '');
                }
            })
            .catch(err => console.error('Error cargando categorías:', err));
    }, []);

    useEffect(() => {
        if (editingTask) {
            setTitle(editingTask.title || '');
            setDescription(editingTask.description || '');
            setPriority(editingTask.priority || 'MEDIUM');
            setDueDate(editingTask.dueDate ? editingTask.dueDate.substring(0, 16) : '');
            setTagsInput(editingTask.tags ? Array.from(editingTask.tags).join(', ') : '');
            // categoryId se setea en el useEffect de arriba cuando ya tiene las categorías
        }
    }, [editingTask]);

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setPriority('MEDIUM');
        setDueDate('');
        setCategoryId('');
        setTagsInput('');
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!title.trim() || !description.trim()) {
            setError('El título y la descripción son obligatorios.');
            return;
        }
        if (!dueDate) {
            setError('La fecha límite es obligatoria.');
            return;
        }

        const tagsArray = tagsInput
            .split(',')
            .map(t => t.trim())
            .filter(t => t.length > 0)
            .map(name => ({ name }));

        const taskPayload = {
            title: title.trim(),
            description: description.trim(),
            priority,
            status: isEditing ? (editingTask.status || 'PENDING') : 'PENDING',
            dueDate,
            category: categoryId ? { id: parseInt(categoryId) } : null,
            tags: tagsArray.length > 0 ? tagsArray : null
        };

        try {
            setLoading(true);
            if (isEditing) {
                await taskService.updateTask(editingTask.id, taskPayload);
                setSuccess('Tarea actualizada correctamente.');
                if (onCancelEdit) onCancelEdit();
            } else {
                await taskService.createTask(taskPayload);
                setSuccess('¡Tarea creada exitosamente!');
                resetForm();
            }
            if (onTaskCreated) onTaskCreated();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error('Error guardando tarea:', err);
            setError(err.response?.data?.message || 'No se pudo guardar la tarea. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="row g-4 w-100 m-0">
            <div className="col-12 col-xl-8 p-0 pe-xl-4">
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <h2 className="fw-bold text-dark m-0">
                        <i className={`bi ${isEditing ? 'bi-pencil-square' : 'bi-plus-circle'} me-2 text-primary`}></i>
                        {isEditing ? 'Editar Tarea' : 'Nueva Tarea'}
                    </h2>
                    {isEditing && (
                        <button
                            onClick={() => { resetForm(); if (onCancelEdit) onCancelEdit(); }}
                            className="btn btn-sm btn-outline-secondary rounded-3 px-3"
                        >
                            <i className="bi bi-x-lg me-1"></i> Cancelar
                        </button>
                    )}
                </div>

                {error && (
                    <div className="alert alert-danger py-2 rounded-4 border-0 shadow-sm small d-flex align-items-center mb-4" role="alert">
                        <i className="bi bi-exclamation-circle-fill me-2"></i> {error}
                    </div>
                )}
                {success && (
                    <div className="alert alert-success py-2 rounded-4 border-0 shadow-sm small d-flex align-items-center mb-4" role="alert">
                        <i className="bi bi-check-circle-fill me-2"></i> {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="neumorphic-card p-4 mb-4">
                        {/* Título */}
                        <div className="mb-4">
                            <label className="form-label text-muted small fw-bold mb-2">Título</label>
                            <input
                                type="text"
                                className="form-control neumorphic-input"
                                placeholder="Ej: Diseñar nueva pantalla de inicio"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        {/* Descripción */}
                        <div className="mb-4">
                            <label className="form-label text-muted small fw-bold mb-2">Descripción</label>
                            <textarea
                                className="form-control neumorphic-input"
                                rows="3"
                                placeholder="Describe los detalles de la tarea..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                style={{ resize: 'none' }}
                            />
                        </div>

                        {/* Fila: Prioridad + Categoría */}
                        <div className="row g-3 mb-4">
                            <div className="col-12 col-md-6">
                                <label className="form-label text-muted small fw-bold mb-2">Prioridad</label>
                                <select
                                    className="form-select neumorphic-input"
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                >
                                    <option value="LOW">🟢 Baja</option>
                                    <option value="MEDIUM">🟡 Media</option>
                                    <option value="HIGH">🔴 Alta</option>
                                </select>
                            </div>
                            <div className="col-12 col-md-6">
                                <label className="form-label text-muted small fw-bold mb-2">Categoría</label>
                                <select
                                    className="form-select neumorphic-input"
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                >
                                    <option value="">Sin categoría</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.title}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Fila: Fecha + Tags */}
                        <div className="row g-3 mb-4">
                            <div className="col-12 col-md-6">
                                <label className="form-label text-muted small fw-bold mb-2">Fecha límite</label>
                                <input
                                    type="datetime-local"
                                    className="form-control neumorphic-input"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                />
                            </div>
                            <div className="col-12 col-md-6">
                                <label className="form-label text-muted small fw-bold mb-2">Etiquetas</label>
                                <input
                                    type="text"
                                    className="form-control neumorphic-input"
                                    placeholder="urgente, frontend, bug..."
                                    value={tagsInput}
                                    onChange={(e) => setTagsInput(e.target.value)}
                                />
                                <small className="text-muted" style={{ fontSize: '0.7rem' }}>Separa las etiquetas con comas</small>
                            </div>
                        </div>
                    </div>

                    {/* Botón de envío */}
                    <button
                        type="submit"
                        className="btn btn-primary border-0 w-100 py-3 rounded-4 fw-bold shadow-sm"
                        style={{ background: 'linear-gradient(145deg, #0d6efd, #0b5ed7)' }}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="spinner-border spinner-border-sm" role="status"></span>
                        ) : (
                            <>
                                <i className={`bi ${isEditing ? 'bi-check-lg' : 'bi-plus-lg'} me-2`}></i>
                                {isEditing ? 'Guardar Cambios' : 'Crear Tarea'}
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Panel lateral de ayuda */}
            <div className="col-12 col-xl-4 p-0 mt-5 mt-xl-0">
                <div className="d-flex flex-column gap-4">
                    <div className="neumorphic-card p-4">
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <i className="bi bi-info-circle-fill text-primary fs-5"></i>
                            <h5 className="fw-bold text-dark m-0">Consejos</h5>
                        </div>
                        <ul className="text-muted small lh-lg mb-0 ps-3">
                            <li>Usa títulos claros y concisos</li>
                            <li>Asigna una prioridad según la urgencia</li>
                            <li>Las etiquetas ayudan a filtrar tareas</li>
                            <li>La fecha límite te ayudará a organizarte</li>
                        </ul>
                    </div>

                    <div className="neumorphic-card p-4">
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <i className="bi bi-lightning-charge-fill text-warning fs-5"></i>
                            <h5 className="fw-bold text-dark m-0">Prioridades</h5>
                        </div>
                        <div className="d-flex flex-column gap-2">
                            <div className="d-flex align-items-center gap-2">
                                <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 rounded-2" style={{ fontSize: '0.7rem' }}>🔴 Alta</span>
                                <span className="text-muted small">Tareas urgentes y críticas</span>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-2 py-1 rounded-2" style={{ fontSize: '0.7rem' }}>🟡 Media</span>
                                <span className="text-muted small">Tareas importantes pero no urgentes</span>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 rounded-2" style={{ fontSize: '0.7rem' }}>🟢 Baja</span>
                                <span className="text-muted small">Tareas que pueden esperar</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
