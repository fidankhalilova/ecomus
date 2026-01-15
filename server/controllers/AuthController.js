const UserModel = require("../models/userSchema");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const AuthRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (password.length < 8 || password.length > 20) {
            return res.status(400).json({
                message: "Password must be between 8 and 20 characters"
            });
        }

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const payload = {
            name,
            email,
            password: hashedPassword
        };

        const user = await UserModel.create(payload);

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            message: "User registration failed",
            error: error.message
        });
    }
};

const AuthLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    const existingUserByEmail = await UserModel.findOne({ email });
    if (!existingUserByEmail) {
        return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, existingUserByEmail.password);
    const payload = {
        email,
        password,
    }
    const token = jwt.sign({ email: existingUserByEmail.email }, process.env.SECURITY_KEY, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, secure: true, maxage: 3600000 });
    res.status(200).json({ message: "Login successful", token, user: existingUserByEmail });

}

module.exports = { AuthRegister, AuthLogin };