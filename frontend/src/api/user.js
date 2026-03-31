import { API_MODE } from './apiMode';
import { userApi } from './userApi';
import { userGql } from './userGql';

const rest = {
    me: async () => {
        const { data } = await userApi.getMe();
        return data.user;
    },
    login: async (email, password) => {
        const { data } = await userApi.login({ email, password });
        return { token: data.token, user: data.user };
    },
    register: async (name, email, password) => {
        const { data } = await userApi.register({ name, email, password });
        return data.user;
    },
    updateProfile: async (formData) => {
        const { data } = await userApi.updateProfile(formData);
        return data.user;
    },
    deleteMe: () => userApi.deleteAccount(),
    toggleFavourite: (id) => userApi.toggleFavourite(id),
    getFavourites: async () => {
        const { data } = await userApi.getFavourites();
        return data.favourites || [];
    },
    getAllUsers: async () => {
        const { data } = await userApi.getAllUsers();
        return data.users || [];
    },
    deleteUser: (id) => userApi.deleteUser(id),
    toggleUserStatus: (id) => userApi.toggleUserStatus(id),
};

const graphql = {
    me: async () => {
        const data = await userGql.me();
        return data.me;
    },
    login: async (email, password) => {
        const data = await userGql.login(email, password);
        return data.login;
    },
    register: async (name, email, password) => {
        const data = await userGql.register(name, email, password);
        return data.register;
    },
    updateProfile: async (formData) => {
        const data = await userGql.updateProfile(formData);
        return data.updateProfile;
    },
    deleteMe: async () => {
        await userGql.deleteMe();
    },
    toggleFavourite: async (id) => {
        await userGql.toggleFavourite(id);
    },
    getFavourites: async () => {
        const data = await userGql.getFavourites();
        return data.favourites || [];
    },
    getAllUsers: async () => {
        const data = await userGql.getAllUsers();
        return data.users || [];
    },
    deleteUser: async (id) => {
        await userGql.deleteUser(id);
    },
    toggleUserStatus: async (id) => {
        const data = await userGql.toggleUserStatus(id);
        return data.toggleUserStatus;
    },
};

export const users = API_MODE === 'graphql' ? graphql : rest;