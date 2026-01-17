const UserModel = require("../models/userSchema");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const GetAllUsersController = async (req, res) => {
    try {
        const users = await UserModel.find({}, '-password');

        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No users found." });
        }

        res.status(200).json({
            message: "Users fetched successfully",
            userList: users
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

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
        return res.status(400).json({
            success: false,  // ← Add this
            message: "Email and password are required"
        });
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    if (!existingUserByEmail) {
        return res.status(404).json({
            success: false,  // ← Add this
            message: "User not found"
        });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUserByEmail.password);
    if (!isPasswordValid) {
        return res.status(401).json({
            success: false,  // ← Add this
            message: "Invalid password"
        });
    }

    const token = jwt.sign({
        userId: existingUserByEmail._id,
        email: existingUserByEmail.email
    }, process.env.SECURITY_KEY, { expiresIn: '1h' });

    // Set cookie (optional)
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000
    });

    // Return response in the format frontend expects
    res.status(200).json({
        success: true,  // ← This is crucial!
        message: "Login successful",
        token,
        user: {
            _id: existingUserByEmail._id,
            name: existingUserByEmail.name,
            email: existingUserByEmail.email
        }
    });
}

const DeleteUserController = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedUser = await UserModel.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({
            message: "User deleted successfully",
            user: { _id: deletedUser._id }
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const UpdateUserController = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;

        // Check if user exists
        const existingUser = await UserModel.findById(id);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found." });
        }

        // Check if email is being changed to an existing email
        if (email && email !== existingUser.email) {
            const emailExists = await UserModel.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: "Email already exists." });
            }
        }

        const updateData = {
            name: name || existingUser.name,
            email: email || existingUser.email,
            updatedAt: Date.now()
        };

        // If password is provided, hash it
        if (password) {
            if (password.length < 8) {
                return res.status(400).json({
                    message: "Password must be at least 8 characters long"
                });
            }
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true, select: '-password' }
        );

        res.status(200).json({
            message: "User updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = {
    AuthRegister, AuthLogin, DeleteUserController, UpdateUserController, GetAllUsersController
};