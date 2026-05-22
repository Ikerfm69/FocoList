import React, { useState, useEffect } from 'react';
import { categoryService } from '../services/categoryService';

export const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('primary'); // ← FALTABA

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch {
      setError('No se pudieron cargar las categorías.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      setError('El nombre no puede estar vacío.');
      return;
    }
    try {
      await categoryService.createCategory({ title: newCategoryName, enfasis: newCategoryColor });
      setNewCategoryName('');
      setNewCategoryColor('primary');
      setError(null);
      fetchCategories();
    } catch {
      setError('Error al crear la categoría.');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('¿Eliminar esta categoría?')) return;
    try {
      await categoryService.deleteCategory(id);
      fetchCategories();
    } catch {
      setError('Error al eliminar la categoría.');
    }
  };

  const getCatColor = (cat) => cat.enfasis || 'primary';
  const getTextColor = (bg) => ['warning', 'info'].includes(bg) ? 'text-dark' : 'text-white';

  return (
    <div className="d-flex flex-column gap-4">

      <div>
        <h2 className="fw-bold text-dark m-0">Panel de Categorías</h2>
        <p className="text-muted small m-0">Define temáticas para clasificar el flujo y la asignación de tareas.</p>
      </div>

      {error && (
        <div className="alert alert-danger rounded-4 border-0 shadow-sm small">
          <i className="bi bi-exclamation-circle me-2"></i>{error}
        </div>
      )}

      <div className="row g-4">

        {/* FORMULARIO */}
        <div className="col-12 col-md-4">
          <div className="bg-white rounded-4 shadow-sm p-4" style={{ border: '1px solid #f0f0f0' }}>
            <h5 className="fw-bold text-dark mb-4">Crear Categoría</h5>
            <form onSubmit={handleCreateCategory}>
              <div className="mb-4">
                <label className="form-label fw-bold mb-2" style={{ fontSize: '0.78rem', color: '#3d4f73' }}>
                  NOMBRE DE CATEGORÍA
                </label>
                <input
                  type="text"
                  className="form-control rounded-3 border"
                  placeholder="Ej. Seguridad"
                  value={newCategoryName}
                  onChange={e => setNewCategoryName(e.target.value)}
                  style={{ background: '#fafafa', fontSize: '0.9rem' }}
                />
              </div>

              {/* SELECTOR DE COLOR — siempre visible */}
              <div className="mb-4">
                <label className="form-label fw-bold mb-2" style={{ fontSize: '0.78rem', color: '#3d4f73' }}>
                  COLOR DE ÉNFASIS
                </label>
                <div className="d-flex flex-wrap gap-2">
                  {['primary', 'success', 'danger', 'warning', 'info', 'secondary'].map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewCategoryColor(color)}
                      className={`badge bg-${color} ${getTextColor(color)} border-0 px-3 py-2`}
                      style={{
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        outline: newCategoryColor === color ? '3px solid #3d4f73' : '3px solid transparent',
                        outlineOffset: '2px',
                        transition: 'outline 0.15s'
                      }}
                    >
                      {color.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-bold rounded-3"
                style={{ background: 'linear-gradient(145deg, #0d6efd, #0b5ed7)', border: 'none' }}
              >
                <i className="bi bi-plus-lg me-2"></i>Crear Categoría
              </button>
            </form>
          </div>
        </div>

        {/* TABLA */}
        <div className="col-12 col-md-8">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary mb-2" role="status"></div>
              <p className="text-muted small">Cargando categorías...</p>
            </div>
          ) : (
            <div className="bg-white rounded-4 shadow-sm" style={{ border: '1px solid #f0f0f0', overflow: 'hidden' }}>
              <table className="table m-0">
                <thead>
                  <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                    <th className="px-4 py-3 text-muted fw-bold" style={{ fontSize: '0.8rem' }}>ID</th>
                    <th className="px-4 py-3 text-muted fw-bold" style={{ fontSize: '0.8rem' }}>Categoría</th>
                    <th className="px-4 py-3 text-muted fw-bold" style={{ fontSize: '0.8rem' }}>Énfasis</th>
                    <th className="px-4 py-3 text-muted fw-bold text-end" style={{ fontSize: '0.8rem' }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length > 0 ? categories.map((cat, idx) => {
                    const bg = getCatColor(cat); // ← CORREGIDO: cat, no cat.title
                    const tc = getTextColor(bg);
                    return (
                      <tr
                        key={cat.id}
                        style={{ borderBottom: idx < categories.length - 1 ? '1px solid #f5f5f5' : 'none' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                        onMouseLeave={e => e.currentTarget.style.background = 'white'}
                      >
                        <td className="px-4 py-3 text-muted fw-semibold" style={{ fontSize: '0.9rem' }}>#{cat.id}</td>
                        <td className="px-4 py-3 fw-bold text-dark" style={{ fontSize: '0.9rem' }}>{cat.title}</td>
                        <td className="px-4 py-3">
                          <span className={`badge bg-${bg} ${tc} px-3 py-2`} style={{ fontSize: '0.75rem' }}>
                            {bg.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-end">
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="btn btn-outline-danger btn-sm rounded-3"
                            style={{ width: '34px', height: '34px', padding: 0 }}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan="4" className="text-center py-5 text-muted small">
                        <i className="bi bi-folder-x fs-2 d-block mb-2 text-primary"></i>
                        No hay categorías creadas todavía.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};