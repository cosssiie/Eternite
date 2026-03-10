const Category = require('../models/Category');
const CategoryTemplate = require('../models/CategoryTemplate');

// ─── Category ────────────────────────────────────────

const findAll = () => Category.find();

const findById = (id) => Category.findById(id);

const findRoots = () => Category.find({ parent: null, isActive: true });

const findChildren = (parentId) => Category.find({ parent: parentId, isActive: true });

const create = (data) => Category.create(data);

const updateById = (id, data) =>
    Category.findByIdAndUpdate(id, data, { new: true });

const deleteById = (id) => Category.findByIdAndDelete(id);

// ─── CategoryTemplate ────────────────────────────────

const findTemplate = (categoryId) =>
    CategoryTemplate.findOne({ category: categoryId });

const saveTemplate = (categoryId, fields) =>
    CategoryTemplate.findOneAndUpdate(
        { category: categoryId },
        { category: categoryId, fields },
        { new: true, upsert: true }
    );

module.exports = {
    findAll,
    findById,
    findRoots,
    findChildren,
    create,
    updateById,
    deleteById,
    findTemplate,
    saveTemplate,
};