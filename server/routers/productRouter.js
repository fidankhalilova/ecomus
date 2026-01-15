// routes/productRoutes.js
const express = require('express');
const router = express.Router();

const {
    CreateProductController,
    GetAllProductsController,
    UpdateProductController,
    DeleteProductController,
    CreateProductCategoryController,
    GetAllProductCategoriesController,
    UpdateProductCategoryController,
    DeleteProductCategoryController,
    CreateProductColorController,
    GetAllProductColorsController,
    UpdateProductColorController,
    DeleteProductColorController,
    CreateProductSizeController,
    GetAllProductSizesController,
    UpdateProductSizeController,
    DeleteProductSizeController
} = require('../controllers/ProductController');

// Product routes
router.post("/create-product", CreateProductController);
router.get("/get-products", GetAllProductsController);
router.put("/:id", UpdateProductController);
router.delete("/:id", DeleteProductController);

// Category routes
router.post("/create-product-category", CreateProductCategoryController);
router.get("/get-product-categories", GetAllProductCategoriesController);
router.put("/categories/:id", UpdateProductCategoryController);
router.delete("/categories/:id", DeleteProductCategoryController);

// Color routes
router.post("/create-product-color", CreateProductColorController);
router.get("/get-product-colors", GetAllProductColorsController);
router.put("/colors/:id", UpdateProductColorController);
router.delete("/colors/:id", DeleteProductColorController);

// Size routes
router.post("/create-product-size", CreateProductSizeController);
router.get("/get-product-sizes", GetAllProductSizesController);
router.put("/sizes/:id", UpdateProductSizeController);
router.delete("/sizes/:id", DeleteProductSizeController);

module.exports = router;