import { query } from '../config/database.js';

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get summary stats
        const statsResult = await query(
            'SELECT * FROM user_stats_summary WHERE user_id = $1',
            [userId]
        );

        // Get difficulty distribution
        const difficultyResult = await query(
            `SELECT difficulty, COUNT(*) as count 
       FROM submissions WHERE user_id = $1 AND status = 'solved'
       GROUP BY difficulty`,
            [userId]
        );

        // Get current streak
        const streakResult = await query(
            `SELECT date, problems_solved FROM daily_stats 
       WHERE user_id = $1 AND problems_solved > 0
       ORDER BY date DESC LIMIT 365`,
            [userId]
        );

        res.json({
            summary: statsResult.rows[0] || {},
            difficulty: difficultyResult.rows,
            recentActivity: streakResult.rows,
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

        let queryStr = `SELECT * FROM submissions WHERE user_id = $1`;
        const params = [req.user.id];
        let paramIndex = 2;

        if (platform) {
            queryStr += ` AND platform = $${paramIndex++}`;
            params.push(platform);
        }
        if (difficulty) {
            queryStr += ` AND difficulty = $${paramIndex++}`;
            params.push(difficulty);
        }
        if (status) {
            queryStr += ` AND status = $${paramIndex++}`;
            params.push(status);
        }

        queryStr += ` ORDER BY submitted_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
        params.push(limit, offset);

        const result = await query(queryStr, params);
        res.json(result.rows);
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
        const result = await query(
            `SELECT date, problems_solved FROM daily_stats 
       WHERE user_id = $1 AND date >= NOW() - INTERVAL '1 year'
       ORDER BY date`,
            [req.user.id]
        );
        res.json(result.rows);
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
        const result = await query(
            `SELECT platform, rating, recorded_at FROM rating_history 
       WHERE user_id = $1 ORDER BY recorded_at`,
            [req.user.id]
        );
        res.json(result.rows);
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
        const result = await query(
            `SELECT unnest(tags) as topic, COUNT(*) as count
       FROM submissions WHERE user_id = $1 AND status = 'solved'
       GROUP BY topic ORDER BY count DESC LIMIT 20`,
            [req.user.id]
        );
        res.json(result.rows);
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
        const result = await query(
            `SELECT COUNT(*) as active_days,
              SUM(problems_solved) as total_problems,
              AVG(problems_solved) as avg_per_day
       FROM daily_stats WHERE user_id = $1 AND date >= NOW() - INTERVAL '30 days'`,
            [req.user.id]
        );
        res.json(result.rows[0] || {});
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
        const result = await query(
            `SELECT difficulty, COUNT(*) as count
       FROM submissions WHERE user_id = $1 AND status = 'solved'
       GROUP BY difficulty`,
            [req.user.id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Get difficulty error:', error);
        res.status(500).json({ error: 'Failed to get difficulty distribution' });
    }
};
