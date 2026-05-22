import React, { useState, useEffect } from 'react';
import { tagService } from '../services/tagService';

export const TagList = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTagName, setNewTagName] = useState('');

  const fetchTags = async () => {
    try {
      setLoading(true);
      const data = await tagService.getAllTags();
      setTags(data);
    } catch (err) {
      setError('No se pudieron cargar las etiquetas.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleCreateTag = async (e) => {
    e.preventDefault();
    if (!newTagName.trim()) {
      setError('El nombre de la etiqueta no puede estar vacío.');
      return;
    }
    try {
      const newTag = { name: newTagName };
      await tagService.createTag(newTag);
      setNewTagName('');
      fetchTags();
    } catch (err) {
      setError('Error al crear la etiqueta.');
      console.error(err);
    }
  };

  const handleDeleteTag = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta etiqueta?')) {
      try {
        await tagService.deleteTag(id);
        fetchTags();
      } catch (err) {
        setError('Error al eliminar la etiqueta.');
        console.error(err);
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Panel de Etiquetas</h2>
          <p className="text-muted">Crea y gestiona las etiquetas para tus tareas.</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-5">
        {/* Formulario de Creación */}
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h5 className="card-title fw-bold mb-4">Crear Etiqueta</h5>
              <form onSubmit={handleCreateTag}>
                <div className="mb-3">
                  <label htmlFor="tagName" className="form-label fw-semibold">Nombre de Etiqueta</label>
                  <input
                    type="text"
                    className="form-control"
                    id="tagName"
                    placeholder="Ej. urgente"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100 py-2 fw-bold">
                  Crear Etiqueta
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Lista de Etiquetas */}
        <div className="col-md-8">
          {loading ? (
            <p>Cargando etiquetas...</p>
          ) : (
            <div className="card shadow-sm">
              <div className="card-body">
                {tags.length > 0 ? (
                  <div className="d-flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <div key={tag.id} className="badge bg-secondary text-white p-2 d-flex align-items-center">
                        <span className="me-2 fs-6">{tag.name}</span>
                        <button
                          onClick={() => handleDeleteTag(tag.id)}
                          className="btn btn-sm btn-link text-white p-0 opacity-75 custom-hover-opacity"
                          style={{ textDecoration: 'none' }}
                        >
                          <i className="bi bi-x-circle-fill"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted m-0 py-4">No hay etiquetas para mostrar.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
