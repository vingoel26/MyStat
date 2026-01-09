import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'devstats-secret-key-change-in-production';

// In-memory user store for auth (shared with database.js)
const authUsers = new Map();

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

        // Attach basic user info to request
        req.user = { id: decoded.userId };
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
        req.user = { id: decoded.userId };
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
        { expiresIn: '7d' } // Extended for development
    );

    const refreshToken = jwt.sign(
        { userId, type: 'refresh' },
        JWT_SECRET,
        { expiresIn: '30d' }
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
