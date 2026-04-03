const Publication = require('../models/Publication');
const Category = require('../models/Category');

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
        .populate('category', 'name')
        .populate('author', 'name');

const findManyByAuthor = (authorId) =>
    Publication.find({ author: authorId }, '_id')

// пошук + фільтрація
const findWithFilters = async ({ status, category, search, page = 1, limit = 12, attrs }) => {
    const query = {};
    if (status) query.status = status;

    if (category && category !== 'all') {
        const children = await Category.find({ parent: category });
        if (children.length > 0) {
            const childIds = children.map(c => c._id);
            query.category = { $in: childIds };
        } else {
            query.category = category;
        }
    }
    if (search) query.title = { $regex: search, $options: 'i' };

    if (attrs) {
        const parsed = typeof attrs === 'string' ? JSON.parse(attrs) : attrs;
        const attrFilters = [];

        if (parsed.yearFrom) {
            attrFilters.push({ attributes: { $elemMatch: { key: 'year', value: { $gte: String(parsed.yearFrom) } } } });
        }
        if (parsed.yearTo) {
            attrFilters.push({ attributes: { $elemMatch: { key: 'year', value: { $lte: String(parsed.yearTo) } } } });
        }

        Object.entries(parsed).forEach(([key, value]) => {
            if (key !== 'yearFrom' && key !== 'yearTo' && value) {
                attrFilters.push({
                    attributes: { $elemMatch: { key, value } }
                });
            }
        });

        if (attrFilters.length > 0) query.$and = attrFilters;
    }

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

const deleteManyByAuthor = (authorId) => Publication.deleteMany({ author: authorId });


module.exports = {
    findAll,
    findById,
    findByAuthor,
    findManyByAuthor,
    findWithFilters,
    create,
    updateById,
    deleteById,
    deleteManyByAuthor,
};