// Mock data for development and demo purposes

// Current user profile
export const mockUser = {
    id: 'usr_1234567890',
    email: 'alex.developer@example.com',
    name: 'Alex Developer',
    username: 'alexdev',
    bio: 'Full-stack developer passionate about competitive programming and open source. Love solving algorithmic challenges!',
    avatarUrl: null,
    isPublic: true,
    skills: ['Data Structures', 'Dynamic Programming', 'Graph Theory', 'Binary Search', 'JavaScript', 'Python', 'React'],
    socialLinks: {
        twitter: 'https://twitter.com/alexdev',
        linkedin: 'https://linkedin.com/in/alexdev',
        website: 'https://alexdev.io',
    },
    createdAt: '2023-06-15T10:00:00Z',
    updatedAt: '2024-01-09T12:00:00Z',
};

// Platform connections
export const mockPlatformAccounts = [
    {
        id: 'pa_cf_001',
        platform: 'codeforces',
        platformUsername: 'alex_cf',
        isVerified: true,
        lastSyncedAt: '2024-01-09T10:30:00Z',
        profileData: {
            rating: 1842,
            maxRating: 1956,
            rank: 'Expert',
            problemsSolved: 487,
            contestsParticipated: 45,
            contribution: 12,
        },
    },
    {
        id: 'pa_lc_002',
        platform: 'leetcode',
        platformUsername: 'alexdev',
        isVerified: true,
        lastSyncedAt: '2024-01-09T09:15:00Z',
        profileData: {
            rating: 2156,
            problemsSolved: 623,
            easy: 187,
            medium: 342,
            hard: 94,
            ranking: 12456,
            contestsParticipated: 32,
        },
    },
    {
        id: 'pa_cc_003',
        platform: 'codechef',
        platformUsername: 'alex_chef',
        isVerified: true,
        lastSyncedAt: '2024-01-08T18:00:00Z',
        profileData: {
            rating: 1923,
            maxRating: 2045,
            stars: 5,
            problemsSolved: 234,
            contestsParticipated: 28,
        },
    },
    {
        id: 'pa_ac_004',
        platform: 'atcoder',
        platformUsername: 'alex_atcoder',
        isVerified: false,
        lastSyncedAt: '2024-01-07T14:00:00Z',
        profileData: {
            rating: 1456,
            maxRating: 1567,
            rank: '4 Kyu',
            problemsSolved: 156,
            contestsParticipated: 18,
        },
    },
    {
        id: 'pa_gh_005',
        platform: 'github',
        platformUsername: 'alexdev',
        isVerified: true,
        lastSyncedAt: '2024-01-09T11:00:00Z',
        profileData: {
            publicRepos: 47,
            followers: 1234,
            following: 156,
            totalStars: 2345,
            contributions: 1876,
            streakDays: 45,
        },
    },
    {
        id: 'pa_so_006',
        platform: 'stackoverflow',
        platformUsername: 'alexdev',
        isVerified: true,
        lastSyncedAt: '2024-01-09T08:00:00Z',
        profileData: {
            reputation: 15678,
            goldBadges: 5,
            silverBadges: 34,
            bronzeBadges: 78,
            questionsAsked: 23,
            answersGiven: 156,
        },
    },
];

// Generate sample submissions
const generateSubmissions = () => {
    const platforms = ['codeforces', 'leetcode', 'codechef', 'atcoder'];
    const difficulties = ['easy', 'medium', 'hard'];
    const statuses = ['solved', 'solved', 'solved', 'attempted']; // Higher chance of solved
    const tags = ['Dynamic Programming', 'Graph Theory', 'Binary Search', 'Two Pointers', 'Greedy', 'Trees', 'Arrays', 'Strings', 'Math', 'Hash Table'];

    const problemNames = {
        codeforces: ['Two Sum', 'Binary Search Tree', 'Maximum Subarray', 'Longest Path', 'Coin Change', 'Graph Coloring', 'Segment Tree', 'Lazy Propagation'],
        leetcode: ['Add Two Numbers', 'Median of Sorted Arrays', 'Longest Palindrome', 'Container With Water', 'Valid Parentheses', 'Merge Intervals', 'LRU Cache', 'Word Break'],
        codechef: ['Chef and Strings', 'Subtree Problem', 'Lucky Numbers', 'Matrix Operations', 'Path Finding', 'Chef and Arrays'],
        atcoder: ['Frog Jump', 'Knapsack', 'LCS Problem', 'Digit Sum', 'Vacation Planning', 'Grid Walking'],
    };

    const submissions = [];
    const startDate = new Date('2023-01-01');
    const endDate = new Date('2024-01-09');

    for (let i = 0; i < 150; i++) {
        const platform = platforms[Math.floor(Math.random() * platforms.length)];
        const names = problemNames[platform];
        const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));

        submissions.push({
            id: `sub_${i.toString().padStart(6, '0')}`,
            platform,
            problemId: `${platform.substring(0, 2).toUpperCase()}-${1000 + i}`,
            problemName: names[Math.floor(Math.random() * names.length)] + ` ${Math.floor(Math.random() * 100)}`,
            problemUrl: `https://${platform}.com/problems/${1000 + i}`,
            difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
            status: statuses[Math.floor(Math.random() * statuses.length)],
            language: ['Python', 'C++', 'JavaScript', 'Java'][Math.floor(Math.random() * 4)],
            submittedAt: randomDate.toISOString(),
            tags: [tags[Math.floor(Math.random() * tags.length)], tags[Math.floor(Math.random() * tags.length)]].filter((v, i, a) => a.indexOf(v) === i),
        });
    }

    return submissions.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
};

