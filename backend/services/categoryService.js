const categoryRepository = require('../repositories/categoryRepository');
const Publication = require('../models/Publication');

const getTree = async () => {
    const roots = await categoryRepository.findRoots();

    const tree = await Promise.all(roots.map(async (root) => {
        const children = await categoryRepository.findChildren(root._id);
        const childrenWithParent = children.map(child => ({
            ...child.toObject(),
            parent: { _id: root._id, id: root._id.toString(), name: root.name }
        }));
        return { ...root.toObject(), children: childrenWithParent };
    }));

    return tree;
};

const getAll = () => categoryRepository.findAll();

const getById = async (id) => {
    const category = await categoryRepository.findById(id);
    if (!category) throw new Error('Категорію не знайдено');
    return category;
};

const create = (data) => categoryRepository.create(data);

const update = async (id, data) => {
    const category = await categoryRepository.updateById(id, data);
    if (!category) throw new Error('Категорію не знайдено');
    return category;
};

const remove = async (id) => {
    const pubCount = await Publication.countDocuments({ category: id });
    if (pubCount > 0) {
        throw new Error(`Cannot delete: category has ${pubCount} publication(s)`);
    }
    const children = await categoryRepository.findChildren(id);
    for (const child of children) {
        const childPubCount = await Publication.countDocuments({ category: child._id });
        if (childPubCount > 0) {
            throw new Error(`Cannot delete: subcategory "${child.name}" has ${childPubCount} publication(s)`);
        }
    }

    const category = await categoryRepository.deleteById(id);
    if (!category) throw new Error('Категорію не знайдено');
};

const toggleActive = async (id) => {
    const category = await categoryRepository.findById(id);
    if (!category) throw new Error('Категорію не знайдено');
    return categoryRepository.updateById(id, { isActive: !category.isActive });
};

const getTemplate = async (categoryId) => {
    const template = await categoryRepository.findTemplate(categoryId);
    if (!template) throw new Error('Шаблон не знайдено');
    return template;
};

const saveTemplate = (categoryId, fields) =>
    categoryRepository.saveTemplate(categoryId, fields);

module.exports = {
    getTree,
    getAll,
    getById,
    create,
    update,
    remove,
    toggleActive,
    getTemplate,
    saveTemplate,
};