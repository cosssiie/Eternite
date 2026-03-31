const userService = require('../services/userService');
const publicationService = require('../services/publicationService');
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
            return publicationService.getAll({ status, categoryId });
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
    },
};