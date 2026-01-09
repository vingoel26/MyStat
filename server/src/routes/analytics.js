import { Router } from 'express';
import * as analyticsController from '../controllers/analyticsController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

/**
 * @route   GET /api/analytics/dashboard
 * @desc    Get dashboard statistics
 * @access  Private
 */
router.get('/dashboard', authenticate, analyticsController.getDashboardStats);

/**
 * @route   GET /api/analytics/submissions
 * @desc    Get all submissions with filtering
 * @access  Private
 */
router.get('/submissions', authenticate, analyticsController.getSubmissions);

/**
 * @route   GET /api/analytics/heatmap
 * @desc    Get activity heatmap data
 * @access  Private
 */
router.get('/heatmap', authenticate, analyticsController.getHeatmapData);

/**
 * @route   GET /api/analytics/rating-history
 * @desc    Get rating history for all platforms
 * @access  Private
 */
router.get('/rating-history', authenticate, analyticsController.getRatingHistory);

/**
 * @route   GET /api/analytics/topics
 * @desc    Get topic-wise breakdown
 * @access  Private
 */
router.get('/topics', authenticate, analyticsController.getTopicBreakdown);

/**
 * @route   GET /api/analytics/consistency
 * @desc    Get consistency metrics
 * @access  Private
 */
router.get('/consistency', authenticate, analyticsController.getConsistencyMetrics);

/**
 * @route   GET /api/analytics/difficulty
 * @desc    Get difficulty distribution
 * @access  Private
 */
router.get('/difficulty', authenticate, analyticsController.getDifficultyDistribution);

export default router;
