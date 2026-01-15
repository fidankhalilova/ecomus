const mongoose = require('mongoose');
const ProductSizeSchema = new mongoose.Schema({
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

const ProductSizeModel = mongoose.model("ProductSize", ProductSizeSchema);

module.exports = ProductSizeModel;