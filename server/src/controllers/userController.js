import User from '../models/User.js';
import Achievement from '../models/Achievement.js';
import Submission from '../models/Submission.js';
import Contest from '../models/Contest.js';
import PlatformAccount from '../models/PlatformAccount.js';
import DailyStat from '../models/DailyStat.js';

/**
 * Get public user profile
 */
export const getPublicProfile = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username })
            .select('-password_hash');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if profile is public
        if (!user.is_public && (!req.user || req.user.id !== user._id.toString())) {
            return res.status(403).json({ error: 'This profile is private' });
        }

        res.json({
            id: user._id,
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

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (bio !== undefined) updateData.bio = bio;
        if (skills !== undefined) updateData.skills = skills;
        if (socialLinks !== undefined) updateData.social_links = socialLinks;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password_hash');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            id: user._id,
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

        const updateData = {};
        if (isPublic !== undefined) updateData.is_public = isPublic;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updateData,
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ isPublic: user.is_public });
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
        await User.findByIdAndDelete(req.user.id);
        // Note: Related documents will need to be cleaned up
        // Consider adding cascade delete logic or using pre-remove hooks
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
        const user = await User.findOne({ username }).select('_id is_public');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check privacy
        if (!user.is_public && (!req.user || req.user.id !== user._id.toString())) {
            return res.status(403).json({ error: 'Stats are private' });
        }

        // Aggregate stats
        const [submissionStats, contestCount, platformCount, lastActive] = await Promise.all([
            Submission.aggregate([
                { $match: { user: user._id } },
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        solved: { $sum: { $cond: [{ $eq: ['$status', 'solved'] }, 1, 0] } }
                    }
                }
            ]),
            Contest.countDocuments({ user: user._id }),
            PlatformAccount.countDocuments({ user: user._id }),
            DailyStat.findOne({ user: user._id, problems_solved: { $gt: 0 } })
                .sort({ date: -1 })
                .select('date')
        ]);

        const stats = submissionStats[0] || { total: 0, solved: 0 };

        res.json({
            totalSubmissions: stats.total,
            totalSolved: stats.solved,
            totalContests: contestCount,
            connectedPlatforms: platformCount,
            lastActiveDate: lastActive?.date || null,
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
        const user = await User.findOne({ username }).select('_id');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const achievements = await Achievement.find({ user: user._id })
            .sort({ unlocked_at: -1 });

        res.json(achievements.map(a => ({
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

/**
 * Get user platforms (public)
 */
export const getUserPlatforms = async (req, res) => {
    try {
        const { username } = req.params;

        // Get user
        const user = await User.findOne({ username }).select('_id is_public');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check privacy
        if (!user.is_public && (!req.user || req.user.id !== user._id.toString())) {
            return res.status(403).json({ error: 'Profile is private' });
        }

        const platforms = await PlatformAccount.find({ user: user._id });

        res.json(platforms.map(p => ({
            id: p._id,
            platform: p.platform,
            platformUsername: p.platform_username,
            isVerified: p.is_verified,
            lastSyncedAt: p.last_synced_at,
            profileData: p.profile_data,
        })));
    } catch (error) {
        console.error('Get user platforms error:', error);
        res.status(500).json({ error: 'Failed to get platforms' });
    }
};
