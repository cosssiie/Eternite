import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');

            if (token && savedUser) {
                setUser(JSON.parse(savedUser));
                try {
                    const { data } = await api.get('/users/me');
                    const userData = data.user || data;
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                } catch (err) {
                    logout();
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
        window.location.href = '/';
    };

    const refreshUser = async () => {
        try {
            const { data } = await api.get('/users/me');
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
        } catch (err) {
            console.error('Error refreshing user:', err);
        }
    };

    const updateFavouritesLocally = (publicationId, isAdding) => {
        setUser(prevUser => {
            if (!prevUser) return null;

            const currentFavs = prevUser.favourites || [];
            let newFavs;

            if (isAdding) {
                newFavs = currentFavs.includes(publicationId)
                    ? currentFavs
                    : [...currentFavs, publicationId];
            } else {
                newFavs = currentFavs.filter(id => String(id) !== String(publicationId));
            }

            const updatedUser = { ...prevUser, favourites: newFavs };

            localStorage.setItem('user', JSON.stringify(updatedUser));

            return updatedUser;
        });
    };

    return (
        <AuthContext.Provider value={{
            user, login, logout, isAuth: !!user, loading, refreshUser,
            updateFavouritesLocally // передаем функцию в контекст
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);