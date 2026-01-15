const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    discountedPrice: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    tag: {
        type: String,
        enum: ['new', 'sale', 'best seller', ''],
        required: true
    },
    mainImage: {
        type: String,
        required: true,
    },
    hoverImage: {
        type: String,
        required: true,
    },
    stockCount: {
        type: Number,
        required: true,
    },
    productCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductCategory',
        required: true
    },
    productColors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductColor',
        required: true
    }],
    productSizes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductSize',
        required: true
    }],
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
})

const ProductModel = mongoose.model("Product", ProductSchema);

module.exports = ProductModel;