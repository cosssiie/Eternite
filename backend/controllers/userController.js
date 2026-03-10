const userService = require('../services/userService');

const register = async (req, res, next) => {
    try {
        const user = await userService.register(req.body);
        res.status(201).json({ success: true, user });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const data = await userService.login(req.body);
        res.json({ success: true, ...data });
    } catch (err) {
        next(err);
    }
};

const verifyEmail = async (req, res, next) => {
    try {
        await userService.verifyEmail(req.params.token);
        res.json({ success: true, message: 'Email підтверджено' });
    } catch (err) {
        next(err);
    }
};

const getMe = async (req, res, next) => {
    try {
        const user = await userService.getById(req.user.id);
        res.json({ success: true, user });
    } catch (err) {
        next(err);
    }
};

const getAll = async (req, res, next) => {
    try {
        const users = await userService.getAll();
        res.json({ success: true, users });
    } catch (err) {
        next(err);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const user = await userService.update(req.params.id, req.body);
        res.json({ success: true, user });
    } catch (err) {
        next(err);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        await userService.remove(req.params.id);
        res.json({ success: true, message: 'Користувача видалено' });
    } catch (err) {
        next(err);
    }
};

const toggleActive = async (req, res, next) => {
    try {
        const user = await userService.toggleActive(req.params.id);
        res.json({ success: true, user });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    register,
    login,
    verifyEmail,
    getMe,
    getAll,
    updateUser,
    deleteUser,
    toggleActive,
};