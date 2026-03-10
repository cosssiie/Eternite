const publicationService = require('../services/publicationService');

// всі публікації
const getAll = async (req, res, next) => {
    try {
        // req.query: ?status=approved&category=xxx&search=капелюх
        const publications = await publicationService.getAll(req.query);
        res.json({ success: true, publications });
    } catch (err) {
        next(err);
    }
};

// одна публікація 
const getOne = async (req, res, next) => {
    try {
        const publication = await publicationService.getById(req.params.id);
        res.json({ success: true, publication });
    } catch (err) {
        next(err);
    }
};

// створити публікацію
const create = async (req, res, next) => {
    try {
        const image = req.file ? req.file.path : null;
        const publication = await publicationService.create({
            ...req.body,
            image,
            author: req.user.id,
        });
        res.status(201).json({ success: true, publication });
    } catch (err) {
        next(err);
    }
};

// оновити публікацію
const update = async (req, res, next) => {
    try {
        const image = req.file ? req.file.path : undefined;
        const publication = await publicationService.update(req.params.id, {
            ...req.body,
            ...(image && { image }),
        });
        res.json({ success: true, publication });
    } catch (err) {
        next(err);
    }
};

// видалити публікацію
const remove = async (req, res, next) => {
    try {
        await publicationService.remove(req.params.id);
        res.json({ success: true, message: 'Публікацію видалено' });
    } catch (err) {
        next(err);
    }
};

// апрув публікацію (адмін)
const approve = async (req, res, next) => {
    try {
        const publication = await publicationService.approve(req.params.id);
        res.json({ success: true, publication });
    } catch (err) {
        next(err);
    }
};

// реджект публікацію (адмін)
const reject = async (req, res, next) => {
    try {
        const publication = await publicationService.reject(
            req.params.id,
            req.body.comment
        );
        res.json({ success: true, publication });
    } catch (err) {
        next(err);
    }
};

// активувати / деактивувати (адмін)
const toggleActive = async (req, res, next) => {
    try {
        const publication = await publicationService.toggleActive(req.params.id);
        res.json({ success: true, publication });
    } catch (err) {
        next(err);
    }
};

// мої публікації (користувач)
const getMy = async (req, res, next) => {
    try {
        const publications = await publicationService.getByAuthor(req.user.id);
        res.json({ success: true, publications });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAll,
    getOne,
    create,
    update,
    remove,
    approve,
    reject,
    toggleActive,
    getMy,
};