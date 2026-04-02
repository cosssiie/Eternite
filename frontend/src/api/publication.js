import { API_MODE } from './apiMode';
import { publicationApi } from './publicationApi';
import { publicationGql } from './publicationGql';

const rest = {
    getAll: async (params) => {
        const { data } = await publicationApi.getAll(params);
        return data.publications || [];
    },
    getById: async (id) => {
        const { data } = await publicationApi.getById(id);
        return data.publication;
    },
    getMyPublications: async () => {
        const { data } = await publicationApi.getMyPublications();
        return data.publications || [];
    },
    create: (formData) => publicationApi.create(formData),
    update: (id, formData) => publicationApi.update(id, formData),
    remove: (id) => publicationApi.remove(id),
    approve: (id) => publicationApi.approve(id),
    reject: (id, reason) => publicationApi.reject(id, reason),
    toggleActive: (id) => publicationApi.toggleActive(id),
};

const graphql = {
    getAll: async (params) => {
        const data = await publicationGql.getAll(
            params?.status,
            params?.categoryId,
            params?.page || 1,
            params?.limit || 12
        );
        return data.publications || [];
    },
    getById: async (id) => {
        const data = await publicationGql.getById(id);
        return data.publication;
    },
    getMyPublications: async () => {
        const data = await publicationGql.myPublications();
        return data.myPublications || [];
    },
    create: (formData) => publicationApi.create(formData),
    update: (id, formData) => publicationApi.update(id, formData),
    remove: async (id) => {
        await publicationGql.remove(id);
    },
    approve: async (id) => {
        const data = await publicationGql.approve(id);
        return data.approvePublication;
    },
    reject: async (id, reason) => {
        const data = await publicationGql.reject(id, reason);
        return data.rejectPublication;
    },
    toggleActive: async (id) => {
        const data = await publicationGql.toggleActive(id);
        return data.togglePublicationActive;
    },
};

export const publications = API_MODE === 'graphql' ? graphql : rest;