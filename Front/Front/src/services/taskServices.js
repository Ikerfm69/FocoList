import api from './api';

export const taskService = {
    // 📋 Leer todas las tareas (Ya funcionaba)
    getAllTasks: async () => {
        const response = await api.get('/tasks');
        return response.data;
    },

    // 📊 Leer las estadísticas del Dashboard (Ya funcionaba)
    getTaskStats: async () => {
        const response = await api.get('/tasks/stats');
        return response.data;
    },

    // ➕ CREAR TAREA (Lo que te pide el error de CreateTaskForm.jsx)
    createTask: async (taskData) => {
        const response = await api.post('/tasks', taskData);
        return response.data;
    },

    // ✏️ MODIFICAR TAREA (Para cuando vayas a editarla)
    updateTask: async (id, taskData) => {
        const response = await api.put(`/tasks/${id}`, taskData);
        return response.data;
    },

    // ❌ ELIMINAR TAREA
    deleteTask: async (id) => {
        const response = await api.delete(`/tasks/${id}`);
        return response.data;
    }
};