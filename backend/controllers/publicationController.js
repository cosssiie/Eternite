const publicationService = require('../services/publicationService');

// всі публікації
const getAll = async (req, res, next) => {
    try {
        const { page, limit, status, search, categoryId, category, attrs } = req.query;

        const result = await publicationService.getAll({
            status,
            search,
            category: categoryId || category,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 12,
            attrs,
        });

        res.json({
            success: true,
            publications: result.publications,
            total: result.total
        });
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
        let images = [];
        if (req.files && req.files.length > 0) {
            images = req.files.map(file => file.path);
        }
        else if (req.file) {
            images = [req.file.path];
        }

        const publication = await publicationService.create({
            ...req.body,
            images,
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
        const existing = await publicationService.getById(req.params.id);
        const isOwner = String(existing.author._id || existing.author) === String(req.user.id);
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        let updateData = { ...req.body };

        let existingImages = [];
        if (req.body.existingImages) {
            existingImages = JSON.parse(req.body.existingImages);
        }

        let newImages = [];
        if (req.files?.length > 0) {
            newImages = req.files.map(file => file.path);
        } else if (req.file) {
            newImages = [req.file.path];
        }

        updateData.images = [...existingImages, ...newImages];

        const updated = await publicationService.update(req.params.id, updateData);
        res.json({ success: true, publication: updated });
    } catch (err) {
        next(err);
    }
};

// видалити публікацію
const remove = async (req, res, next) => {
    try {
        const publication = await publicationService.getById(req.params.id);
        const isOwner = String(publication.author._id || publication.author) === String(req.user.id);
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        await publicationService.remove(req.params.id);
        res.json({ success: true, message: 'Publication was deleted' });
    } catch (err) {
        next(err);
    }
};

// апрув публікацію (адмін)
const approve = async (req, res, next) => {
    try {
        const publication = await publicationService.approve(req.params.id);

        const io = req.app.get('io');
        io.emit('publication:approved', { id: req.params.id });

        res.json({ success: true, publication });
    } catch (err) {
        next(err);
    }
};

// реджект публікацію (адмін)
const reject = async (req, res, next) => {
    try {
        const publication = await publicationService.reject(
            req.params.id, req.body.comment
        );

        const io = req.app.get('io');
        io.emit('publication:rejected', { id: req.params.id });

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