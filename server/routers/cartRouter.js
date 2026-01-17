const express = require('express');
const router = express.Router();
const CartController = require('../controllers/CartController');
const authMiddleware = require('../middleware/authMiddleware');

// All cart routes require authentication
router.use(authMiddleware);

// GET /api/cart - Get user's cart
router.get('/', CartController.getCart);

// POST /api/cart/add - Add item to cart
router.post('/add', CartController.addToCart);

// PUT /api/cart/item/:itemId - Update cart item
router.put('/item/:itemId', CartController.updateCartItem);

// DELETE /api/cart/item/:itemId - Remove item from cart
router.delete('/item/:itemId', CartController.removeFromCart);

// DELETE /api/cart/clear - Clear cart
router.delete('/clear', CartController.clearCart);

module.exports = router;