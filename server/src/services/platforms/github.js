/**
 * GitHub API Service
 * Official REST API: https://docs.github.com/en/rest
 */

import axios from 'axios';

const BASE_URL = 'https://api.github.com';

// Create axios instance with default headers
const githubApi = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Accept': 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28',
    },
    timeout: 10000,
});

// Add auth token if available
if (process.env.GITHUB_TOKEN) {
    githubApi.defaults.headers.common['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
}

/**
 * Get user profile information
 * @param {string} username - GitHub username
 */
export async function getUserProfile(username) {
    try {
        const response = await githubApi.get(`/users/${username}`);
        const user = response.data;

        return {
            success: true,
            data: {
                username: user.login,
                name: user.name,
                avatar: user.avatar_url,
                bio: user.bio,
                company: user.company,
                location: user.location,
                blog: user.blog,
                publicRepos: user.public_repos,
                publicGists: user.public_gists,
                followers: user.followers,
                following: user.following,
                createdAt: user.created_at,
                updatedAt: user.updated_at,
            }
        };
    } catch (error) {
        if (error.response?.status === 404) {
            return { success: false, error: 'User not found' };
        }
        return {
            success: false,
            error: error.message || 'Failed to fetch GitHub profile'
        };
    }
}

/**
 * Get user repositories with star counts
 * @param {string} username - GitHub username
 * @param {number} perPage - Number of repos per page
 */
export async function getUserRepos(username, perPage = 100) {
    try {
        const response = await githubApi.get(`/users/${username}/repos`, {
            params: {
                per_page: perPage,
                sort: 'updated',
                direction: 'desc',
            }
        });

        const repos = response.data;
        const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
        const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);

        // Get language breakdown
        const languages = {};
        repos.forEach(repo => {
            if (repo.language) {
                languages[repo.language] = (languages[repo.language] || 0) + 1;
            }
        });

        return {
            success: true,
            data: {
                repos: repos.map(r => ({
                    name: r.name,
                    fullName: r.full_name,
                    description: r.description,
                    stars: r.stargazers_count,
                    forks: r.forks_count,
                    language: r.language,
                    url: r.html_url,
                    updatedAt: r.updated_at,
                })),
                totalStars,
                totalForks,
                languages,
                repoCount: repos.length,
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error.message || 'Failed to fetch repositories'
        };
    }
}

/**
 * Get user contribution statistics (requires authenticated API for full data)
 * For public access, we can get event activity
 * @param {string} username - GitHub username
 */
export async function getUserActivity(username) {
    try {
        const response = await githubApi.get(`/users/${username}/events/public`, {
            params: { per_page: 100 }
        });

        const events = response.data;
        const last30Days = new Date();
        last30Days.setDate(last30Days.getDate() - 30);

        // Count contributions in last 30 days
        const recentEvents = events.filter(e => new Date(e.created_at) > last30Days);

        // Count by type
        const pushEvents = recentEvents.filter(e => e.type === 'PushEvent').length;
        const prEvents = recentEvents.filter(e => e.type === 'PullRequestEvent').length;
        const issueEvents = recentEvents.filter(e => e.type === 'IssuesEvent').length;

        return {
            success: true,
            data: {
                totalRecentEvents: recentEvents.length,
                pushEvents,
                pullRequestEvents: prEvents,
                issueEvents,
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error.message || 'Failed to fetch activity'
        };
    }
}

/**
 * Get complete user profile
 * @param {string} username - GitHub username
 */
export async function getFullProfile(username) {
    const [profile, repos, activity] = await Promise.all([
        getUserProfile(username),
        getUserRepos(username),
        getUserActivity(username),
    ]);

    if (!profile.success) {
        return profile;
    }

    return {
        success: true,
        platform: 'github',
        data: {
            ...profile.data,
            totalStars: repos.success ? repos.data.totalStars : 0,
            totalForks: repos.success ? repos.data.totalForks : 0,
            languages: repos.success ? repos.data.languages : {},
            recentContributions: activity.success ? activity.data.totalRecentEvents : 0,
            topRepos: repos.success ? repos.data.repos.slice(0, 5) : [],
        }
    };
}

export default {
    getUserProfile,
    getUserRepos,
    getUserActivity,
    getFullProfile,
};
