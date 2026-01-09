import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Authenticate middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Get user from database
        const result = await query(
            'SELECT id, email, username, name, is_public FROM users WHERE id = $1',
            [decoded.userId]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Attach user to request
        req.user = result.rows[0];
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        console.error('Auth middleware error:', error);
        return res.status(500).json({ error: 'Authentication failed' });
    }
};

/**
 * Optional authentication
 * Attaches user if token is valid, but doesn't fail if not
 */
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next();
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        const result = await query(
            'SELECT id, email, username, name, is_public FROM users WHERE id = $1',
            [decoded.userId]
        );

        if (result.rows.length > 0) {
            req.user = result.rows[0];
        }

        next();
    } catch (error) {
        // Token invalid or expired, just continue without user
        next();
    }
};

/**
 * Generate JWT tokens
 */
export const generateTokens = (userId) => {
    const accessToken = jwt.sign(
        { userId },
        JWT_SECRET,
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        { userId, type: 'refresh' },
        JWT_SECRET,
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.type !== 'refresh') {
            throw new Error('Invalid token type');
        }
        return decoded;
    } catch (error) {
        return null;
    }
};
