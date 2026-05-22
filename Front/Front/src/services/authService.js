import api from './api';

export const authService = {
    login: async (username, password) => {
        const response = await api.post('/auth/login', { userName: username, password });
        return response.data;
    },

    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    getAllUsers: async () => {
        const response = await api.get('/users');
        return response.data;
    },

    updatePassword: async (id, passwordData) => {
        const response = await api.put(`/users/${id}/password`, { password: passwordData });
        return response.data;
    },

    promoteToAdmin: async (id) => {
        const response = await api.patch(`/admin/user/${id}/promote`);
        return response.data;
    },

    promoteToGestor: async (id) => {
        const response = await api.patch(`/admin/user/${id}/promote-gestor`);
        return response.data;
    },

    demoteToUser: async (id) => {
        const response = await api.patch(`/admin/user/${id}/demote-user`);
        return response.data;
    },

    deleteUser: async (id) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    },

    updateProfile: async (profileData) => {
        const response = await api.put('/users/profile', profileData);
        return response.data;
    }
};
