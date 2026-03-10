const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
    key: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, enum: ['text', 'number', 'select'], default: 'text' },
    options: [{ type: String }],
    required: { type: Boolean, default: false },
}, { _id: false });

const categoryTemplateSchema = new mongoose.Schema({
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, unique: true },
    fields: [fieldSchema],
}, { timestamps: true });

module.exports = mongoose.model('CategoryTemplate', categoryTemplateSchema);