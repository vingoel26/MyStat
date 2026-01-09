/**
 * AtCoder API Service
 * Using AtCoder Problems API (kenkoooo.com) and direct AtCoder endpoints
 */

import axios from 'axios';

const ATCODER_PROBLEMS_API = 'https://kenkoooo.com/atcoder';
const ATCODER_BASE = 'https://atcoder.jp';

/**
 * Get user submission statistics
 * @param {string} username - AtCoder username
 */
export async function getUserStats(username) {
    try {
        // Get AC count for the user
        const response = await axios.get(
            `${ATCODER_PROBLEMS_API}/atcoder-api/v3/user/ac_rank`,
            { params: { user: username }, timeout: 10000 }
        );

        if (!response.data || response.data.count === undefined) {
            return {
                success: false,
                error: 'User not found or no submissions'
            };
        }

        return {
            success: true,
            data: {
                username,
                problemsSolved: response.data.count || 0,
                rank: response.data.rank,
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error.message || 'Failed to fetch AtCoder stats'
        };
    }
}

/**
 * Get user rating/contest history from AtCoder directly
 * @param {string} username - AtCoder username
 */
export async function getContestHistory(username) {
    try {
        const response = await axios.get(
            `${ATCODER_BASE}/users/${username}/history/json`,
            { timeout: 10000 }
        );

        if (!response.data || !Array.isArray(response.data)) {
            return {
                success: true,
                data: { contests: [], currentRating: 0, maxRating: 0 }
            };
        }

        const contests = response.data.map(contest => ({
            contestName: contest.ContestName,
            contestScreenName: contest.ContestScreenName,
            place: contest.Place,
            oldRating: contest.OldRating,
            newRating: contest.NewRating,
            ratingChange: contest.NewRating - contest.OldRating,
            performance: contest.Performance,
            isRated: contest.IsRated,
            endTime: contest.EndTime,
        }));

        // Get current and max rating
        const ratedContests = contests.filter(c => c.isRated);
        const currentRating = ratedContests.length > 0
            ? ratedContests[ratedContests.length - 1].newRating
            : 0;
        const maxRating = ratedContests.length > 0
            ? Math.max(...ratedContests.map(c => c.newRating))
            : 0;

        return {
            success: true,
            data: {
                contests,
                currentRating,
                maxRating,
                contestsParticipated: contests.length,
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error.message || 'Failed to fetch contest history'
        };
    }
}

/**
 * Get AtCoder rank/color based on rating
 */
function getRankFromRating(rating) {
    if (rating >= 2800) return { rank: 'Red', color: '#FF0000' };
    if (rating >= 2400) return { rank: 'Orange', color: '#FF8C00' };
    if (rating >= 2000) return { rank: 'Yellow', color: '#C0C000' };
    if (rating >= 1600) return { rank: 'Blue', color: '#0000FF' };
    if (rating >= 1200) return { rank: 'Cyan', color: '#00C0C0' };
    if (rating >= 800) return { rank: 'Green', color: '#008000' };
    if (rating >= 400) return { rank: 'Brown', color: '#804000' };
    return { rank: 'Gray', color: '#808080' };
}

/**
 * Get complete user profile
 * @param {string} username - AtCoder username
 */
export async function getFullProfile(username) {
    const [stats, contestHistory] = await Promise.all([
        getUserStats(username),
        getContestHistory(username),
    ]);

    if (!stats.success && !contestHistory.success) {
        return {
            success: false,
            error: stats.error || contestHistory.error
        };
    }

    const rating = contestHistory.success ? contestHistory.data.currentRating : 0;
    const rankInfo = getRankFromRating(rating);

    return {
        success: true,
        platform: 'atcoder',
        data: {
            username,
            rating,
            maxRating: contestHistory.success ? contestHistory.data.maxRating : 0,
            rank: rankInfo.rank,
            rankColor: rankInfo.color,
            problemsSolved: stats.success ? stats.data.problemsSolved : 0,
            contestsParticipated: contestHistory.success ? contestHistory.data.contestsParticipated : 0,
            contestHistory: contestHistory.success ? contestHistory.data.contests.slice(-20) : [],
        }
    };
}

export default {
    getUserStats,
    getContestHistory,
    getFullProfile,
};
