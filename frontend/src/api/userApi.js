import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api/users',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const userApi = {

    // public

    register: (data) => api.post('/register', data),
    login: (data) => api.post('/login', data),
    verifyEmail: (token) => api.get(`/verify/${token}`),
    getMe: () => api.get('/me'),
    updateProfile: (data) => api.put('/me', data),
    toggleFavourite: (publicationId) => api.post(`/favourites/${publicationId}`),
    getFavourites: () => api.get('/favourites'),
    deleteAccount: () => api.delete('/me'),

    // admin
    getAllUsers: () => api.get('/'),
    updateUser: (id, data) => api.put(`/${id}`, data),
    deleteUser: (id) => api.delete(`/${id}`),
    toggleUserStatus: (id) => api.patch(`/${id}/toggle`)
};