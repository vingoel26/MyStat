import bcrypt from 'bcryptjs';
import { query } from '../config/database.js';
import { generateTokens, verifyRefreshToken } from '../middleware/auth.js';

/**
 * Register a new user
 */
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        // Check if email exists
        const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Generate username from email
        let username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');

        // Ensure username is unique
        const existingUsername = await query('SELECT id FROM users WHERE username = $1', [username]);
        if (existingUsername.rows.length > 0) {
            username = `${username}${Date.now().toString(36)}`;
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 12);

        // Create user
        const result = await query(
            `INSERT INTO users (name, email, username, password_hash) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, name, email, username, is_public, created_at`,
            [name, email, username, passwordHash]
        );

        const user = result.rows[0];
        const tokens = generateTokens(user.id);

        // TODO: Store refresh token in sessions table

        res.status(201).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                username: user.username,
                isPublic: user.is_public,
            },
            ...tokens,
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

/**
 * Login user
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const result = await query(
            'SELECT id, name, email, username, password_hash, is_public FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];

        // Verify password
        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const tokens = generateTokens(user.id);

        // TODO: Store refresh token in sessions table

        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                username: user.username,
                isPublic: user.is_public,
            },
            ...tokens,
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};

/**
 * Logout user
 */
export const logout = async (req, res) => {
    try {
        // TODO: Invalidate refresh token in sessions table
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Logout failed' });
    }
};

/**
 * Refresh access token
 */
export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ error: 'Refresh token required' });
        }

        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded) {
            return res.status(401).json({ error: 'Invalid refresh token' });
        }

        // TODO: Verify token exists in sessions table

        const tokens = generateTokens(decoded.userId);

        res.json(tokens);
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({ error: 'Token refresh failed' });
    }
};

/**
 * Forgot password (placeholder)
 */
export const forgotPassword = async (req, res) => {
    // TODO: Implement email sending
    res.json({ message: 'If the email exists, a reset link will be sent' });
};

/**
 * Reset password (placeholder)
 */
export const resetPassword = async (req, res) => {
    // TODO: Implement password reset
    res.json({ message: 'Password reset not implemented yet' });
};

/**
 * Get current user
 */
export const getCurrentUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const result = await query(
            `SELECT id, name, email, username, bio, avatar_url, is_public, skills, social_links, created_at 
       FROM users WHERE id = $1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = result.rows[0];
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            username: user.username,
            bio: user.bio,
            avatarUrl: user.avatar_url,
            isPublic: user.is_public,
            skills: user.skills,
            socialLinks: user.social_links,
            createdAt: user.created_at,
        });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ error: 'Failed to get user' });
    }
};
