const categoryService = require('../services/categoryService');

// дерево категорії + підкатегорій
const getTree = async (req, res, next) => {
    try {
        const tree = await categoryService.getTree();
        res.json({ success: true, tree });
    } catch (err) {
        next(err);
    }
};

// всі категорії
const getAll = async (req, res, next) => {
    try {
        const categories = await categoryService.getAll();
        res.json({ success: true, categories });
    } catch (err) {
        next(err);
    }
};

// одна категорія
const getOne = async (req, res, next) => {
    try {
        const category = await categoryService.getById(req.params.id);
        res.json({ success: true, category });
    } catch (err) {
        next(err);
    }
};

// створити категорію
const create = async (req, res, next) => {
    try {
        const category = await categoryService.create(req.body);
        res.status(201).json({ success: true, category });
    } catch (err) {
        next(err);
    }
};

// оновити категорію
const update = async (req, res, next) => {
    try {
        const category = await categoryService.update(req.params.id, req.body);
        res.json({ success: true, category });
    } catch (err) {
        next(err);
    }
};

// видалити категорію
const remove = async (req, res, next) => {
    try {
        await categoryService.remove(req.params.id);
        res.json({ success: true, message: 'Категорію видалено' });
    } catch (err) {
        next(err);
    }
};

// активувати / деактивувати категорію
const toggleActive = async (req, res, next) => {
    try {
        const category = await categoryService.toggleActive(req.params.id);
        res.json({ success: true, category });
    } catch (err) {
        next(err);
    }
};

// шаблон полів для підкатегорії
const getTemplate = async (req, res, next) => {
    try {
        const template = await categoryService.getTemplate(req.params.id);
        res.json({ success: true, template });
    } catch (err) {
        next(err);
    }
};

// створити / оновити шаблон
const saveTemplate = async (req, res, next) => {
    try {
        const template = await categoryService.saveTemplate(req.params.id, req.body.fields);
        res.json({ success: true, template });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getTree,
    getAll,
    getOne,
    create,
    update,
    remove,
    toggleActive,
    getTemplate,
    saveTemplate,
};