import { DATE_FORMATS, RATING_TIERS } from './constants';

/**
 * Format a number with commas for thousands
 */
export const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    return num.toLocaleString();
};

/**
 * Format a date to a readable string
 */
export const formatDate = (date, format = 'medium') => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', DATE_FORMATS[format]);
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date) => {
    if (!date) return '';
    const now = new Date();
    const d = new Date(date);
    const diff = now - d;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
    if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
};

/**
 * Format percentage
 */
export const formatPercentage = (value, decimals = 1) => {
    if (value === null || value === undefined) return '0%';
    return `${value.toFixed(decimals)}%`;
};

/**
 * Get rating tier info for a platform
 */
export const getRatingTier = (platform, rating) => {
    const tiers = RATING_TIERS[platform];
    if (!tiers) return { label: 'Unrated', color: '#64748b' };

    const tier = tiers.find(t => rating >= t.min && rating <= t.max);
    return tier || { label: 'Unrated', color: '#64748b' };
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 50) => {
    if (!text || text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
};

/**
 * Generate initials from name
 */
export const getInitials = (name) => {
    if (!name) return '';
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

/**
 * Calculate streak from daily activity data
 */
export const calculateStreak = (dailyStats) => {
    if (!dailyStats || dailyStats.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = 0;
    const sortedStats = [...dailyStats].sort((a, b) => new Date(b.date) - new Date(a.date));

    for (let i = 0; i < sortedStats.length; i++) {
        const statDate = new Date(sortedStats[i].date);
        statDate.setHours(0, 0, 0, 0);

        const expectedDate = new Date(today);
        expectedDate.setDate(expectedDate.getDate() - i);

        if (statDate.getTime() === expectedDate.getTime() && sortedStats[i].problemsSolved > 0) {
            streak++;
        } else if (i === 0 && statDate.getTime() === expectedDate.getTime() - 86400000 && sortedStats[i].problemsSolved > 0) {
            // Allow for checking yesterday if today hasn't been active yet
            streak++;
        } else {
            break;
        }
    }

    return streak;
};

/**
 * Format duration in minutes to readable format
 */
export const formatDuration = (minutes) => {
    if (!minutes) return '0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
};

/**
 * Get color class for difficulty
 */
export const getDifficultyColor = (difficulty) => {
    const colors = {
        easy: 'text-green-500',
        medium: 'text-yellow-500',
        hard: 'text-red-500',
    };
    return colors[difficulty?.toLowerCase()] || 'text-gray-500';
};

/**
 * Get background color class for difficulty
 */
export const getDifficultyBgColor = (difficulty) => {
    const colors = {
        easy: 'bg-green-500/20 text-green-400',
        medium: 'bg-yellow-500/20 text-yellow-400',
        hard: 'bg-red-500/20 text-red-400',
    };
    return colors[difficulty?.toLowerCase()] || 'bg-gray-500/20 text-gray-400';
};

/**
 * Generate a random ID
 */
export const generateId = () => {
    return Math.random().toString(36).substring(2, 15);
};

/**
 * Debounce function
 */
export const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
};

/**
 * Calculate consistency score based on weekly activity
 */
export const calculateConsistencyScore = (dailyStats, weeks = 4) => {
    if (!dailyStats || dailyStats.length === 0) return 0;

    const daysToCheck = weeks * 7;
    const today = new Date();
    let activeDays = 0;

    for (let i = 0; i < daysToCheck; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        const dateStr = checkDate.toISOString().split('T')[0];

        const stat = dailyStats.find(s => s.date === dateStr);
        if (stat && stat.problemsSolved > 0) {
            activeDays++;
        }
    }

    return Math.round((activeDays / daysToCheck) * 100);
};
