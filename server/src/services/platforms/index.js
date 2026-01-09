/**
 * Platform Services Index
 * Unified export and factory for all platform API services
 */

import * as codeforces from './codeforces.js';
import * as leetcode from './leetcode.js';
import * as codechef from './codechef.js';
import * as atcoder from './atcoder.js';
import * as github from './github.js';
import * as stackoverflow from './stackoverflow.js';

// Export individual services
export {
    codeforces,
    leetcode,
    codechef,
    atcoder,
    github,
    stackoverflow,
};

// Platform service map
const platformServices = {
    codeforces,
    leetcode,
    codechef,
    atcoder,
    github,
    stackoverflow,
};

/**
 * Get platform service by platform ID
 * @param {string} platformId - Platform identifier
 */
export function getPlatformService(platformId) {
    const service = platformServices[platformId];
    if (!service) {
        throw new Error(`Unknown platform: ${platformId}`);
    }
    return service;
}

/**
 * Fetch profile data for a given platform and username
 * @param {string} platformId - Platform identifier
 * @param {string} username - Username on the platform
 */
export async function fetchPlatformProfile(platformId, username) {
    try {
        const service = getPlatformService(platformId);
        return await service.getFullProfile(username);
    } catch (error) {
        return {
            success: false,
            error: error.message || `Failed to fetch data from ${platformId}`
        };
    }
}

/**
 * Batch fetch profiles from multiple platforms
 * @param {Array<{platform: string, username: string}>} accounts
 */
export async function fetchMultiplePlatformProfiles(accounts) {
    const results = await Promise.allSettled(
        accounts.map(account =>
            fetchPlatformProfile(account.platform, account.username)
        )
    );

    return results.map((result, index) => {
        if (result.status === 'fulfilled') {
            return {
                platform: accounts[index].platform,
                ...result.value
            };
        }
        return {
            platform: accounts[index].platform,
            success: false,
            error: result.reason?.message || 'Unknown error'
        };
    });
}

// Supported platforms metadata
export const SUPPORTED_PLATFORMS = {
    codeforces: {
        id: 'codeforces',
        name: 'Codeforces',
        apiType: 'official',
        hasRating: true,
        hasContests: true,
        hasSubmissions: true,
    },
    leetcode: {
        id: 'leetcode',
        name: 'LeetCode',
        apiType: 'unofficial',
        hasRating: true,
        hasContests: true,
        hasSubmissions: true,
    },
    codechef: {
        id: 'codechef',
        name: 'CodeChef',
        apiType: 'unofficial',
        hasRating: true,
        hasContests: true,
        hasSubmissions: false,
    },
    atcoder: {
        id: 'atcoder',
        name: 'AtCoder',
        apiType: 'unofficial',
        hasRating: true,
        hasContests: true,
        hasSubmissions: false,
    },
    github: {
        id: 'github',
        name: 'GitHub',
        apiType: 'official',
        hasRating: false,
        hasContests: false,
        hasSubmissions: false,
    },
    stackoverflow: {
        id: 'stackoverflow',
        name: 'Stack Overflow',
        apiType: 'official',
        hasRating: false,
        hasContests: false,
        hasSubmissions: false,
    },
};

export default {
    getPlatformService,
    fetchPlatformProfile,
    fetchMultiplePlatformProfiles,
    SUPPORTED_PLATFORMS,
};
