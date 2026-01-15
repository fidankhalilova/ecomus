const express = require('express');
const router = express.Router();
const { AuthRegister, AuthLogin } = require("../controllers/AuthController")

router.post('/register', AuthRegister);
router.post('/login', AuthLogin);
module.exports = router;