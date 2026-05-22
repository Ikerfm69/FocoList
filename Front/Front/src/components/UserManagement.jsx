import { useState, useEffect } from 'react';
import api from '../services/api';

export const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pendingRoles, setPendingRoles] = useState({});

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/admin/user');
            setUsers(response.data);
        } catch {
            setError('No se pudieron cargar los usuarios.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleRoleChange = (userId, newRole) => {
        setPendingRoles(prev => ({ ...prev, [userId]: newRole }));
    };

    const handleSaveRole = async (userId) => {
        const newRole = pendingRoles[userId];
        if (!newRole) return;
        try {
            const endpoint =
                newRole === 'ADMIN' ? `/admin/user/${userId}/promote` :
                    newRole === 'GESTOR' ? `/admin/user/${userId}/promote-gestor` :
                        `/admin/user/${userId}/demote-user`;
            await api.patch(endpoint);
            setPendingRoles(prev => { const s = { ...prev }; delete s[userId]; return s; });
            fetchUsers();
        } catch {
            alert('No se pudo cambiar el rol.');
        }
    };

    const handleDeleteUser = async (userId, username) => {
        if (!window.confirm(`¿Eliminar al usuario "${username}"? Esta acción no se puede deshacer.`)) return;
        try {
            await api.delete(`/users/${userId}`);
            fetchUsers();
        } catch {
            alert('No se pudo eliminar el usuario.');
        }
    };

    const getRoleBadge = (role) => {
        switch (role) {
            case 'ADMIN': return { bg: '#0d6efd', label: 'ADMIN' };
            case 'GESTOR': return { bg: '#28a745', label: 'GESTOR' };
            default: return { bg: '#6c757d', label: 'USER' };
        }
    };

    return (
        <div className="d-flex flex-column gap-4">

            {/* CABECERA */}
            <div>
                <h2 className="fw-bold text-dark m-0">Administración de Usuarios</h2>
                <p className="text-muted small m-0">Control de accesos corporativos y promoción de roles directivos.</p>
            </div>

            {loading && (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary mb-2" role="status"></div>
                    <p className="text-muted small">Cargando usuarios...</p>
                </div>
            )}

            {error && (
                <div className="alert alert-warning rounded-4 border-0 shadow-sm small">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
                </div>
            )}

            {!loading && !error && (
                <div className="bg-white rounded-4 shadow-sm" style={{ border: '1px solid #f0f0f0', overflow: 'hidden' }}>
                    <table className="table m-0" style={{ borderCollapse: 'separate' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                                <th className="px-4 py-3 text-muted fw-bold" style={{ fontSize: '0.8rem', width: '60px' }}>ID</th>
                                <th className="px-4 py-3 text-muted fw-bold" style={{ fontSize: '0.8rem' }}>Usuario</th>
                                <th className="px-4 py-3 text-muted fw-bold" style={{ fontSize: '0.8rem' }}>Correo Electrónico</th>
                                <th className="px-4 py-3 text-muted fw-bold" style={{ fontSize: '0.8rem' }}>Rol Global</th>
                                <th className="px-4 py-3 text-muted fw-bold text-end" style={{ fontSize: '0.8rem' }}>
                                    Cambiar Rol /<br />Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, idx) => {
                                const roleBadge = getRoleBadge(user.role);
                                const currentPending = pendingRoles[user.id];
                                const isDirty = !!currentPending && currentPending !== user.role;

                                return (
                                    <tr
                                        key={user.id}
                                        style={{
                                            borderBottom: idx < users.length - 1 ? '1px solid #f5f5f5' : 'none',
                                            transition: 'background 0.15s'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'white'}
                                    >
                                        {/* ID */}
                                        <td className="px-4 py-3 text-muted fw-semibold" style={{ fontSize: '0.9rem' }}>
                                            #{user.id}
                                        </td>

                                        {/* Usuario */}
                                        <td className="px-4 py-3">
                                            <div className="d-flex align-items-center gap-2">
                                                <div
                                                    className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                                                    style={{ width: '34px', height: '34px', background: roleBadge.bg, fontSize: '0.8rem' }}
                                                >
                                                    {user.userName?.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>{user.userName}</span>
                                            </div>
                                        </td>

                                        {/* Email */}
                                        <td className="px-4 py-3 text-muted" style={{ fontSize: '0.88rem' }}>
                                            {user.email}
                                        </td>

                                        {/* Rol actual */}
                                        <td className="px-4 py-3">
                                            <span
                                                className="px-3 py-1 rounded-2 text-white fw-bold"
                                                style={{ fontSize: '0.72rem', letterSpacing: '0.5px', background: roleBadge.bg }}
                                            >
                                                {roleBadge.label}
                                            </span>
                                        </td>

                                        {/* Acciones */}
                                        <td className="px-4 py-3">
                                            <div className="d-flex align-items-center justify-content-end gap-2">
                                                <select
                                                    className="form-select form-select-sm rounded-3 border"
                                                    style={{ width: '110px', fontSize: '0.82rem', background: '#fafafa' }}
                                                    value={currentPending ?? user.role}
                                                    onChange={e => handleRoleChange(user.id, e.target.value)}
                                                >
                                                    <option value="USER">USER</option>
                                                    <option value="GESTOR">GESTOR</option>
                                                    <option value="ADMIN">ADMIN</option>
                                                </select>

                                                {isDirty && (
                                                    <button
                                                        onClick={() => handleSaveRole(user.id)}
                                                        className="btn btn-sm btn-primary rounded-3 fw-semibold px-3"
                                                        style={{ fontSize: '0.8rem' }}
                                                    >
                                                        <i className="bi bi-check2"></i>
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => handleDeleteUser(user.id, user.userName)}
                                                    className="btn btn-sm btn-outline-danger rounded-3"
                                                    style={{ fontSize: '0.8rem', width: '34px', height: '34px', padding: 0 }}
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};