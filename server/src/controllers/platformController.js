/**
 * Platform Controller
 * Handles all platform-related API endpoints using MongoDB
 */

import { fetchPlatformProfile, fetchMultiplePlatformProfiles, SUPPORTED_PLATFORMS } from '../services/platforms/index.js';
import PlatformAccount from '../models/PlatformAccount.js';

/**
 * Get all connected platforms for current user
 */
export async function getConnectedPlatforms(req, res) {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }

        const platforms = await PlatformAccount.find({ user: userId });

        res.json({
            success: true,
            data: platforms.map(p => ({
                id: p._id,
                platform: p.platform,
                platformUsername: p.platform_username,
                isVerified: p.is_verified,
                lastSyncedAt: p.last_synced_at,
                profileData: p.profile_data,
            }))
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

/**
 * Connect a new platform
 */
export async function connectPlatform(req, res) {
    try {
        const { platform, username } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }

        if (!platform || !username) {
            return res.status(400).json({
                success: false,
                error: 'Platform and username are required'
            });
        }

        // Check if platform is supported
        if (!SUPPORTED_PLATFORMS[platform]) {
            return res.status(400).json({
                success: false,
                error: `Unsupported platform: ${platform}`
            });
        }

        // Fetch platform data to verify the account exists
        const result = await fetchPlatformProfile(platform, username);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                error: result.error || 'Failed to verify account'
            });
        }

        // Check if this exact username is already connected for this platform
        const existingAccount = await PlatformAccount.findOne({
            user: userId,
            platform,
            platform_username: username
        });

        if (existingAccount) {
            // Update existing account
            existingAccount.is_verified = true;
            existingAccount.last_synced_at = new Date();
            existingAccount.profile_data = result.data;
            await existingAccount.save();

            return res.json({
                success: true,
                data: {
                    id: existingAccount._id,
                    platform: existingAccount.platform,
                    platformUsername: existingAccount.platform_username,
                    isVerified: existingAccount.is_verified,
                    lastSyncedAt: existingAccount.last_synced_at,
                    profileData: existingAccount.profile_data,
                }
            });
        }

        // Create new platform account (allows multiple accounts per platform)
        const platformAccount = await PlatformAccount.create({
            user: userId,
            platform,
            platform_username: username,
            is_verified: true,
            last_synced_at: new Date(),
            profile_data: result.data,
        });

        res.json({
            success: true,
            data: {
                id: platformAccount._id,
                platform: platformAccount.platform,
                platformUsername: platformAccount.platform_username,
                isVerified: platformAccount.is_verified,
                lastSyncedAt: platformAccount.last_synced_at,
                profileData: platformAccount.profile_data,
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

/**
 * Disconnect a platform
 */
export async function disconnectPlatform(req, res) {
    try {
        const { platformId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }

        await PlatformAccount.findOneAndDelete({ _id: platformId, user: userId });

        res.json({
            success: true,
            message: 'Platform disconnected'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

/**
 * Sync data from a specific platform
 */
export async function syncPlatform(req, res) {
    try {
        const { platformId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }

        const platformAccount = await PlatformAccount.findOne({ _id: platformId, user: userId });

        if (!platformAccount) {
            return res.status(404).json({
                success: false,
                error: 'Platform not found'
            });
        }

        // Fetch fresh data from the platform API
        const result = await fetchPlatformProfile(platformAccount.platform, platformAccount.platform_username);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                error: result.error || 'Failed to sync platform data'
            });
        }

        // Update the stored data
        platformAccount.last_synced_at = new Date();
        platformAccount.profile_data = result.data;
        await platformAccount.save();

        res.json({
            success: true,
            data: {
                id: platformAccount._id,
                platform: platformAccount.platform,
                platformUsername: platformAccount.platform_username,
                isVerified: platformAccount.is_verified,
                lastSyncedAt: platformAccount.last_synced_at,
                profileData: platformAccount.profile_data,
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

/**
 * Sync all connected platforms
 */
export async function syncAllPlatforms(req, res) {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }

        const platforms = await PlatformAccount.find({ user: userId });

        if (platforms.length === 0) {
            return res.json({
                success: true,
                data: [],
                message: 'No platforms to sync'
            });
        }

        // Fetch data for all platforms
        const accounts = platforms.map(p => ({
            platform: p.platform,
            username: p.platform_username
        }));

        const results = await fetchMultiplePlatformProfiles(accounts);

        // Update stored data
        const updatedPlatforms = [];
        for (let i = 0; i < platforms.length; i++) {
            const result = results[i];
            if (result.success) {
                platforms[i].last_synced_at = new Date();
                platforms[i].profile_data = result.data;
                await platforms[i].save();
            }
            updatedPlatforms.push({
                id: platforms[i]._id,
                platform: platforms[i].platform,
                platformUsername: platforms[i].platform_username,
                isVerified: platforms[i].is_verified,
                lastSyncedAt: platforms[i].last_synced_at,
                profileData: platforms[i].profile_data,
            });
        }

        res.json({
            success: true,
            data: updatedPlatforms
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

/**
 * Get submissions from a specific platform
 */
export async function getPlatformSubmissions(req, res) {
    try {
        const { platformId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }

        const platform = await PlatformAccount.findOne({ _id: platformId, user: userId });

        if (!platform) {
            return res.status(404).json({
                success: false,
                error: 'Platform not found'
            });
        }

        // Return cached submissions from profile data
        const submissions = platform.profile_data?.recentSubmissions || [];

        res.json({
            success: true,
            data: submissions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

/**
 * Get contest history from a specific platform
 */
export async function getPlatformContests(req, res) {
    try {
        const { platformId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }

        const platform = await PlatformAccount.findOne({ _id: platformId, user: userId });

        if (!platform) {
            return res.status(404).json({
                success: false,
                error: 'Platform not found'
            });
        }

        // Return cached contest history from profile data
        const contests = platform.profile_data?.contestHistory ||
            platform.profile_data?.ratingHistory || [];

        res.json({
            success: true,
            data: contests
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

/**
 * Test endpoint - fetch data for a platform without saving
 */
export async function testPlatform(req, res) {
    try {
        const { platform } = req.params;
        const { username } = req.query;

        if (!username) {
            return res.status(400).json({
                success: false,
                error: 'Username query parameter is required'
            });
        }

        if (!SUPPORTED_PLATFORMS[platform]) {
            return res.status(400).json({
                success: false,
                error: `Unsupported platform: ${platform}`
            });
        }

        const result = await fetchPlatformProfile(platform, username);

        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

/**
 * Get list of supported platforms
 */
export async function getSupportedPlatforms(req, res) {
    res.json({
        success: true,
        data: Object.values(SUPPORTED_PLATFORMS)
    });
}
