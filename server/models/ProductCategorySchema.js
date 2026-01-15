// models/ProductCategorySchema.js
const mongoose = require('mongoose');

const ProductCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    image: {
        type: String,
        trim: true,
        default: 'https://via.placeholder.com/300x300?text=Category+Image'
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ProductCategoryModel = mongoose.model("ProductCategory", ProductCategorySchema);

module.exports = ProductCategoryModel;