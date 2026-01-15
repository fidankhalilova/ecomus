const mongoose = require('mongoose');
const ProductColorSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
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

const ProductColorModel = mongoose.model("ProductColor", ProductColorSchema);

module.exports = ProductColorModel;