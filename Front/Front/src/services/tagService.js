import api from './api'; // Tu instancia de Axios que ya funciona con el token

// Exportamos exactamente el objeto que 'TagList.jsx' necesita importar
export const tagService = {
    // 🏷️ Leer etiquetas
    getAllTags: async () => {
        const response = await api.get('/tags');
        return response.data;
    },

    // ➕ Crear etiquetas
    createTag: async (tagData) => {
        const response = await api.post('/tags', tagData);
        return response.data;
    },

    // ❌ Borrar etiquetas
    deleteTag: async (id) => {
        const response = await api.delete(`/tags/${id}`);
        return response.data;
    }
};

// Por si acaso algún otro componente viejo lo importa de forma por defecto
export default tagService;