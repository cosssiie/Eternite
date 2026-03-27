import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api/publications',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const publicationApi = {

    // public

    getAll: (params) => api.get('/', { params }),
    getById: (id) => api.get(`/${id}`),
    getMyPublications: () => api.get('/my/publications'),
    create: (formData) => api.post('/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id, formData) => api.put(`/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    remove: (id) => api.delete(`/${id}`),

    // admin
    
    approve: (id) => api.patch(`/${id}/approve`),
    reject: (id, reason) => api.patch(`/${id}/reject`, { reason }),
    toggleActive: (id) => api.patch(`/ ${id} / toggle`)
};