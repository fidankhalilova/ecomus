const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
    try {
        console.log('Auth middleware called');
        console.log('Headers:', req.headers);

        // Get token from header
        const authHeader = req.header('Authorization');

        if (!authHeader) {
            console.log('No Authorization header found');
            return res.status(401).json({
                success: false,
                message: 'No token, authorization denied'
            });
        }

        if (!authHeader.startsWith('Bearer ')) {
            console.log('Authorization header does not start with Bearer');
            return res.status(401).json({
                success: false,
                message: 'Invalid token format'
            });
        }

        const token = authHeader.replace('Bearer ', '');
        console.log('Token received:', token.substring(0, 20) + '...');

        if (!token) {
            console.log('Token is empty after removing Bearer');
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        // Debug: Log the JWT secret (be careful in production)
        console.log('JWT_SECRET exists:', !!process.env.SECURITY_KEY);
        console.log('JWT_SECRET length:', process.env.SECURITY_KEY ? process.env.SECURITY_KEY.length : 0);

        // Verify token
        const decoded = jwt.verify(token, process.env.SECURITY_KEY);
        console.log('Token decoded successfully:', decoded);

        // Add user to request
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Auth middleware error details:', {
            name: error.name,
            message: error.message,
            expiredAt: error.expiredAt
        });

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token has expired',
                expiredAt: error.expiredAt
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token signature',
                error: error.message
            });
        }

        return res.status(401).json({
            success: false,
            message: 'Token is not valid',
            error: error.message
        });
    }
};

module.exports = authMiddleware;