import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const ProfileView = ({ userData, onProfileUpdated }) => {
    const [email, setEmail] = useState(userData.email || '');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        if (userData?.email) setEmail(userData.email);
    }, [userData]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!email.trim()) {
            setError('El campo de correo electrónico no puede estar vacío.');
            return;
        }

        const updateData = { email: email.trim() };

        if (password.trim() !== '') {
            if (password.length < 4) {
                setError('La contraseña debe tener al menos 4 caracteres.');
                return;
            }
            updateData.password = password;
        }

        try {
            setLoading(true);
            await authService.updateProfile(updateData);
            setSuccess('¡Perfil actualizado correctamente!');

            // Si se cambió la contraseña, regenerar el token Basic Auth con las nuevas credenciales
            if (updateData.password) {
                const newToken = 'Basic ' + btoa(userData.username + ':' + updateData.password);
                localStorage.setItem('token', newToken);
            }

            setPassword('');
            if (typeof onProfileUpdated === 'function') onProfileUpdated();
        } catch (err) {
            console.error('Error actualizando perfil:', err);
            setError(err.response?.data?.message || 'No se pudo actualizar el perfil.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="d-flex flex-column mb-4 px-2">
                        <h3 className="fw-bold text-dark m-0" style={{ letterSpacing: '-0.5px' }}>Mi Perfil</h3>
                        <small className="text-muted fw-medium">Gestiona los datos de acceso de tu cuenta</small>
                    </div>

                    {error && (
                        <div className="alert alert-danger border-0 rounded-4 shadow-sm d-flex align-items-center p-3 mb-4">
                            <i className="bi bi-exclamation-octagon-fill fs-5 me-2"></i>
                            <div className="fw-semibold small">{error}</div>
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success border-0 rounded-4 shadow-sm d-flex align-items-center p-3 mb-4">
                            <i className="bi bi-check-circle-fill fs-5 me-2"></i>
                            <div className="fw-semibold small">{success}</div>
                        </div>
                    )}

                    <div className="card border-0 shadow-sm rounded-4 bg-white p-4">
                        <form onSubmit={handleUpdate} className="d-flex flex-column gap-4">

                            {/* Usuario — solo lectura */}
                            <div>
                                <label className="form-label text-secondary small fw-bold text-uppercase mb-2" style={{ fontSize: '0.75rem' }}>
                                    Nombre de Usuario
                                </label>
                                <div className="position-relative">
                                    <i className="bi bi-person position-absolute text-muted" style={{ left: '16px', top: '12px' }}></i>
                                    <input
                                        type="text"
                                        className="form-control bg-light text-muted ps-5 rounded-3 border-0 fw-semibold"
                                        value={userData.username || ''}
                                        disabled readOnly
                                    />
                                </div>
                                <small className="text-muted d-block mt-1 px-1" style={{ fontSize: '0.75rem' }}>
                                    El nombre de cuenta no es modificable.
                                </small>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="form-label text-secondary small fw-bold text-uppercase mb-2" style={{ fontSize: '0.75rem' }}>
                                    Correo Electrónico
                                </label>
                                <div className="position-relative">
                                    <i className="bi bi-envelope position-absolute text-muted" style={{ left: '16px', top: '12px' }}></i>
                                    <input
                                        type="email"
                                        className="form-control bg-light ps-5 rounded-3 border-0 text-dark fw-medium"
                                        placeholder="tu@ejemplo.com"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Contraseña */}
                            <div>
                                <label className="form-label text-secondary small fw-bold text-uppercase mb-2" style={{ fontSize: '0.75rem' }}>
                                    Nueva Contraseña
                                </label>
                                <div className="position-relative">
                                    <i className="bi bi-lock position-absolute text-muted" style={{ left: '16px', top: '12px' }}></i>
                                    <input
                                        type="password"
                                        className="form-control bg-light ps-5 rounded-3 border-0 text-dark"
                                        placeholder="Dejar en blanco para no cambiarla"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Rol — solo lectura */}
                            <div>
                                <label className="form-label text-secondary small fw-bold text-uppercase mb-2" style={{ fontSize: '0.75rem' }}>
                                    Rol del Sistema
                                </label>
                                <div className="position-relative">
                                    <i className="bi bi-shield-lock position-absolute text-muted" style={{ left: '16px', top: '12px' }}></i>
                                    <input
                                        type="text"
                                        className="form-control bg-light text-muted ps-5 rounded-3 border-0 fw-bold"
                                        value={userData.role || ''}
                                        disabled readOnly
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary py-2 fw-bold rounded-3 shadow-sm mt-2 d-flex align-items-center justify-content-center gap-2"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" role="status"></span>
                                        Guardando cambios...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-save"></i>
                                        Guardar Cambios
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};