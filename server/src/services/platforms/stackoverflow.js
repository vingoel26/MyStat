/**
 * Stack Overflow API Service
 * Official Stack Exchange API: https://api.stackexchange.com/docs
 */

import axios from 'axios';

const BASE_URL = 'https://api.stackexchange.com/2.3';

/**
 * Search for user by display name
 * @param {string} displayName - Stack Overflow display name
 */
export async function searchUserByName(displayName) {
    try {
        const response = await axios.get(`${BASE_URL}/users`, {
            params: {
                site: 'stackoverflow',
                inname: displayName,
                pagesize: 10,
                order: 'desc',
                sort: 'reputation',
                filter: 'default',
                key: process.env.STACKOVERFLOW_API_KEY || undefined,
            },
            timeout: 10000,
        });

        if (!response.data.items || response.data.items.length === 0) {
            return {
                success: false,
                error: 'User not found'
            };
        }

        // Return the first match (highest reputation with matching name)
        const users = response.data.items.map(user => ({
            userId: user.user_id,
            displayName: user.display_name,
            reputation: user.reputation,
            profileImage: user.profile_image,
            link: user.link,
        }));

        return {
            success: true,
            data: { users }
        };
    } catch (error) {
        return {
            success: false,
            error: error.message || 'Failed to search users'
        };
    }
}

/**
 * Get user by ID
 * @param {number} userId - Stack Overflow user ID
 */
export async function getUserById(userId) {
    try {
        const response = await axios.get(`${BASE_URL}/users/${userId}`, {
            params: {
                site: 'stackoverflow',
                filter: '!BTeL*Mkl5YYJnj-h5h1X)6u37N1Zy.',
                key: process.env.STACKOVERFLOW_API_KEY || undefined,
            },
            timeout: 10000,
        });

        if (!response.data.items || response.data.items.length === 0) {
            return {
                success: false,
                error: 'User not found'
            };
        }

        const user = response.data.items[0];

        return {
            success: true,
            data: {
                userId: user.user_id,
                displayName: user.display_name,
                reputation: user.reputation,
                profileImage: user.profile_image,
                link: user.link,
                location: user.location,
                websiteUrl: user.website_url,
                aboutMe: user.about_me,
                creationDate: user.creation_date,
                lastAccessDate: user.last_access_date,
                badgeCounts: {
                    gold: user.badge_counts?.gold || 0,
                    silver: user.badge_counts?.silver || 0,
                    bronze: user.badge_counts?.bronze || 0,
                },
                questionCount: user.question_count || 0,
                answerCount: user.answer_count || 0,
                upVoteCount: user.up_vote_count || 0,
                downVoteCount: user.down_vote_count || 0,
                acceptRate: user.accept_rate,
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error.message || 'Failed to fetch user data'
        };
    }
}

/**
 * Get user's top tags
 * @param {number} userId - Stack Overflow user ID
 */
export async function getUserTopTags(userId) {
    try {
        const response = await axios.get(`${BASE_URL}/users/${userId}/top-tags`, {
            params: {
                site: 'stackoverflow',
                pagesize: 10,
                key: process.env.STACKOVERFLOW_API_KEY || undefined,
            },
            timeout: 10000,
        });

        const tags = (response.data.items || []).map(tag => ({
            tagName: tag.tag_name,
            questionScore: tag.question_score,
            answerScore: tag.answer_score,
            questionCount: tag.question_count,
            answerCount: tag.answer_count,
        }));

        return {
            success: true,
            data: { tags }
        };
    } catch (error) {
        return {
            success: false,
            error: error.message || 'Failed to fetch top tags'
        };
    }
}

/**
 * Get complete user profile by username (display name)
 * This first searches for the user, then fetches full profile
 * @param {string} username - Stack Overflow display name or user ID
 */
export async function getFullProfile(username) {
    // Check if it's a numeric user ID
    const isNumericId = /^\d+$/.test(username);

    let userId;

    if (isNumericId) {
        userId = parseInt(username, 10);
    } else {
        // Search for user by name
        const searchResult = await searchUserByName(username);
        if (!searchResult.success || searchResult.data.users.length === 0) {
            return {
                success: false,
                error: 'User not found. Try using your Stack Overflow user ID instead.'
            };
        }

        // Find exact match or use first result
        const exactMatch = searchResult.data.users.find(
            u => u.displayName.toLowerCase() === username.toLowerCase()
        );
        userId = exactMatch?.userId || searchResult.data.users[0].userId;
    }

    const [userInfo, topTags] = await Promise.all([
        getUserById(userId),
        getUserTopTags(userId),
    ]);

    if (!userInfo.success) {
        return userInfo;
    }

    return {
        success: true,
        platform: 'stackoverflow',
        data: {
            ...userInfo.data,
            topTags: topTags.success ? topTags.data.tags : [],
        }
    };
}

export default {
    searchUserByName,
    getUserById,
    getUserTopTags,
    getFullProfile,
};
