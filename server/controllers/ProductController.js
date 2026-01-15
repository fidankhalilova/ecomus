// controllers/ProductController.js
const ProductModel = require('../models/ProductSchema');
const ProductCategoryModel = require('../models/ProductCategorySchema');
const ProductColorModel = require('../models/ProductColorSchema');
const ProductSizeModel = require('../models/ProductSizeSchema');

const CreateProductController = async (req, res) => {
    try {
        const {
            name,
            discountedPrice,
            description,
            price,
            tag,
            mainImage,
            hoverImage,
            stockCount,
            productCategoryId,
            productColors,
            productSizes
        } = req.body;

        // Validate required fields
        if (!name || !description || !price || !mainImage || !hoverImage || !stockCount || !productCategoryId) {
            return res.status(400).json({
                message: "All required fields must be provided."
            });
        }

        // Check if product with same name exists
        const existingProduct = await ProductModel.findOne({ name });
        if (existingProduct) {
            return res.status(400).json({
                message: "Product with this name already exists."
            });
        }

        // Validate that colors and sizes are arrays and not empty
        if (!productColors || !Array.isArray(productColors) || productColors.length === 0) {
            return res.status(400).json({
                message: "At least one product color must be selected."
            });
        }

        if (!productSizes || !Array.isArray(productSizes) || productSizes.length === 0) {
            return res.status(400).json({
                message: "At least one product size must be selected."
            });
        }

        // Create new product
        const newProduct = new ProductModel({
            name,
            discountedPrice: discountedPrice || price,
            description,
            price,
            tag: tag || "new",
            mainImage,
            hoverImage,
            stockCount,
            productCategoryId,
            productColors,
            productSizes,
            isDeleted: false
        });

        await newProduct.save();

        // Populate the product with related data before returning
        const populatedProduct = await ProductModel.findById(newProduct._id)
            .populate('productCategoryId', 'name')
            .populate('productColors', 'name')
            .populate('productSizes', 'name');

        res.status(201).json({
            message: "Product created successfully",
            product: populatedProduct
        });

    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}

const GetAllProductsController = async (req, res) => {
    try {
        const products = await ProductModel.find({ isDeleted: false })
            .populate('productCategoryId', 'name')
            .populate('productColors', 'name')
            .populate('productSizes', 'name')

        if (!products || products.length === 0) {
            return res.status(404).json({
                message: "No products found."
            });
        }

        res.status(200).json({
            message: "Products fetched successfully",
            productList: products
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}

const UpdateProductController = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            discountedPrice,
            description,
            price,
            tag,
            mainImage,
            hoverImage,
            stockCount,
            productCategoryId,
            productColors,
            productSizes
        } = req.body;

        // Find existing product
        const existingProduct = await ProductModel.findById(id);
        if (!existingProduct) {
            return res.status(404).json({
                message: "Product not found."
            });
        }

        // If name is being changed, check if it conflicts with another product
        if (name && name !== existingProduct.name) {
            const nameExists = await ProductModel.findOne({
                name,
                _id: { $ne: id }
            });
            if (nameExists) {
                return res.status(400).json({
                    message: "Another product with this name already exists."
                });
            }
        }

        // Prepare update data
        const updateData = {
            name: name || existingProduct.name,
            discountedPrice: discountedPrice || existingProduct.discountedPrice,
            description: description || existingProduct.description,
            price: price || existingProduct.price,
            tag: tag || existingProduct.tag,
            mainImage: mainImage || existingProduct.mainImage,
            hoverImage: hoverImage || existingProduct.hoverImage,
            stockCount: stockCount || existingProduct.stockCount,
            productCategoryId: productCategoryId || existingProduct.productCategoryId,
            productColors: productColors || existingProduct.productColors,
            productSizes: productSizes || existingProduct.productSizes,
            updatedAt: Date.now()
        };

        const updatedProduct = await ProductModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        )
            .populate('productCategoryId', 'name')
            .populate('productColors', 'name')
            .populate('productSizes', 'name');

        res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct
        });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}

