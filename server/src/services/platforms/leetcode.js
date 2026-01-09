/**
 * LeetCode API Service
 * Unofficial GraphQL API
 */

import axios from 'axios';

const GRAPHQL_URL = 'https://leetcode.com/graphql';

// GraphQL queries
const USER_PROFILE_QUERY = `
query getUserProfile($username: String!) {
    matchedUser(username: $username) {
        username
        profile {
            realName
            userAvatar
            ranking
            reputation
        }
        submitStatsGlobal {
            acSubmissionNum {
                difficulty
                count
            }
        }
        badges {
            name
            icon
        }
    }
}`;

const USER_CONTEST_RANKING_QUERY = `
query userContestRankingInfo($username: String!) {
    userContestRanking(username: $username) {
        attendedContestsCount
        rating
        globalRanking
        topPercentage
    }
    userContestRankingHistory(username: $username) {
        attended
        rating
        ranking
        contest {
            title
            startTime
        }
    }
}`;

const RECENT_SUBMISSIONS_QUERY = `
query recentSubmissions($username: String!, $limit: Int!) {
    recentSubmissionList(username: $username, limit: $limit) {
        title
        titleSlug
        timestamp
        statusDisplay
        lang
    }
}`;

/**
 * Execute a GraphQL query against LeetCode
 */
async function executeQuery(query, variables) {
    try {
        const response = await axios.post(GRAPHQL_URL, {
            query,
            variables
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Referer': 'https://leetcode.com',
                'Origin': 'https://leetcode.com',
            }
        });

        if (response.data.errors) {
            throw new Error(response.data.errors[0]?.message || 'GraphQL error');
        }

        return { success: true, data: response.data.data };
    } catch (error) {
        return {
            success: false,
            error: error.message || 'Failed to fetch from LeetCode'
        };
    }
}

/**
 * Get user profile information
 * @param {string} username - LeetCode username
 */
export async function getUserProfile(username) {
    const result = await executeQuery(USER_PROFILE_QUERY, { username });

    if (!result.success) return result;

    const user = result.data.matchedUser;
    if (!user) {
        return { success: false, error: 'User not found' };
    }

    // Parse submission stats
    const stats = user.submitStatsGlobal?.acSubmissionNum || [];
    const problemCounts = { easy: 0, medium: 0, hard: 0, total: 0 };

    stats.forEach(stat => {
        if (stat.difficulty === 'Easy') problemCounts.easy = stat.count;
        else if (stat.difficulty === 'Medium') problemCounts.medium = stat.count;
        else if (stat.difficulty === 'Hard') problemCounts.hard = stat.count;
        else if (stat.difficulty === 'All') problemCounts.total = stat.count;
    });

    return {
        success: true,
        data: {
            username: user.username,
            realName: user.profile?.realName,
            avatar: user.profile?.userAvatar,
            ranking: user.profile?.ranking,
            reputation: user.profile?.reputation,
            problemsSolved: problemCounts.total,
            easy: problemCounts.easy,
            medium: problemCounts.medium,
            hard: problemCounts.hard,
            badges: user.badges || [],
        }
    };
}

/**
 * Get user contest ranking info
 * @param {string} username - LeetCode username
 */
export async function getUserContestInfo(username) {
    const result = await executeQuery(USER_CONTEST_RANKING_QUERY, { username });

    if (!result.success) return result;

    const ranking = result.data.userContestRanking;
    const history = result.data.userContestRankingHistory || [];

    return {
        success: true,
        data: {
            rating: ranking?.rating || 0,
            globalRanking: ranking?.globalRanking,
            topPercentage: ranking?.topPercentage,
            contestsAttended: ranking?.attendedContestsCount || 0,
            contestHistory: history.filter(c => c.attended).map(c => ({
                contestName: c.contest.title,
                rating: c.rating,
                ranking: c.ranking,
                startTime: c.contest.startTime,
            })),
        }
    };
}

/**
 * Get recent submissions
 * @param {string} username - LeetCode username
 * @param {number} limit - Number of submissions to fetch
 */
export async function getRecentSubmissions(username, limit = 20) {
    const result = await executeQuery(RECENT_SUBMISSIONS_QUERY, { username, limit });

    if (!result.success) return result;

    const submissions = result.data.recentSubmissionList || [];

    return {
        success: true,
        data: {
            submissions: submissions.map(sub => ({
                title: sub.title,
                titleSlug: sub.titleSlug,
                timestamp: sub.timestamp,
                status: sub.statusDisplay,
                language: sub.lang,
                url: `https://leetcode.com/problems/${sub.titleSlug}/`,
            })),
        }
    };
}

/**
 * Get complete user profile with all data
 * @param {string} username - LeetCode username
 */
export async function getFullProfile(username) {
    const [profile, contestInfo, submissions] = await Promise.all([
        getUserProfile(username),
        getUserContestInfo(username),
        getRecentSubmissions(username, 20),
    ]);

    if (!profile.success) {
        return profile;
    }

    return {
        success: true,
        platform: 'leetcode',
        data: {
            ...profile.data,
            rating: contestInfo.success ? contestInfo.data.rating : 0,
            contestsParticipated: contestInfo.success ? contestInfo.data.contestsAttended : 0,
            contestHistory: contestInfo.success ? contestInfo.data.contestHistory : [],
            recentSubmissions: submissions.success ? submissions.data.submissions : [],
        }
    };
}

export default {
    getUserProfile,
    getUserContestInfo,
    getRecentSubmissions,
    getFullProfile,
};
