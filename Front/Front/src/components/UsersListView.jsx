import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const UsersListView = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const currentUserId = localStorage.getItem('user_id');

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await authService.getAllUsers();

            // Mapeo seguro: miramos "rol", "Rol" o "role" por compatibilidad con tu entidad y DTO
            const sanitizedUsers = data.map(user => ({
                ...user,
                role: (user.rol || user.Rol || user.role || 'USER').replace('ROLE_', '').toUpperCase()
            }));

            setUsers(sanitizedUsers);
        } catch (err) {
            console.error("Error cargando usuarios desde el API:", err);
            setError("No se pudo conectar con el servidor para obtener los usuarios.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = async (userId, targetRole, username) => {
        setSuccess(null);
        setError(null);

        if (targetRole === 'ADMIN') {
            setError('Operación denegada: El rol de Administrador está blindado por el sistema y no puede ser asignado.');
            return;
        }

        try {
            if (targetRole === 'GESTOR') {
                await authService.promoteToGestor(userId);
                setSuccess(`${username} ha sido promocionado a GESTOR con éxito.`);
            } else if (targetRole === 'USER') {
                await authService.demoteToUser(userId);
                setSuccess(`${username} ha sido degradado a USER con éxito.`);
            }
            await fetchUsers();
        } catch (err) {
            console.error("Error cambiando el rol:", err);
            setError("No se pudo cambiar el rol. Verifica los permisos.");
        }
    };

    const handleDeleteUser = async (userId, username) => {
        if (userId === parseInt(currentUserId)) {
            alert("Operación inválida: No puedes eliminar tu propio usuario de administrador.");
            return;
        }

        if (window.confirm(`¿Seguro que deseas eliminar permanentemente al usuario "${username}"?`)) {
            try {
                setError(null);
                setSuccess(null);
                await authService.deleteUser(userId);
                setSuccess(`El usuario "${username}" ha sido eliminado.`);
                setUsers(users.filter(u => u.id !== userId));
            } catch (err) {
                console.error("Error eliminando usuario:", err);
                setError("Hubo un problema en el servidor al intentar borrar al usuario.");
            }
        }
    };

    return (
        <div className="container py-4 animate__animated animate__fadeIn">
            {/* Cabecera */}
            <div className="d-flex justify-content-between align-items-center mb-4 px-2">
                <div>
                    <h3 className="fw-bold text-dark m-0" style={{ letterSpacing: '-0.5px' }}>Panel de Usuarios</h3>
                    <small className="text-muted fw-medium">Administra las cuentas, accesos y privilegios del sistema</small>
                </div>
                <button className="btn btn-light bg-white border shadow-sm rounded-3 px-3 py-2 text-secondary small fw-bold" onClick={fetchUsers}>
                    <i className="bi bi-arrow-clockwise me-1.5 text-primary"></i> Refrescar
                </button>
            </div>

            {/* Alertas */}
            {error && (
                <div className="alert alert-danger border-0 rounded-4 shadow-sm d-flex align-items-center p-3 mb-4" role="alert">
                    <i className="bi bi-exclamation-octagon-fill fs-5 me-2.5"></i>
                    <div className="fw-semibold small">{error}</div>
                </div>
            )}

            {success && (
                <div className="alert alert-success border-0 rounded-4 shadow-sm d-flex align-items-center p-3 mb-4" role="alert">
                    <i className="bi bi-check-circle-fill fs-5 me-2.5"></i>
                    <div className="fw-semibold small">{success}</div>
                </div>
            )}

            {/* Tabla */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                {loading ? (
                    <div className="text-center py-5 my-4">
                        <div className="spinner-border text-primary border-3" role="status" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p className="mt-3 text-muted fw-medium small mb-0">Cargando registros del sistema...</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table align-middle mb-0" style={{ minWidth: '750px' }}>
                            <thead className="bg-light-subtle border-bottom border-light">
                                <tr>
                                    <th className="ps-4 text-secondary small fw-bold text-uppercase py-3" style={{ width: '90px', fontSize: '0.75rem' }}>ID</th>
                                    <th className="text-secondary small fw-bold text-uppercase py-3" style={{ fontSize: '0.75rem' }}>Nombre de Usuario</th>
                                    <th className="text-secondary small fw-bold text-uppercase py-3" style={{ fontSize: '0.75rem' }}>Correo Electrónico</th>
                                    <th className="text-secondary small fw-bold text-uppercase py-3 text-center" style={{ width: '180px', fontSize: '0.75rem' }}>Rol Asignado</th>
                                    <th className="text-secondary small fw-bold text-uppercase py-3 text-center" style={{ width: '120px', fontSize: '0.75rem' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? (
                                    users.map(user => {
                                        const isSelf = user.id === parseInt(currentUserId);
                                        const isAdminRole = user.role === 'ADMIN';
                                        const isGestorRole = user.role === 'GESTOR';

                                        let badgeClass = "bg-secondary-subtle text-secondary";
                                        let badgeIcon = "bi-person";

                                        if (isAdminRole) {
                                            badgeClass = "bg-primary-subtle text-primary border border-primary-subtle";
                                            badgeIcon = "bi-shield-check";
                                        } else if (isGestorRole) {
                                            badgeClass = "bg-info-subtle text-info border border-info-subtle";
                                            badgeIcon = "bi-person-gear";
                                        }

                                        return (
                                            <tr key={user.id} className="border-bottom border-light-subtle">
                                                <td className="ps-4 text-muted fw-bold small">
                                                    <span className="px-2 py-1 bg-light rounded-2 text-secondary">#{user.id}</span>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center gap-2.5 py-1">
                                                        <div className={`rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm ${isAdminRole ? 'bg-primary text-white' : isGestorRole ? 'bg-info text-white' : 'bg-secondary-subtle text-secondary'}`} style={{ width: '36px', height: '36px', fontSize: '0.9rem' }}>
                                                            {(user.userName || user.username || 'U').charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="d-flex flex-column">
                                                            <span className="fw-bold text-dark m-0" style={{ fontSize: '0.95rem' }}>{user.userName || user.username}</span>
                                                            {isSelf && <span className="text-primary fw-bold" style={{ fontSize: '0.7rem' }}>Tú</span>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="text-secondary fw-medium" style={{ fontSize: '0.9rem' }}>{user.email || '—'}</span>
                                                </td>
                                                <td className="text-center">
                                                    <div className="dropdown">
                                                        <button
                                                            className={`btn dropdown-toggle border-0 badge px-3 py-2 rounded-3 fw-bold transition-all ${badgeClass}`}
                                                            type="button"
                                                            id={`dropdownRole-${user.id}`}
                                                            data-bs-toggle="dropdown"
                                                            aria-expanded="false"
                                                            style={{ fontSize: '0.75rem', cursor: 'pointer' }}
                                                        >
                                                            <i className={`bi ${badgeIcon} me-1`}></i>
                                                            {user.role}
                                                        </button>

                                                        <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-3 mt-1" aria-labelledby={`dropdownRole-${user.id}`} style={{ fontSize: '0.85rem' }}>
                                                            <li>
                                                                <h6 className="dropdown-header text-uppercase fw-bold text-muted small" style={{ fontSize: '0.65rem' }}>Asignar Rol</h6>
                                                            </li>
                                                            <li>
                                                                <button className={`dropdown-item d-flex align-items-center gap-2 fw-semibold ${user.role === 'USER' ? 'active' : ''}`} type="button" onClick={() => handleRoleChange(user.id, 'USER', user.userName || user.username)}>
                                                                    <i className="bi bi-person text-secondary"></i> USER
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button className={`dropdown-item d-flex align-items-center gap-2 fw-semibold ${user.role === 'GESTOR' ? 'active' : ''}`} type="button" onClick={() => handleRoleChange(user.id, 'GESTOR', user.userName || user.username)}>
                                                                    <i className="bi bi-person-gear text-info"></i> GESTOR
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button className={`dropdown-item d-flex align-items-center gap-2 fw-semibold ${user.role === 'ADMIN' ? 'active' : ''}`} type="button" onClick={() => handleRoleChange(user.id, 'ADMIN', user.userName || user.username)}>
                                                                    <i className="bi bi-shield-check text-primary"></i> ADMIN
                                                                </button>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </td>
                                                <td className="text-center pe-3">
                                                    <button type="button" className="btn btn-link text-danger p-2 border-0 rounded-3" onClick={() => handleDeleteUser(user.id, user.userName || user.username)} disabled={isSelf} style={{ opacity: isSelf ? 0.35 : 1 }}>
                                                        <i className="bi bi-trash3-fill fs-5"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 text-muted bg-light-subtle">
                                            <p className="m-0 fw-medium">No se encontraron usuarios en la plataforma.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};