const DeleteProductController = async (req, res) => {
    try {
        const { id } = req.params;

        // Soft delete - set isDeleted to true
        const deletedProduct = await ProductModel.findByIdAndUpdate(
            id,
            {
                isDeleted: true,
                updatedAt: Date.now()
            },
            { new: true }
        )
            .populate('productCategoryId', 'name')
            .populate('productColors', 'name')
            .populate('productSizes', 'name');

        if (!deletedProduct) {
            return res.status(404).json({
                message: "Product not found."
            });
        }

        res.status(200).json({
            message: "Product deleted successfully",
            product: deletedProduct
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}

// Category controllers
// In your ProductController.js
const CreateProductCategoryController = async (req, res) => {
    try {
        const { name, image } = req.body;

        if (!name || name.trim() === '') {
            return res.status(400).json({
                message: "Category name is required."
            });
        }

        const existingProductCategory = await ProductCategoryModel.findOne({
            name: name.trim()
        });

        if (existingProductCategory) {
            return res.status(400).json({
                message: "Product category with this name already exists."
            });
        }

        const newProductCategory = await ProductCategoryModel.create({
            name: name.trim(),
            image: image || 'https://via.placeholder.com/300x300?text=Category+Image',
            isDeleted: false
        });

        res.status(201).json({
            message: "Product category created successfully",
            productCategory: newProductCategory
        });
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}

const UpdateProductCategoryController = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, image } = req.body;

        if (!name || name.trim() === '') {
            return res.status(400).json({
                message: "Category name is required."
            });
        }

        const existingCategory = await ProductCategoryModel.findById(id);
        if (!existingCategory) {
            return res.status(404).json({
                message: "Category not found."
            });
        }

        // Check if name is being changed to an existing name
        if (name.trim() !== existingCategory.name) {
            const nameExists = await ProductCategoryModel.findOne({
                name: name.trim(),
                _id: { $ne: id }
            });
            if (nameExists) {
                return res.status(400).json({
                    message: "Category with this name already exists."
                });
            }
        }

        const updatedCategory = await ProductCategoryModel.findByIdAndUpdate(
            id,
            {
                name: name.trim(),
                image: image || existingCategory.image,
                updatedAt: Date.now()
            },
            { new: true }
        );

        res.status(200).json({
            message: "Category updated successfully",
            productCategory: updatedCategory
        });
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}

const GetAllProductCategoriesController = async (req, res) => {
    try {
        const productCategories = await ProductCategoryModel.find({
            isDeleted: false
        }).sort({ name: 1 });

        if (!productCategories || productCategories.length === 0) {
            return res.status(404).json({
                message: "No product categories found."
            });
        }

        res.status(200).json({
            message: "Product categories fetched successfully",
            productCategoryList: productCategories
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}

const DeleteProductCategoryController = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if any products are using this category
        const productsUsingCategory = await ProductModel.findOne({
            productCategoryId: id,
            isDeleted: false
        });

        if (productsUsingCategory) {
            return res.status(400).json({
                message: "Cannot delete category. There are products using this category."
            });
        }

        const deletedCategory = await ProductCategoryModel.findByIdAndUpdate(
            id,
            {
                isDeleted: true,
                updatedAt: Date.now()
            },
            { new: true }
        );

        if (!deletedCategory) {
            return res.status(404).json({
                message: "Category not found."
            });
        }

        res.status(200).json({
            message: "Category deleted successfully",
            productCategory: deletedCategory
        });
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}

// Color controllers
const CreateProductColorController = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || name.trim() === '') {
            return res.status(400).json({
                message: "Color name is required."
            });
        }

        const existingProductColor = await ProductColorModel.findOne({
            name: name.trim()
        });

        if (existingProductColor) {
            return res.status(400).json({
                message: "Product color with this name already exists."
            });
        }

        const newProductColor = await ProductColorModel.create({
            name: name.trim(),
            isDeleted: false
        });

        res.status(201).json({
            message: "Product color created successfully",
            productColor: newProductColor
        });
    } catch (error) {
        console.error("Error creating color:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}

const GetAllProductColorsController = async (req, res) => {
    try {
        const productColors = await ProductColorModel.find({
            isDeleted: false
        }).sort({ name: 1 });

        if (!productColors || productColors.length === 0) {
            return res.status(404).json({
                message: "No product colors found."
            });
        }

        res.status(200).json({
            message: "Product colors fetched successfully",
            productColorList: productColors
        });
    } catch (error) {
        console.error("Error fetching colors:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}

const UpdateProductColorController = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name || name.trim() === '') {
            return res.status(400).json({
                message: "Color name is required."
            });
        }

        const existingColor = await ProductColorModel.findById(id);
        if (!existingColor) {
            return res.status(404).json({
                message: "Color not found."
            });
        }

        // Check if name is being changed to an existing name
        if (name.trim() !== existingColor.name) {
            const nameExists = await ProductColorModel.findOne({
                name: name.trim(),
                _id: { $ne: id }
            });
            if (nameExists) {
                return res.status(400).json({
                    message: "Color with this name already exists."
                });
            }
        }

        const updatedColor = await ProductColorModel.findByIdAndUpdate(
            id,
            {
                name: name.trim(),
                updatedAt: Date.now()
            },
            { new: true }
        );

        res.status(200).json({
            message: "Color updated successfully",
            productColor: updatedColor
        });
    } catch (error) {
        console.error("Error updating color:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}

const DeleteProductColorController = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if any products are using this color
        const productsUsingColor = await ProductModel.findOne({
            productColors: id,
            isDeleted: false
        });

        if (productsUsingColor) {
            return res.status(400).json({
                message: "Cannot delete color. There are products using this color."
            });
        }

        const deletedColor = await ProductColorModel.findByIdAndUpdate(
            id,
            {
                isDeleted: true,
                updatedAt: Date.now()
            },
            { new: true }
        );

        if (!deletedColor) {
            return res.status(404).json({
                message: "Color not found."
            });
        }

        res.status(200).json({
            message: "Color deleted successfully",
            productColor: deletedColor
        });
    } catch (error) {
        console.error("Error deleting color:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}

// Size controllers
const CreateProductSizeController = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || name.trim() === '') {
            return res.status(400).json({
                message: "Size name is required."
            });
        }

        const existingProductSize = await ProductSizeModel.findOne({
            name: name.trim()
        });

        if (existingProductSize) {
            return res.status(400).json({
                message: "Product size with this name already exists."
            });
        }

        const newProductSize = await ProductSizeModel.create({
            name: name.trim(),
            isDeleted: false
        });

        res.status(201).json({
            message: "Product size created successfully",
            productSize: newProductSize
        });
    } catch (error) {
        console.error("Error creating size:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}

const GetAllProductSizesController = async (req, res) => {
    try {
        const productSizes = await ProductSizeModel.find({
            isDeleted: false
        }).sort({ name: 1 });

        if (!productSizes || productSizes.length === 0) {
            return res.status(404).json({
                message: "No product sizes found."
            });
        }

        res.status(200).json({
            message: "Product sizes fetched successfully",
            productSizeList: productSizes
        });
    } catch (error) {
        console.error("Error fetching sizes:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}

const UpdateProductSizeController = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name || name.trim() === '') {
            return res.status(400).json({
                message: "Size name is required."
            });
        }

        const existingSize = await ProductSizeModel.findById(id);
        if (!existingSize) {
            return res.status(404).json({
                message: "Size not found."
            });
        }

        // Check if name is being changed to an existing name
        if (name.trim() !== existingSize.name) {
            const nameExists = await ProductSizeModel.findOne({
                name: name.trim(),
                _id: { $ne: id }
            });
            if (nameExists) {
                return res.status(400).json({
                    message: "Size with this name already exists."
                });
            }
        }

        const updatedSize = await ProductSizeModel.findByIdAndUpdate(
            id,
            {
                name: name.trim(),
                updatedAt: Date.now()
            },
            { new: true }
        );

        res.status(200).json({
            message: "Size updated successfully",
            productSize: updatedSize
        });
    } catch (error) {
        console.error("Error updating size:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}

const DeleteProductSizeController = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if any products are using this size
        const productsUsingSize = await ProductModel.findOne({
            productSizes: id,
            isDeleted: false
        });

        if (productsUsingSize) {
            return res.status(400).json({
                message: "Cannot delete size. There are products using this size."
            });
        }

        const deletedSize = await ProductSizeModel.findByIdAndUpdate(
            id,
            {
                isDeleted: true,
                updatedAt: Date.now()
            },
            { new: true }
        );

        if (!deletedSize) {
            return res.status(404).json({
                message: "Size not found."
            });
        }

        res.status(200).json({
            message: "Size deleted successfully",
            productSize: deletedSize
        });
    } catch (error) {
        console.error("Error deleting size:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}

module.exports = {
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
};