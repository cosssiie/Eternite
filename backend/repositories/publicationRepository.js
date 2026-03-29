const Publication = require('../models/Publication');

const findAll = (filter = {}) =>
    Publication.find(filter)
        .populate('author', 'name email')
        .populate('category', 'name');

const findById = (id) =>
    Publication.findById(id)
        .populate('author', 'name email')
        .populate('category', 'name');

const findByAuthor = (authorId) =>
    Publication.find({ author: authorId })
        .populate('category', 'name');

// пошук + фільтрація
const findWithFilters = async ({ status, category, search, page = 1, limit = 5 }) => {
    const query = {};
    if (status) query.status = status;
    if (category && category !== 'all') query.category = category;
    if (search) query.title = { $regex: search, $options: 'i' };

    const skip = (page - 1) * limit;

    const [publications, total] = await Promise.all([
        Publication.find(query)
            .populate('author', 'name email')
            .populate('category', 'name')
            .sort({ createdAt: -1, _id: -1 })
            .skip(skip)
            .limit(limit),
        Publication.countDocuments(query)
    ]);

    return { publications, total };
};

const create = (data) => Publication.create(data);

const updateById = (id, data) =>
    Publication.findByIdAndUpdate(id, data, { new: true });

const deleteById = (id) => Publication.findByIdAndDelete(id);

module.exports = {
    findAll,
    findById,
    findByAuthor,
    findWithFilters,
    create,
    updateById,
    deleteById,
};