export const mockSubmissions = generateSubmissions();

// Contest history
export const mockContests = [
    {
        id: 'con_001',
        platform: 'codeforces',
        contestId: 'cf_round_920',
        contestName: 'Codeforces Round #920 (Div. 2)',
        rank: 1245,
        ratingChange: 45,
        newRating: 1842,
        participatedAt: '2024-01-06T17:35:00Z',
    },
    {
        id: 'con_002',
        platform: 'codeforces',
        contestId: 'cf_round_919',
        contestName: 'Codeforces Round #919 (Div. 2)',
        rank: 987,
        ratingChange: 67,
        newRating: 1797,
    },
    {
        id: 'con_003',
        platform: 'leetcode',
        contestId: 'lc_weekly_378',
        contestName: 'Weekly Contest 378',
        rank: 456,
        ratingChange: 23,
        newRating: 2156,
        participatedAt: '2024-01-07T02:30:00Z',
    },
    {
        id: 'con_004',
        platform: 'leetcode',
        contestId: 'lc_biweekly_120',
        contestName: 'Biweekly Contest 120',
        rank: 678,
        ratingChange: -12,
        newRating: 2133,
        participatedAt: '2023-12-23T14:30:00Z',
    },
    {
        id: 'con_005',
        platform: 'codechef',
        contestId: 'cc_starters_115',
        contestName: 'Starters 115',
        rank: 234,
        ratingChange: 89,
        newRating: 1923,
        participatedAt: '2024-01-03T19:30:00Z',
    },
    {
        id: 'con_006',
        platform: 'atcoder',
        contestId: 'abc_335',
        contestName: 'AtCoder Beginner Contest 335',
        rank: 1567,
        ratingChange: 34,
        newRating: 1456,
        participatedAt: '2024-01-06T12:00:00Z',
    },
];

// Generate daily stats for heatmap (last 365 days)
const generateDailyStats = () => {
    const stats = [];
    const today = new Date();

    for (let i = 365; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        // Random activity with some patterns
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        const baseChance = isWeekend ? 0.6 : 0.75;
        const hasActivity = Math.random() < baseChance;

        if (hasActivity) {
            const problemsSolved = Math.floor(Math.random() * 8) + 1;
            stats.push({
                date: dateStr,
                problemsSolved,
                submissionsMade: problemsSolved + Math.floor(Math.random() * 5),
                platformsActive: ['codeforces', 'leetcode', 'codechef'].slice(0, Math.floor(Math.random() * 3) + 1),
            });
        } else {
            stats.push({
                date: dateStr,
                problemsSolved: 0,
                submissionsMade: 0,
                platformsActive: [],
            });
        }
    }

    return stats;
};

export const mockDailyStats = generateDailyStats();

// Rating history for graphs
export const mockRatingHistory = {
    codeforces: [
        { date: '2023-01-15', rating: 1234 },
        { date: '2023-02-20', rating: 1356 },
        { date: '2023-03-18', rating: 1298 },
        { date: '2023-04-25', rating: 1445 },
        { date: '2023-05-30', rating: 1523 },
        { date: '2023-06-22', rating: 1489 },
        { date: '2023-07-28', rating: 1612 },
        { date: '2023-08-19', rating: 1678 },
        { date: '2023-09-24', rating: 1734 },
        { date: '2023-10-21', rating: 1812 },
        { date: '2023-11-18', rating: 1756 },
        { date: '2023-12-16', rating: 1797 },
        { date: '2024-01-06', rating: 1842 },
    ],
    leetcode: [
        { date: '2023-01-08', rating: 1654 },
        { date: '2023-02-12', rating: 1723 },
        { date: '2023-03-19', rating: 1789 },
        { date: '2023-04-16', rating: 1856 },
        { date: '2023-05-21', rating: 1912 },
        { date: '2023-06-18', rating: 1967 },
        { date: '2023-07-23', rating: 2034 },
        { date: '2023-08-20', rating: 2089 },
        { date: '2023-09-17', rating: 2145 },
        { date: '2023-10-15', rating: 2178 },
        { date: '2023-11-12', rating: 2123 },
        { date: '2023-12-17', rating: 2133 },
        { date: '2024-01-07', rating: 2156 },
    ],
    codechef: [
        { date: '2023-02-01', rating: 1456 },
        { date: '2023-03-15', rating: 1534 },
        { date: '2023-05-10', rating: 1623 },
        { date: '2023-07-05', rating: 1712 },
        { date: '2023-09-20', rating: 1834 },
        { date: '2023-11-08', rating: 1856 },
        { date: '2024-01-03', rating: 1923 },
    ],
    atcoder: [
        { date: '2023-03-01', rating: 987 },
        { date: '2023-05-15', rating: 1123 },
        { date: '2023-07-20', rating: 1256 },
        { date: '2023-09-10', rating: 1345 },
        { date: '2023-11-25', rating: 1422 },
        { date: '2024-01-06', rating: 1456 },
    ],
};

