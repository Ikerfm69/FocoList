import axios from 'axios';

// En producción usamos la URL de Railway, en desarrollo el proxy /api
const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Inserta el token en cada petición
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = token.startsWith('Basic ') || token.startsWith('Bearer ')
                ? token
                : `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Si el backend devuelve 401, limpiar sesión y redirigir al login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');

            localStorage.removeItem('user_data');
            localStorage.removeItem('user_credentials');
            localStorage.removeItem('user_id');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
