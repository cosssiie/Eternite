const userService = require('../services/userService');
const publicationService = require('../services/publicationService');
const categoryRepository = require('../repositories/categoryRepository');
const categoryService = require('../services/categoryService');
const { GraphQLError } = require('graphql');

const requireAuth = (user) => {
    if (!user) throw new GraphQLError('Unauthorized', {
        extensions: { code: 'UNAUTHENTICATED' }
    });
};

const requireAdmin = (user) => {
    requireAuth(user);
    if (user.role !== 'admin') throw new GraphQLError('Forbidden', {
        extensions: { code: 'FORBIDDEN' }
    });
};

module.exports = {
    Query: {
        me: async (_, __, { user }) => {
            requireAuth(user);
            return userService.getById(user.id);
        },

        publications: async (_, { status, categoryId }) => {
            const filters = {};
            if (status) filters.status = status;
            if (categoryId && categoryId !== 'undefined' && categoryId !== 'all') {
                filters.category = categoryId;
            }
            const result = await publicationService.getAll(filters);
            return result.publications || result;
        },

        publication: async (_, { id }) => {
            return publicationService.getById(id);
        },

        myPublications: async (_, __, { user }) => {
            requireAuth(user);
            return publicationService.getByAuthor(user.id);
        },

        favourites: async (_, __, { user }) => {
            requireAuth(user);
            return userService.getFavourites(user.id);
        },

        categories: async () => {
            return categoryService.getAll();
        },

        categoryTree: async () => {
            return categoryService.getTree();
        },

        category: async (_, { id }) => {
            return categoryService.getById(id);
        },

        categoryTemplate: async (_, { categoryId }) => {
            return categoryService.getTemplate(categoryId);
        },

        users: async (_, __, { user }) => {
            requireAdmin(user);
            return userService.getAll();
        },
    },

    Mutation: {
        register: async (_, args) => {
            return userService.register(args);
        },

        login: async (_, args) => {
            return userService.login(args);
        },

        updateProfile: async (_, args, { user }) => {
            requireAuth(user);
            return userService.update(user.id, args);
        },

        deleteMe: async (_, __, { user }) => {
            requireAuth(user);
            await userService.remove(user.id);
            return true;
        },

        toggleFavourite: async (_, { publicationId }, { user }) => {
            requireAuth(user);
            await userService.toggleFavourite(user.id, publicationId);
            return true;
        },

        deleteUser: async (_, { id }, { user }) => {
            requireAdmin(user);
            await userService.remove(id);
            return true;
        },

        toggleUserStatus: async (_, { id }, { user }) => {
            requireAdmin(user);
            return userService.toggleActive(id);
        },

        createCategory: async (_, { name, parentId }, { user }) => {
            requireAdmin(user);
            return categoryService.create({ name, parent: parentId });
        },

        updateCategory: async (_, { id, name, parentId }, { user }) => {
            requireAdmin(user);
            return categoryService.update(id, { name, parent: parentId });
        },

        deleteCategory: async (_, { id }, { user }) => {
            requireAdmin(user);
            await categoryService.remove(id);
            return true;
        },

        toggleCategoryActive: async (_, { id }, { user }) => {
            requireAdmin(user);
            return categoryService.toggleActive(id);
        },

        saveCategoryTemplate: async (_, { categoryId, fields }, { user }) => {
            requireAdmin(user);
            return categoryService.saveTemplate(categoryId, fields);
        },
    },
    Category: {
        id: (parent) => parent._id?.toString() || parent.id,

        parent: async (parent) => {
            if (!parent.parent) return null;
            const parentId = parent.parent._id || parent.parent;
            return categoryService.getById(parentId.toString());
        },

        children: async (parent) => {
            if (parent.children && parent.children.length > 0) {
                return parent.children;
            }
            return categoryRepository.findChildren(parent._id);
        },
    },

    User: {
        id: (parent) => parent._id?.toString() || parent.id,
    },

    Publication: {
        id: (parent) => parent._id?.toString() || parent.id,
    },
};