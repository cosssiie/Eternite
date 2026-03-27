import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api/categories',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const categoryApi = {
    // public

    getTree: () => api.get('/tree'),
    getAll: () => api.get('/'),
    getById: (id) => api.get(`/${id}`),
    getTemplate: (id) => api.get(`/${id}/template`),

    // admin

    create: (data) => api.post('/', data),
    update: (id, data) => api.put(`/${id}`, data),
    remove: (id) => api.delete(`/${id}`),
    toggleActive: (id) => api.patch(`/${id}/toggle`),
    saveTemplate: (id, fields) => api.post(`/${id}/template`, { fields })
};