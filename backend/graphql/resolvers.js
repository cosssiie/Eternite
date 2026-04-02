const userService = require('../services/userService');
const publicationService = require('../services/publicationService');
const categoryRepository = require('../repositories/categoryRepository');
const categoryService = require('../services/categoryService');
const { GraphQLError } = require('graphql');
const CategoryTemplate = require('../models/CategoryTemplate');
const Publication = require('../models/Publication');

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

        publications: async (_, { status, categoryId, page = 1, limit = 12, search }) => {
            const filters = {};
            if (status) filters.status = status;
            if (categoryId && categoryId !== 'undefined' && categoryId !== 'all') {
                filters.category = categoryId;
            }
            if (search) filters.search = search;
            filters.page = page;
            filters.limit = limit;
            const result = await publicationService.getAll(filters);
            return result.publications || result;
        },

        publication: async (_, { id }) => {
            return publicationService.getById(id);
        },

        myPublications: async (_, __, { user }) => {
            requireAuth(user);
            return await Publication.find({ author: user.id })
                .populate('author', 'name')
                .populate('category', 'name');
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
            const template = await CategoryTemplate.findOne({ category: categoryId })
                .populate('category');

            if (!template) return null;
            return template;
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

        deletePublication: async (_, { id }, { user }) => {
            requireAuth(user);
            const pub = await Publication.findById(id);
            if (!pub) {
                throw new GraphQLError('Publication not found', {
                    extensions: { code: 'NOT_FOUND' }
                });
            }
            if (pub.author.toString() !== user.id && user.role !== 'admin') {
                throw new GraphQLError('You can only delete your own publications', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            await Publication.findByIdAndDelete(id);
            return id;
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

        rejectPublication: async (_, { id, reason }, { user, io }) => {
            requireAdmin(user);
            const result = await publicationService.reject(id, reason);
            io?.emit('publication:rejected', { id });
            return result;
        },

        createCategory: async (_, { name, parentId }, { user, io }) => {
            requireAdmin(user);
            const result = await categoryService.create({ name, parent: parentId });
            io?.emit('categories:updated');
            return result;
        },

        updateCategory: async (_, { id, name, parentId }, { user, io }) => {
            requireAdmin(user);
            const result = await categoryService.update(id, { name, parent: parentId });
            io?.emit('categories:updated');
            return result;
        },

        deleteCategory: async (_, { id }, { user, io }) => {
            requireAdmin(user);
            await categoryService.remove(id);
            io?.emit('categories:updated');
            return true;
        },

        toggleCategoryActive: async (_, { id }, { user, io }) => {
            requireAdmin(user);
            const result = await categoryService.toggleActive(id);
            io?.emit('categories:updated');
            return result;
        },

        saveCategoryTemplate: async (_, { categoryId, fields }, { user }) => {
            requireAdmin(user);
            return categoryService.saveTemplate(categoryId, fields);
        },

        approvePublication: async (_, { id }, { user, io }) => {
            requireAdmin(user);
            const result = await publicationService.approve(id);
            io?.emit('publication:approved', { id });
            return result;
        },

        rejectPublication: async (_, { id, reason }, { user }) => {
            requireAdmin(user);
            return publicationService.reject(id, reason);
        },

        togglePublicationActive: async (_, { id }, { user }) => {
            requireAdmin(user);
            return publicationService.toggleActive(id);
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

        author: async (parent) => {
            if (parent.author && parent.author.name) return parent.author;
            return userService.getById(parent.author);
        },

        category: async (parent) => {
            if (parent.category && parent.category.name) return parent.category;
            return categoryService.getById(parent.category);
        }
    },
};