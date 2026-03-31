import { API_MODE } from './apiMode';
import { categoryApi } from './categoryApi';
import { categoryGql } from './categoryGql';

const rest = {
    getAll: async () => {
        const { data } = await categoryApi.getAll();
        return data.categories || [];
    },
    getTree: async () => {
        const { data } = await categoryApi.getTree();
        return data.tree || [];
    },
    getById: async (id) => {
        const { data } = await categoryApi.getById(id);
        return data.category;
    },
    getTemplate: async (id) => {
        const { data } = await categoryApi.getTemplate(id);
        return data.template;
    },
    create: async (data) => {
        const res = await categoryApi.create(data);
        return res.data.category;
    },
    update: async (id, data) => {
        const res = await categoryApi.update(id, data);
        return res.data.category;
    },
    remove: (id) => categoryApi.remove(id),
    toggleActive: (id) => categoryApi.toggleActive(id),
    saveTemplate: (id, fields) => categoryApi.saveTemplate(id, fields),
};

const graphql = {
    getAll: async () => {
        const data = await categoryGql.getAll();
        return data.categories || [];
    },
    getTree: async () => {
        const data = await categoryGql.getTree();
        return data.categoryTree || [];
    },
    getById: async (id) => {
        const data = await categoryGql.getById(id);
        return data.category;
    },
    getTemplate: async (id) => {
        const data = await categoryGql.getTemplate(id);
        return data.categoryTemplate;
    },
    create: async ({ name, parent }) => {
        const data = await categoryGql.create(name, parent);
        return data.createCategory;
    },
    update: async (id, { name, parent }) => {
        const data = await categoryGql.update(id, name, parent);
        return data.updateCategory;
    },
    remove: async (id) => {
        await categoryGql.remove(id);
    },
    toggleActive: async (id) => {
        const data = await categoryGql.toggleActive(id);
        return data.toggleCategoryActive;
    },
    saveTemplate: async (id, fields) => {
        const data = await categoryGql.saveTemplate(id, fields);
        return data.saveCategoryTemplate;
    },
};

export const categories = API_MODE === 'graphql' ? graphql : rest;