// Topic-wise breakdown
export const mockTopicStats = [
    { topic: 'Dynamic Programming', solved: 89, total: 120, percentage: 74 },
    { topic: 'Graph Theory', solved: 67, total: 95, percentage: 71 },
    { topic: 'Binary Search', solved: 78, total: 85, percentage: 92 },
    { topic: 'Two Pointers', solved: 56, total: 70, percentage: 80 },
    { topic: 'Trees', solved: 45, total: 80, percentage: 56 },
    { topic: 'Greedy', solved: 72, total: 90, percentage: 80 },
    { topic: 'Arrays', solved: 112, total: 130, percentage: 86 },
    { topic: 'Strings', solved: 65, total: 85, percentage: 76 },
    { topic: 'Math', solved: 48, total: 75, percentage: 64 },
    { topic: 'Hash Table', solved: 87, total: 100, percentage: 87 },
    { topic: 'Sorting', solved: 54, total: 60, percentage: 90 },
    { topic: 'Stack', solved: 38, total: 50, percentage: 76 },
];

// Achievements
export const mockAchievements = [
    { id: 'ach_001', name: '100 Problems Solved', description: 'Solved your first 100 problems', icon: '🎯', unlockedAt: '2023-04-15' },
    { id: 'ach_002', name: '500 Problems Solved', description: 'Solved 500 problems across all platforms', icon: '🏆', unlockedAt: '2023-11-20' },
    { id: 'ach_003', name: 'Expert Rank', description: 'Reached Expert rank on Codeforces', icon: '⭐', unlockedAt: '2023-10-21' },
    { id: 'ach_004', name: '30 Day Streak', description: 'Maintained a 30-day solving streak', icon: '🔥', unlockedAt: '2023-08-10' },
    { id: 'ach_005', name: 'Contest Regular', description: 'Participated in 25+ contests', icon: '🎪', unlockedAt: '2023-09-15' },
    { id: 'ach_006', name: 'Hard Problem Crusher', description: 'Solved 50+ hard problems', icon: '💎', unlockedAt: '2023-12-01' },
    { id: 'ach_007', name: 'Multi-Platform Master', description: 'Active on 5+ platforms', icon: '🌐', unlockedAt: '2023-07-01' },
    { id: 'ach_008', name: 'DP Specialist', description: 'Solved 75+ DP problems', icon: '🧠', unlockedAt: '2023-10-05' },
];

// Summary statistics
export const mockSummaryStats = {
    totalProblemsSolved: 1500,
    totalContests: 123,
    currentStreak: 12,
    longestStreak: 45,
    averageProblemsPerDay: 2.3,
    totalPlatforms: 6,
    weeklyProblems: [
        { day: 'Mon', count: 5 },
        { day: 'Tue', count: 8 },
        { day: 'Wed', count: 3 },
        { day: 'Thu', count: 6 },
        { day: 'Fri', count: 4 },
        { day: 'Sat', count: 7 },
        { day: 'Sun', count: 2 },
    ],
};

// Problems solved over time (monthly)
export const mockProblemsTrend = [
    { month: 'Jan 2023', count: 45 },
    { month: 'Feb 2023', count: 52 },
    { month: 'Mar 2023', count: 38 },
    { month: 'Apr 2023', count: 67 },
    { month: 'May 2023', count: 72 },
    { month: 'Jun 2023', count: 58 },
    { month: 'Jul 2023', count: 84 },
    { month: 'Aug 2023', count: 91 },
    { month: 'Sep 2023', count: 76 },
    { month: 'Oct 2023', count: 88 },
    { month: 'Nov 2023', count: 65 },
    { month: 'Dec 2023', count: 78 },
    { month: 'Jan 2024', count: 23 },
];

// Difficulty distribution
export const mockDifficultyDistribution = {
    easy: 412,
    medium: 756,
    hard: 332,
};

// Platform-wise problem counts
export const mockPlatformStats = {
    codeforces: { solved: 487, rating: 1842 },
    leetcode: { solved: 623, rating: 2156 },
    codechef: { solved: 234, rating: 1923 },
    atcoder: { solved: 156, rating: 1456 },
    github: { repos: 47, stars: 2345 },
    stackoverflow: { reputation: 15678 },
};
