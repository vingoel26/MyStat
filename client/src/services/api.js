/**
 * API Service Layer
 * Handles all communication with the backend API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Make an API request
 */
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `HTTP ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error(`API Error [${endpoint}]:`, error);
        throw error;
    }
}

/**
 * Platform API endpoints
 */
export const platformApi = {
    /**
     * Get all connected platforms
     */
    getConnected: () => apiRequest('/platforms'),

    /**
     * Connect a new platform
     */
    connect: (platform, username) =>
        apiRequest('/platforms', {
            method: 'POST',
            body: JSON.stringify({ platform, username }),
        }),

    /**
     * Disconnect a platform
     */
    disconnect: (platformId) =>
        apiRequest(`/platforms/${platformId}`, {
            method: 'DELETE',
        }),

    /**
     * Sync a single platform
     */
    sync: (platformId) =>
        apiRequest(`/platforms/${platformId}/sync`, {
            method: 'POST',
        }),

    /**
     * Sync all platforms
     */
    syncAll: () =>
        apiRequest('/platforms/sync-all', {
            method: 'POST',
        }),

    /**
     * Get submissions for a platform
     */
    getSubmissions: (platformId) =>
        apiRequest(`/platforms/${platformId}/submissions`),

    /**
     * Get contest history for a platform
     */
    getContests: (platformId) =>
        apiRequest(`/platforms/${platformId}/contests`),

    /**
     * Get list of supported platforms
     */
    getSupported: () => apiRequest('/platforms/supported'),

    /**
     * Test platform API (for debugging)
     */
    test: (platform, username) =>
        apiRequest(`/platforms/${platform}/test?username=${encodeURIComponent(username)}`),
};

/**
 * Auth API endpoints
 */
export const authApi = {
    login: (email, password) =>
        apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),

    signup: (name, email, password) =>
        apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
        }),

    logout: () =>
        apiRequest('/auth/logout', {
            method: 'POST',
        }),

    getMe: () => apiRequest('/auth/me'),
};

/**
 * User API endpoints
 */
export const userApi = {
    getProfile: () => apiRequest('/users/me'),

    updateProfile: (updates) =>
        apiRequest('/users/me', {
            method: 'PATCH',
            body: JSON.stringify(updates),
        }),

    getPublicProfile: (username) =>
        apiRequest(`/users/${username}`),

    getPublicStats: (username) =>
        apiRequest(`/users/${username}/stats`),

    getPublicPlatforms: (username) =>
        apiRequest(`/users/${username}/platforms`),

    getPublicAchievements: (username) =>
        apiRequest(`/users/${username}/achievements`),
};

/**
 * Analytics API endpoints
 */
export const analyticsApi = {
    getSummary: () => apiRequest('/analytics/summary'),
    getHeatmap: () => apiRequest('/analytics/heatmap'),
    getTopicBreakdown: () => apiRequest('/analytics/topics'),
    getRatingHistory: () => apiRequest('/analytics/ratings'),
};

export default {
    platformApi,
    authApi,
    userApi,
    analyticsApi,
};
