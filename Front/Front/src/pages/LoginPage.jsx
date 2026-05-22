import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { AuthContext } from '../context/AuthContext';

export const LoginPage = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const resetForm = () => {
        setUsername('');
        setPassword('');
        setEmail('');
        setError(null);
        setSuccess(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!username || !password || (isRegister && !email)) {
            setError('Por favor, completa todos los campos requeridos.');
            return;
        }

        try {
            setLoading(true);
            if (isRegister) {
                // Enviamos "userName" (con N mayúscula) y "rol" para tu backend
                const userData = {
                    userName: username,
                    password: password,
                    email: email,
                    rol: 'USER'
                };

                await authService.register(userData);
                setSuccess('¡Cuenta creada con éxito! Ya puedes iniciar sesión.');

                setTimeout(() => {
                    setIsRegister(false);
                    setError(null);
                    setSuccess(null);
                    setPassword('');
                }, 2000);
            } else {
                // 1. Guardamos el token antes de cualquier otra petición
                const tokenBasic = 'Basic ' + btoa(username + ':' + password);
                localStorage.setItem('token', tokenBasic);

                // 2. Llamamos al login para validar credenciales
                const data = await authService.login(username, password);

                // 3. Obtenemos los datos completos del usuario (incluye id)
                const meData = await authService.getMe();
                localStorage.setItem('user_id', meData.id);

                // 4. Actualizamos el contexto global
                const userRole = (data.role || meData.role || 'USER').toUpperCase();
                login({
                    id: meData.id,
                    username: meData.userName || username,
                    email: meData.email || '',
                    role: userRole,
                    rol: userRole
                });

                navigate('/dashboard');
            }
        } catch (err) {
            console.error("Error en la autenticación:", err);
            const errorMsg = err.response?.data?.message ||
                (isRegister ? 'Error en el servidor al registrar. Revisa si el usuario ya existe.' : 'Usuario o contraseña incorrectos.');
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container min-vh-100 d-flex align-items-center justify-content-center bg-light text-dark">
            <div className="row justify-content-center w-100">
                <div className="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">

                    {/* Tarjeta de Login / Registro */}
                    <div className="bg-white p-4 p-sm-5 rounded-4 shadow-sm border border-light-subtle">

                        {/* Cabecera */}
                        <div className="text-center mb-4">
                            <div className="bg-primary-subtle text-primary rounded-circle d-inline-flex align-items-center justify-content-center shadow-sm mb-3" style={{ width: '60px', height: '60px' }}>
                                <i className={`bi ${isRegister ? 'bi-person-plus-fill' : 'bi-check2-circle'} fs-2`}></i>
                            </div>
                            <h3 className="fw-bold m-0 text-dark">
                                {isRegister ? 'Crear Cuenta' : 'TaskFlow'}
                            </h3>
                            <p className="text-muted small mt-1 mb-0">
                                {isRegister ? 'Regístrate para gestionar tus tareas' : 'Ingresa tus credenciales para acceder'}
                            </p>
                        </div>

                        {/* Alertas */}
                        {error && (
                            <div className="alert alert-danger border-0 rounded-3 small py-2 px-3 mb-4 d-flex align-items-center gap-2" role="alert">
                                <i className="bi bi-exclamation-triangle-fill flex-shrink-0"></i>
                                <span>{error}</span>
                            </div>
                        )}
                        {success && (
                            <div className="alert alert-success border-0 rounded-3 small py-2 px-3 mb-4 d-flex align-items-center gap-2" role="alert">
                                <i className="bi bi-check-circle-fill flex-shrink-0"></i>
                                <span>{success}</span>
                            </div>
                        )}

                        {/* Formulario */}
                        <form onSubmit={handleSubmit}>

                            {/* Input: Usuario */}
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-secondary mb-2">Nombre de usuario</label>
                                <div className="position-relative d-flex align-items-center">
                                    <i className="bi bi-person position-absolute text-muted fs-5" style={{ left: '16px' }}></i>
                                    <input
                                        type="text"
                                        className="form-control neumorphic-input w-100 ps-5 py-2.5 rounded-3"
                                        placeholder="ejemplo123"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        autoComplete="username"
                                    />
                                </div>
                            </div>

                            {/* Input condicional: Email (Solo Registro) */}
                            {isRegister && (
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-secondary mb-2">Correo electrónico</label>
                                    <div className="position-relative d-flex align-items-center">
                                        <i className="bi bi-envelope position-absolute text-muted fs-5" style={{ left: '16px' }}></i>
                                        <input
                                            type="email"
                                            className="form-control neumorphic-input w-100 ps-5 py-2.5 rounded-3"
                                            placeholder="correo@ejemplo.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            autoComplete="email"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Input: Contraseña */}
                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <label className="form-label small fw-bold text-secondary m-0">Contraseña</label>
                                    {!isRegister && (
                                        <a href="#" className="text-primary small text-decoration-none fw-semibold" style={{ fontSize: '0.8rem' }}>
                                            ¿Olvidaste tu contraseña?
                                        </a>
                                    )}
                                </div>
                                <div className="position-relative d-flex align-items-center">
                                    <i className="bi bi-lock position-absolute text-muted fs-5" style={{ left: '16px' }}></i>
                                    <input
                                        type="password"
                                        className="form-control neumorphic-input w-100 ps-5 py-2.5 rounded-3"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoComplete={isRegister ? "new-password" : "current-password"}
                                    />
                                </div>
                            </div>

                            {/* Botón de Envío */}
                            <button
                                type="submit"
                                className="btn btn-primary w-100 py-2.5 fw-bold rounded-3 shadow-sm text-white"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span>Procesando...</span>
                                ) : (
                                    <span>{isRegister ? 'Registrarse' : 'Iniciar Sesión'}</span>
                                )}
                            </button>
                        </form>

                        {/* Toggle inferior */}
                        <div className="text-center mt-4 pt-3 border-top border-light-subtle">
                            <p className="text-muted small m-0">
                                {isRegister ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta aún?'}
                                <button
                                    type="button"
                                    className="btn btn-link text-primary fw-bold text-decoration-none p-0 ms-2 small"
                                    onClick={() => { setIsRegister(!isRegister); resetForm(); }}
                                    style={{ fontSize: '0.85rem' }}
                                >
                                    {isRegister ? 'Inicia Sesión' : 'Regístrate aquí'}
                                </button>
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};