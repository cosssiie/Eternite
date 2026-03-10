const User = require('../models/User');

const findByEmail = (email) => User.findOne({ email });

const findById = (id) => User.findById(id).select('-password');

const findAll = () => User.find().select('-password');

const create = (data) => User.create(data);

const updateById = (id, data) =>
    User.findByIdAndUpdate(id, data, { new: true }).select('-password');

const deleteById = (id) => User.findByIdAndDelete(id);

const findByVerifyToken = (token) => User.findOne({ verifyToken: token });

module.exports = {
    findByEmail,
    findById,
    findAll,
    create,
    updateById,
    deleteById,
    findByVerifyToken,
};