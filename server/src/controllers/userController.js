import { query } from '../config/database.js';

/**
 * Get public user profile
 */
export const getPublicProfile = async (req, res) => {
    try {
        const { username } = req.params;

        const result = await query(
            `SELECT id, name, username, bio, avatar_url, is_public, skills, social_links, created_at 
       FROM users WHERE username = $1`,
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = result.rows[0];

        // Check if profile is public
        if (!user.is_public && (!req.user || req.user.id !== user.id)) {
            return res.status(403).json({ error: 'This profile is private' });
        }

        res.json({
            id: user.id,
            name: user.name,
            username: user.username,
            bio: user.bio,
            avatarUrl: user.avatar_url,
            skills: user.skills,
            socialLinks: user.social_links,
            createdAt: user.created_at,
        });
    } catch (error) {
        console.error('Get public profile error:', error);
        res.status(500).json({ error: 'Failed to get profile' });
    }
};

/**
 * Update user profile
 */
export const updateProfile = async (req, res) => {
    try {
        const { name, bio, skills, socialLinks } = req.body;

        const result = await query(
            `UPDATE users 
       SET name = COALESCE($1, name),
           bio = COALESCE($2, bio),
           skills = COALESCE($3, skills),
           social_links = COALESCE($4, social_links)
       WHERE id = $5
       RETURNING id, name, username, bio, avatar_url, is_public, skills, social_links`,
            [name, bio, skills, socialLinks, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = result.rows[0];
        res.json({
            id: user.id,
            name: user.name,
            username: user.username,
            bio: user.bio,
            avatarUrl: user.avatar_url,
            isPublic: user.is_public,
            skills: user.skills,
            socialLinks: user.social_links,
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

/**
 * Update user settings
 */
export const updateSettings = async (req, res) => {
    try {
        const { isPublic } = req.body;

        const result = await query(
            `UPDATE users 
       SET is_public = COALESCE($1, is_public)
       WHERE id = $2
       RETURNING id, is_public`,
            [isPublic, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ isPublic: result.rows[0].is_public });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ error: 'Failed to update settings' });
    }
};

/**
 * Delete user account
 */
export const deleteAccount = async (req, res) => {
    try {
        await query('DELETE FROM users WHERE id = $1', [req.user.id]);
        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({ error: 'Failed to delete account' });
    }
};

/**
 * Get user statistics
 */
export const getUserStats = async (req, res) => {
    try {
        const { username } = req.params;

        // Get user
        const userResult = await query(
            'SELECT id, is_public FROM users WHERE username = $1',
            [username]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = userResult.rows[0];

        // Check privacy
        if (!user.is_public && (!req.user || req.user.id !== user.id)) {
            return res.status(403).json({ error: 'Stats are private' });
        }

        // Get stats from view
        const statsResult = await query(
            'SELECT * FROM user_stats_summary WHERE user_id = $1',
            [user.id]
        );

        if (statsResult.rows.length === 0) {
            return res.json({
                totalSubmissions: 0,
                totalSolved: 0,
                totalContests: 0,
                connectedPlatforms: 0,
            });
        }

        const stats = statsResult.rows[0];
        res.json({
            totalSubmissions: stats.total_submissions,
            totalSolved: stats.total_solved,
            totalContests: stats.total_contests,
            connectedPlatforms: stats.connected_platforms,
            lastActiveDate: stats.last_active_date,
        });
    } catch (error) {
        console.error('Get user stats error:', error);
        res.status(500).json({ error: 'Failed to get stats' });
    }
};

/**
 * Get user achievements
 */
export const getAchievements = async (req, res) => {
    try {
        const { username } = req.params;

        // Get user
        const userResult = await query(
            'SELECT id FROM users WHERE username = $1',
            [username]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const achievements = await query(
            `SELECT achievement_key, name, description, icon, unlocked_at 
       FROM achievements WHERE user_id = $1 ORDER BY unlocked_at DESC`,
            [userResult.rows[0].id]
        );

        res.json(achievements.rows.map(a => ({
            key: a.achievement_key,
            name: a.name,
            description: a.description,
            icon: a.icon,
            unlockedAt: a.unlocked_at,
        })));
    } catch (error) {
        console.error('Get achievements error:', error);
        res.status(500).json({ error: 'Failed to get achievements' });
    }
};
