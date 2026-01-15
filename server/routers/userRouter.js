const express = require('express');
const router = express.Router();
const { AuthRegister, AuthLogin, GetAllUsersController, UpdateUserController, DeleteUserController } = require("../controllers/AuthController")

// Get all users
router.get("/get-users", GetAllUsersController);

// Update user
router.put("/:id", UpdateUserController);

// Delete user
router.delete("/:id", DeleteUserController);

router.post('/register', AuthRegister);
router.post('/login', AuthLogin);
module.exports = router;