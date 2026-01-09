/**
 * Codeforces API Service
 * Official API: https://codeforces.com/apiHelp
 */

import axios from 'axios';

const BASE_URL = 'https://codeforces.com/api';

// Rate limit: 5 requests per second
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get user profile information
 * @param {string} handle - Codeforces handle
 */
export async function getUserInfo(handle) {
    try {
        const response = await axios.get(`${BASE_URL}/user.info`, {
            params: { handles: handle }
        });

        if (response.data.status !== 'OK') {
            throw new Error(response.data.comment || 'Failed to fetch user info');
        }

        const user = response.data.result[0];
        return {
            success: true,
            data: {
                handle: user.handle,
                rating: user.rating || 0,
                maxRating: user.maxRating || 0,
                rank: user.rank || 'unrated',
                maxRank: user.maxRank || 'unrated',
                contribution: user.contribution || 0,
                friendOfCount: user.friendOfCount || 0,
                avatar: user.avatar,
                titlePhoto: user.titlePhoto,
                organization: user.organization,
                country: user.country,
                city: user.city,
                registrationTimeSeconds: user.registrationTimeSeconds,
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.comment || error.message
        };
    }
}

/**
 * Get user submissions
 * @param {string} handle - Codeforces handle
 * @param {number} count - Number of submissions to fetch (default: 100)
 */
export async function getUserSubmissions(handle, count = 100) {
    try {
        await delay(200); // Rate limiting

        const response = await axios.get(`${BASE_URL}/user.status`, {
            params: { handle, count }
        });

        if (response.data.status !== 'OK') {
            throw new Error(response.data.comment || 'Failed to fetch submissions');
        }

        const submissions = response.data.result.map(sub => ({
            id: sub.id,
            contestId: sub.contestId,
            problemId: `${sub.contestId}${sub.problem.index}`,
            problemName: sub.problem.name,
            problemRating: sub.problem.rating,
            tags: sub.problem.tags || [],
            verdict: sub.verdict,
            programmingLanguage: sub.programmingLanguage,
            timeConsumedMillis: sub.timeConsumedMillis,
            memoryConsumedBytes: sub.memoryConsumedBytes,
            creationTimeSeconds: sub.creationTimeSeconds,
        }));

        // Count unique solved problems
        const solvedProblems = new Set();
        submissions.forEach(sub => {
            if (sub.verdict === 'OK') {
                solvedProblems.add(sub.problemId);
            }
        });

        return {
            success: true,
            data: {
                submissions,
                problemsSolved: solvedProblems.size,
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.comment || error.message
        };
    }
}

/**
 * Get user rating history (contest history)
 * @param {string} handle - Codeforces handle
 */
export async function getUserRatingHistory(handle) {
    try {
        await delay(200); // Rate limiting

        const response = await axios.get(`${BASE_URL}/user.rating`, {
            params: { handle }
        });

        if (response.data.status !== 'OK') {
            throw new Error(response.data.comment || 'Failed to fetch rating history');
        }

        const contests = response.data.result.map(contest => ({
            contestId: contest.contestId,
            contestName: contest.contestName,
            rank: contest.rank,
            oldRating: contest.oldRating,
            newRating: contest.newRating,
            ratingChange: contest.newRating - contest.oldRating,
            ratingUpdateTimeSeconds: contest.ratingUpdateTimeSeconds,
        }));

        return {
            success: true,
            data: {
                contests,
                totalContests: contests.length,
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.comment || error.message
        };
    }
}

/**
 * Get complete user profile with all data
 * @param {string} handle - Codeforces handle
 */
export async function getFullProfile(handle) {
    const [userInfo, submissions, ratingHistory] = await Promise.all([
        getUserInfo(handle),
        getUserSubmissions(handle, 1000),
        getUserRatingHistory(handle),
    ]);

    if (!userInfo.success) {
        return userInfo; // Return the error
    }

    return {
        success: true,
        platform: 'codeforces',
        data: {
            ...userInfo.data,
            problemsSolved: submissions.success ? submissions.data.problemsSolved : 0,
            contestsParticipated: ratingHistory.success ? ratingHistory.data.totalContests : 0,
            recentSubmissions: submissions.success ? submissions.data.submissions.slice(0, 20) : [],
            ratingHistory: ratingHistory.success ? ratingHistory.data.contests : [],
        }
    };
}

export default {
    getUserInfo,
    getUserSubmissions,
    getUserRatingHistory,
    getFullProfile,
};
