const publicationRepository = require('../repositories/publicationRepository');

const getAll = async ({ status, category, search, page, limit } = {}) => {
    return await publicationRepository.findWithFilters({
        status: status || 'approved',
        category: category && category !== 'undefined' ? category : undefined,
        search,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 5,
    });
};

const getAllForAdmin = (filters = {}) =>
    publicationRepository.findWithFilters(filters);

const getById = async (id) => {
    const publication = await publicationRepository.findById(id);
    if (!publication) throw new Error('Публікацію не знайдено');
    return publication;
};

const getByAuthor = (authorId) =>
    publicationRepository.findByAuthor(authorId);

const create = (data) => {
    if (typeof data.attributes === 'string') {
        data.attributes = JSON.parse(data.attributes);
    }
    return publicationRepository.create(data);
};

const update = async (id, data) => {
    if (typeof data.attributes === 'string') {
        data.attributes = JSON.parse(data.attributes);
    }
    const publication = await publicationRepository.updateById(id, data);
    if (!publication) throw new Error('Публікацію не знайдено');
    return publication;
};

const remove = async (id) => {
    const publication = await publicationRepository.deleteById(id);
    if (!publication) throw new Error('Публікацію не знайдено');
};

const approve = (id) =>
    publicationRepository.updateById(id, {
        status: 'approved',
        moderationComment: null,
    });

const reject = (id, comment) => {
    if (!comment) throw new Error('Вкажіть причину відхилення');
    return publicationRepository.updateById(id, {
        status: 'rejected',
        moderationComment: comment,
    });
};

const toggleActive = async (id) => {
    const publication = await publicationRepository.findById(id);
    if (!publication) throw new Error('Публікацію не знайдено');

    const newStatus = publication.status === 'inactive' ? 'approved' : 'inactive';
    return publicationRepository.updateById(id, { status: newStatus });
};

module.exports = {
    getAll,
    getAllForAdmin,
    getById,
    getByAuthor,
    create,
    update,
    remove,
    approve,
    reject,
    toggleActive,
};