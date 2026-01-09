/**
 * Platform Controller
 * Handles all platform-related API endpoints
 */

import { fetchPlatformProfile, fetchMultiplePlatformProfiles, SUPPORTED_PLATFORMS } from '../services/platforms/index.js';

// In-memory store for demo (replace with database in production)
const userPlatforms = new Map();

/**
 * Get all connected platforms for current user
 */
export async function getConnectedPlatforms(req, res) {
    try {
        const userId = req.user?.id || 'demo_user';
        const platforms = userPlatforms.get(userId) || [];

        res.json({
            success: true,
            data: platforms
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
        const userId = req.user?.id || 'demo_user';

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

        // Store the connected platform
        const userPlatformList = userPlatforms.get(userId) || [];

        // Check if already connected
        const existingIndex = userPlatformList.findIndex(p => p.platform === platform);

        const platformData = {
            id: `${platform}_${Date.now()}`,
            platform,
            platformUsername: username,
            isVerified: true,
            lastSyncedAt: new Date().toISOString(),
            profileData: result.data,
        };

        if (existingIndex >= 0) {
            userPlatformList[existingIndex] = platformData;
        } else {
            userPlatformList.push(platformData);
        }

        userPlatforms.set(userId, userPlatformList);

        res.json({
            success: true,
            data: platformData
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
        const userId = req.user?.id || 'demo_user';

        const userPlatformList = userPlatforms.get(userId) || [];
        const filtered = userPlatformList.filter(p => p.id !== platformId);

        userPlatforms.set(userId, filtered);

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
        const userId = req.user?.id || 'demo_user';

        const userPlatformList = userPlatforms.get(userId) || [];
        const platformIndex = userPlatformList.findIndex(p => p.id === platformId);

        if (platformIndex < 0) {
            return res.status(404).json({
                success: false,
                error: 'Platform not found'
            });
        }

        const platform = userPlatformList[platformIndex];

        // Fetch fresh data from the platform API
        const result = await fetchPlatformProfile(platform.platform, platform.platformUsername);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                error: result.error || 'Failed to sync platform data'
            });
        }

        // Update the stored data
        userPlatformList[platformIndex] = {
            ...platform,
            lastSyncedAt: new Date().toISOString(),
            profileData: result.data,
        };

        userPlatforms.set(userId, userPlatformList);

        res.json({
            success: true,
            data: userPlatformList[platformIndex]
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
        const userId = req.user?.id || 'demo_user';
        const userPlatformList = userPlatforms.get(userId) || [];

        if (userPlatformList.length === 0) {
            return res.json({
                success: true,
                data: [],
                message: 'No platforms to sync'
            });
        }

        // Fetch data for all platforms
        const accounts = userPlatformList.map(p => ({
            platform: p.platform,
            username: p.platformUsername
        }));

        const results = await fetchMultiplePlatformProfiles(accounts);

        // Update stored data
        const updatedList = userPlatformList.map((platform, index) => {
            const result = results[index];
            if (result.success) {
                return {
                    ...platform,
                    lastSyncedAt: new Date().toISOString(),
                    profileData: result.data,
                };
            }
            return platform;
        });

        userPlatforms.set(userId, updatedList);

        res.json({
            success: true,
            data: updatedList
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
        const userId = req.user?.id || 'demo_user';

        const userPlatformList = userPlatforms.get(userId) || [];
        const platform = userPlatformList.find(p => p.id === platformId);

        if (!platform) {
            return res.status(404).json({
                success: false,
                error: 'Platform not found'
            });
        }

        // Return cached submissions from profile data
        const submissions = platform.profileData?.recentSubmissions || [];

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
        const userId = req.user?.id || 'demo_user';

        const userPlatformList = userPlatforms.get(userId) || [];
        const platform = userPlatformList.find(p => p.id === platformId);

        if (!platform) {
            return res.status(404).json({
                success: false,
                error: 'Platform not found'
            });
        }

        // Return cached contest history from profile data
        const contests = platform.profileData?.contestHistory ||
            platform.profileData?.ratingHistory || [];

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
