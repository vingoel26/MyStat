import bcrypt from 'bcryptjs';
import User from '../models/User.js';
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
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Generate username from email
        let username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');

        // Ensure username is unique
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            username = `${username}${Date.now().toString(36)}`;
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 12);

        // Create user
        const user = await User.create({
            name,
            email,
            username,
            password_hash: passwordHash
        });

        const tokens = generateTokens(user._id.toString());

        // TODO: Store refresh token in sessions collection

        res.status(201).json({
            user: {
                id: user._id,
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
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const tokens = generateTokens(user._id.toString());

        // TODO: Store refresh token in sessions collection

        res.json({
            user: {
                id: user._id,
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
        // TODO: Invalidate refresh token in sessions collection
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

        // TODO: Verify token exists in sessions collection

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

        const user = await User.findById(req.user.id)
            .select('-password_hash');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            id: user._id,
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
