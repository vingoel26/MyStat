/**
 * CodeChef API Service
 * Using community API: competitive-rating.vercel.app
 */

import axios from 'axios';

const BASE_URL = 'https://competitive-rating.vercel.app';

/**
 * Get user profile information
 * @param {string} username - CodeChef username
 */
export async function getUserInfo(username) {
    try {
        const response = await axios.get(`${BASE_URL}/codechef/${username}`, {
            timeout: 10000
        });

        const data = response.data;

        if (!data || data.error) {
            return {
                success: false,
                error: data?.error || 'User not found'
            };
        }

        return {
            success: true,
            data: {
                username: data.username || username,
                avatar: data.avatar,
                rating: data.rating || 0,
                stars: data.stars || 0,
                globalRank: data.global_rank,
                countryRank: data.country_rank,
                country: data.country,
                puzzleRating: data.puzzle_rating,
                oneVsOneRating: data['1v1_rating'],
                contestsParticipated: data.participation_count || 0,
                completelySolved: data.completely_solved || 0,
                partiallySolved: data.partially_solved || 0,
                problemsSolved: (data.completely_solved || 0) + (data.partially_solved || 0),
                ratingColor: data.rating_color,
            }
        };
    } catch (error) {
        // Try fallback approach - direct CodeChef scraping might be needed
        return {
            success: false,
            error: error.message || 'Failed to fetch CodeChef data'
        };
    }
}

/**
 * Get complete user profile
 * @param {string} username - CodeChef username
 */
export async function getFullProfile(username) {
    const result = await getUserInfo(username);

    if (!result.success) {
        return result;
    }

    return {
        success: true,
        platform: 'codechef',
        data: result.data
    };
}

export default {
    getUserInfo,
    getFullProfile,
};
