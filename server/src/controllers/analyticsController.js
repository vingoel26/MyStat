import Submission from '../models/Submission.js';
import DailyStat from '../models/DailyStat.js';
import RatingHistory from '../models/RatingHistory.js';
import PlatformAccount from '../models/PlatformAccount.js';
import Contest from '../models/Contest.js';

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get summary stats
        const [submissionStats, difficultyDist, recentActivity] = await Promise.all([
            // Summary stats
            Submission.aggregate([
                { $match: { user: userId } },
                {
                    $group: {
                        _id: null,
                        total_submissions: { $sum: 1 },
                        total_solved: { $sum: { $cond: [{ $eq: ['$status', 'solved'] }, 1, 0] } }
                    }
                }
            ]),
            // Difficulty distribution
            Submission.aggregate([
                { $match: { user: userId, status: 'solved' } },
                { $group: { _id: '$difficulty', count: { $sum: 1 } } }
            ]),
            // Recent activity
            DailyStat.find({ user: userId, problems_solved: { $gt: 0 } })
                .sort({ date: -1 })
                .limit(365)
                .select('date problems_solved')
        ]);

        const summary = submissionStats[0] || { total_submissions: 0, total_solved: 0 };

        res.json({
            summary: {
                total_submissions: summary.total_submissions,
                total_solved: summary.total_solved,
            },
            difficulty: difficultyDist.map(d => ({ difficulty: d._id, count: d.count })),
            recentActivity: recentActivity.map(a => ({
                date: a.date,
                problems_solved: a.problems_solved
            })),
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({ error: 'Failed to get dashboard stats' });
    }
};

/**
 * Get all submissions with filtering
 */
export const getSubmissions = async (req, res) => {
    try {
        const { platform, difficulty, status, limit = 50, offset = 0 } = req.query;

        const filter = { user: req.user.id };
        if (platform) filter.platform = platform;
        if (difficulty) filter.difficulty = difficulty;
        if (status) filter.status = status;

        const submissions = await Submission.find(filter)
            .sort({ submitted_at: -1 })
            .skip(parseInt(offset))
            .limit(parseInt(limit));

        res.json(submissions);
    } catch (error) {
        console.error('Get submissions error:', error);
        res.status(500).json({ error: 'Failed to get submissions' });
    }
};

/**
 * Get activity heatmap data
 */
export const getHeatmapData = async (req, res) => {
    try {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        const data = await DailyStat.find({
            user: req.user.id,
            date: { $gte: oneYearAgo }
        })
            .sort({ date: 1 })
            .select('date problems_solved');

        res.json(data.map(d => ({
            date: d.date,
            problems_solved: d.problems_solved
        })));
    } catch (error) {
        console.error('Get heatmap error:', error);
        res.status(500).json({ error: 'Failed to get heatmap data' });
    }
};

/**
 * Get rating history
 */
export const getRatingHistory = async (req, res) => {
    try {
        const data = await RatingHistory.find({ user: req.user.id })
            .sort({ recorded_at: 1 })
            .select('platform rating recorded_at');

        res.json(data.map(d => ({
            platform: d.platform,
            rating: d.rating,
            recorded_at: d.recorded_at
        })));
    } catch (error) {
        console.error('Get rating history error:', error);
        res.status(500).json({ error: 'Failed to get rating history' });
    }
};

/**
 * Get topic breakdown
 */
export const getTopicBreakdown = async (req, res) => {
    try {
        const data = await Submission.aggregate([
            { $match: { user: req.user.id, status: 'solved' } },
            { $unwind: '$tags' },
            { $group: { _id: '$tags', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 20 }
        ]);

        res.json(data.map(d => ({ topic: d._id, count: d.count })));
    } catch (error) {
        console.error('Get topic breakdown error:', error);
        res.status(500).json({ error: 'Failed to get topics' });
    }
};

/**
 * Get consistency metrics
 */
export const getConsistencyMetrics = async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const data = await DailyStat.aggregate([
            { $match: { user: req.user.id, date: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: null,
                    active_days: { $sum: 1 },
                    total_problems: { $sum: '$problems_solved' },
                    avg_per_day: { $avg: '$problems_solved' }
                }
            }
        ]);

        res.json(data[0] || { active_days: 0, total_problems: 0, avg_per_day: 0 });
    } catch (error) {
        console.error('Get consistency error:', error);
        res.status(500).json({ error: 'Failed to get consistency' });
    }
};

/**
 * Get difficulty distribution
 */
export const getDifficultyDistribution = async (req, res) => {
    try {
        const data = await Submission.aggregate([
            { $match: { user: req.user.id, status: 'solved' } },
            { $group: { _id: '$difficulty', count: { $sum: 1 } } }
        ]);

        res.json(data.map(d => ({ difficulty: d._id, count: d.count })));
    } catch (error) {
        console.error('Get difficulty error:', error);
        res.status(500).json({ error: 'Failed to get difficulty distribution' });
    }
};
