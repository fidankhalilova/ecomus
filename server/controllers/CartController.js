const Cart = require('../models/CartSchema');
const Product = require('../models/ProductSchema');

class CartController {
    static async getCart(req, res) {
        try {
            console.log('🛒 getCart called');

            const userId = req.user._id || req.user.userId || req.user.id;

            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: 'User ID not found in token'
                });
            }

            console.log('🔍 Finding cart for user:', userId);

            // SIMPLE populate - only get product name, price, images
            const cart = await Cart.findOne({ user: userId })
                .populate({
                    path: 'items.product',
                    select: 'name price images', // Only these fields
                    model: 'Product'
                });

            if (!cart) {
                console.log('📭 No cart found, returning empty');
                return res.json({
                    success: true,
                    cart: {
                        items: [],
                        totalItems: 0,
                        totalPrice: 0
                    }
                });
            }

            console.log('✅ Cart found with', cart.items.length, 'items');

            // Format items for response
            const formattedItems = cart.items.map(item => {
                const itemObj = {
                    _id: item._id,
                    product: item.product ? {
                        _id: item.product._id,
                        name: item.product.name || 'Product',
                        price: item.product.price || 0,
                        images: item.product.images || []
                    } : {
                        _id: item.product,
                        name: 'Product not found',
                        price: 0,
                        images: []
                    },
                    quantity: item.quantity || 1
                };

                // Add size and color as strings if they exist
                if (item.size) {
                    itemObj.size = item.size;
                }

                if (item.color) {
                    itemObj.color = item.color;
                }

                return itemObj;
            });

            // Calculate total price if not already set
            let totalPrice = cart.totalPrice || 0;
            if (totalPrice === 0) {
                totalPrice = formattedItems.reduce((sum, item) => {
                    return sum + (item.product.price * item.quantity);
                }, 0);
            }

            res.json({
                success: true,
                cart: {
                    items: formattedItems,
                    totalItems: cart.totalItems || formattedItems.reduce((sum, item) => sum + item.quantity, 0),
                    totalPrice: totalPrice
                }
            });
        } catch (error) {
            console.error('❌ Error in getCart:', error.message);
            console.error('Error stack:', error.stack);

            // Return empty cart on error
            res.json({
                success: true,
                cart: {
                    items: [],
                    totalItems: 0,
                    totalPrice: 0
                }
            });
        }
    }

    // Add item to cart
    static async addToCart(req, res) {
        try {
            const { productId, quantity, sizeId, colorId } = req.body;

            // Debug: Log the user object
            console.log('addToCart - req.user:', req.user);
            console.log('addToCart - User ID:', req.user._id || req.user.userId || req.user.id);

            // Get userId from different possible locations
            const userId = req.user._id || req.user.userId || req.user.id;

            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: 'User ID not found in token'
                });
            }

            console.log('addToCart called:', { userId, productId, quantity, sizeId, colorId });

            // Validate product
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }

            // Find user's cart
            let cart = await Cart.findOne({ user: userId });

            if (!cart) {
                // Create new cart if doesn't exist
                cart = new Cart({
                    user: userId,
                    items: []
                });
            }

            // Check if item already exists in cart
            const existingItemIndex = cart.items.findIndex(item =>
                item.product.toString() === productId &&
                (item.size?.toString() === sizeId || (!item.size && !sizeId)) &&
                (item.color?.toString() === colorId || (!item.color && !colorId))
            );

            if (existingItemIndex > -1) {
                // Update quantity if item exists
                cart.items[existingItemIndex].quantity += quantity || 1;
            } else {
                // Add new item
                const newItem = {
                    product: productId,
                    quantity: quantity || 1
                };

                // Only add size/color if provided
                if (sizeId) newItem.size = sizeId;
                if (colorId) newItem.color = colorId;

                cart.items.push(newItem);
            }

            // Calculate total items
            cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

            // Calculate total price
            let totalPrice = 0;
            for (const item of cart.items) {
                const productDetails = await Product.findById(item.product);
                if (productDetails && productDetails.price) {
                    totalPrice += productDetails.price * item.quantity;
                }
            }

            cart.totalPrice = totalPrice;
            await cart.save();

            // Populate the cart items for response
            const populatedCart = await Cart.findById(cart._id)
                .populate('items.product', 'name price images')
                .populate('items.size', 'name')
                .populate('items.color', 'name colorCode');

            res.json({
                success: true,
                message: 'Item added to cart',
                cart: {
                    items: populatedCart.items,
                    totalItems: populatedCart.totalItems,
                    totalPrice: populatedCart.totalPrice
                }
            });
        } catch (error) {
            console.error('Error in addToCart:', error);
            console.error('Error stack:', error.stack);
            res.status(500).json({
                success: false,
                message: 'Error adding item to cart',
                error: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    }

    // Update cart item quantity
    static async updateCartItem(req, res) {
        try {
            const { itemId } = req.params;
            const { quantity } = req.body;
            const userId = req.user._id;

            const cart = await Cart.findOne({ user: userId });
            if (!cart) {
                return res.status(404).json({
                    success: false,
                    message: 'Cart not found'
                });
            }

            const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
            if (itemIndex === -1) {
                return res.status(404).json({
                    success: false,
                    message: 'Item not found in cart'
                });
            }

            if (quantity < 1) {
                // Remove item if quantity is less than 1
                cart.items.splice(itemIndex, 1);
            } else {
                cart.items[itemIndex].quantity = quantity;
            }

            // Calculate total price
            let totalPrice = 0;
            for (const item of cart.items) {
                const product = await Product.findById(item.product);
                if (product) {
                    totalPrice += product.price * item.quantity;
                }
            }

            cart.totalPrice = totalPrice;
            await cart.save();

            res.json({
                success: true,
                message: 'Cart updated',
                cart: {
                    items: cart.items,
                    totalItems: cart.totalItems,
                    totalPrice: cart.totalPrice
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating cart',
                error: error.message
            });
        }
    }

    // Remove item from cart
    static async removeFromCart(req, res) {
        try {
            const { itemId } = req.params;
            const userId = req.user._id;

            const cart = await Cart.findOne({ user: userId });
            if (!cart) {
                return res.status(404).json({
                    success: false,
                    message: 'Cart not found'
                });
            }

            const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
            if (itemIndex === -1) {
                return res.status(404).json({
                    success: false,
                    message: 'Item not found in cart'
                });
            }

            cart.items.splice(itemIndex, 1);

            // Calculate total price
            let totalPrice = 0;
            for (const item of cart.items) {
                const product = await Product.findById(item.product);
                if (product) {
                    totalPrice += product.price * item.quantity;
                }
            }

            cart.totalPrice = totalPrice;
            await cart.save();

            res.json({
                success: true,
                message: 'Item removed from cart',
                cart: {
                    items: cart.items,
                    totalItems: cart.totalItems,
                    totalPrice: cart.totalPrice
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error removing item from cart',
                error: error.message
            });
        }
    }

    // Clear cart
    static async clearCart(req, res) {
        try {
            const userId = req.user._id;

            const cart = await Cart.findOne({ user: userId });
            if (!cart) {
                return res.status(404).json({
                    success: false,
                    message: 'Cart not found'
                });
            }

            cart.items = [];
            cart.totalPrice = 0;
            await cart.save();

            res.json({
                success: true,
                message: 'Cart cleared'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error clearing cart',
                error: error.message
            });
        }
    }
}

module.exports = CartController;