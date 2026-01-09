// Platform definitions with metadata
export const PLATFORMS = {
    codeforces: {
        id: 'codeforces',
        name: 'Codeforces',
        color: '#1890ff',
        icon: 'codeforces',
        hasRating: true,
        hasContests: true,
        apiType: 'REST',
    },
    leetcode: {
        id: 'leetcode',
        name: 'LeetCode',
        color: '#ffa116',
        icon: 'leetcode',
        hasRating: true,
        hasContests: true,
        apiType: 'GraphQL',
    },
    codechef: {
        id: 'codechef',
        name: 'CodeChef',
        color: '#5b4638',
        icon: 'codechef',
        hasRating: true,
        hasContests: true,
        apiType: 'REST',
    },
    atcoder: {
        id: 'atcoder',
        name: 'AtCoder',
        color: '#222222',
        icon: 'atcoder',
        hasRating: true,
        hasContests: true,
        apiType: 'REST',
    },
    kattis: {
        id: 'kattis',
        name: 'Kattis',
        color: '#00a651',
        icon: 'kattis',
        hasRating: true,
        hasContests: false,
        apiType: 'REST',
    },
    github: {
        id: 'github',
        name: 'GitHub',
        color: '#24292f',
        icon: 'github',
        hasRating: false,
        hasContests: false,
        apiType: 'REST/GraphQL',
    },
    gitlab: {
        id: 'gitlab',
        name: 'GitLab',
        color: '#fc6d26',
        icon: 'gitlab',
        hasRating: false,
        hasContests: false,
        apiType: 'REST',
    },
    kaggle: {
        id: 'kaggle',
        name: 'Kaggle',
        color: '#20beff',
        icon: 'kaggle',
        hasRating: true,
        hasContests: true,
        apiType: 'REST',
    },
    stackoverflow: {
        id: 'stackoverflow',
        name: 'Stack Overflow',
        color: '#f48024',
        icon: 'stackoverflow',
        hasRating: true,
        hasContests: false,
        apiType: 'REST',
    },
};

// Difficulty levels
export const DIFFICULTIES = {
    easy: { label: 'Easy', color: '#22c55e' },
    medium: { label: 'Medium', color: '#f59e0b' },
    hard: { label: 'Hard', color: '#ef4444' },
};

// Problem status
export const PROBLEM_STATUS = {
    solved: { label: 'Solved', color: '#22c55e' },
    attempted: { label: 'Attempted', color: '#f59e0b' },
    unsolved: { label: 'Unsolved', color: '#64748b' },
};

// Navigation items
export const NAV_ITEMS = [
    { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/platforms', label: 'Platforms', icon: 'Link' },
    { path: '/problems', label: 'Problems', icon: 'Code2' },
    { path: '/analytics', label: 'Analytics', icon: 'BarChart3' },
    { path: '/settings', label: 'Settings', icon: 'Settings' },
];

// Social platforms
export const SOCIAL_PLATFORMS = [
    { id: 'twitter', name: 'Twitter', icon: 'Twitter' },
    { id: 'linkedin', name: 'LinkedIn', icon: 'Linkedin' },
    { id: 'website', name: 'Website', icon: 'Globe' },
];

// Skill categories
export const SKILL_CATEGORIES = [
    'Data Structures',
    'Algorithms',
    'Dynamic Programming',
    'Graph Theory',
    'Mathematics',
    'String Manipulation',
    'Tree',
    'Binary Search',
    'Greedy',
    'Recursion',
    'Bit Manipulation',
    'Sorting',
    'Hashing',
    'Two Pointers',
    'Sliding Window',
];

// Rating tiers for platforms
export const RATING_TIERS = {
    codeforces: [
        { min: 0, max: 1199, label: 'Newbie', color: '#808080' },
        { min: 1200, max: 1399, label: 'Pupil', color: '#008000' },
        { min: 1400, max: 1599, label: 'Specialist', color: '#03a89e' },
        { min: 1600, max: 1899, label: 'Expert', color: '#0000ff' },
        { min: 1900, max: 2099, label: 'Candidate Master', color: '#aa00aa' },
        { min: 2100, max: 2299, label: 'Master', color: '#ff8c00' },
        { min: 2300, max: 2399, label: 'International Master', color: '#ff8c00' },
        { min: 2400, max: 2599, label: 'Grandmaster', color: '#ff0000' },
        { min: 2600, max: 2899, label: 'International Grandmaster', color: '#ff0000' },
        { min: 2900, max: 9999, label: 'Legendary Grandmaster', color: '#ff0000' },
    ],
    leetcode: [
        { min: 0, max: 1399, label: 'Beginner', color: '#5cb85c' },
        { min: 1400, max: 1599, label: 'Intermediate', color: '#f0ad4e' },
        { min: 1600, max: 1899, label: 'Advanced', color: '#5bc0de' },
        { min: 1900, max: 2099, label: 'Knight', color: '#aa6600' },
        { min: 2100, max: 2399, label: 'Guardian', color: '#6f42c1' },
        { min: 2400, max: 9999, label: 'Master', color: '#d9534f' },
    ],
};

// Chart colors
export const CHART_COLORS = {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    tertiary: '#a855f7',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    muted: '#64748b',
};

// Date format options
export const DATE_FORMATS = {
    short: { month: 'short', day: 'numeric' },
    medium: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { month: 'long', day: 'numeric', year: 'numeric' },
    full: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
};
