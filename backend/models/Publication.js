const mongoose = require('mongoose');

const attributeSchema = new mongoose.Schema({
    key: { type: String, required: true },
    label: { type: String, required: true },
    value: { type: String, required: true },
}, { _id: false });

const publicationSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    images: [{
        type: String,
        required: true
    }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'inactive'],
        default: 'pending',
    },
    moderationComment: { type: String, default: null },
    attributes: [attributeSchema],
}, { timestamps: true });

module.exports = mongoose.model('Publication', publicationSchema);