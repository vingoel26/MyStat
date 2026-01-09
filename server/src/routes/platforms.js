import { Router } from 'express';
import * as platformController from '../controllers/platformController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

/**
 * @route   GET /api/platforms
 * @desc    Get all connected platforms for current user
 * @access  Private
 */
router.get('/', authenticate, platformController.getConnectedPlatforms);

/**
 * @route   POST /api/platforms
 * @desc    Connect a new platform
 * @access  Private
 */
router.post('/', authenticate, platformController.connectPlatform);

/**
 * @route   DELETE /api/platforms/:platformId
 * @desc    Disconnect a platform
 * @access  Private
 */
router.delete('/:platformId', authenticate, platformController.disconnectPlatform);

/**
 * @route   POST /api/platforms/:platformId/sync
 * @desc    Sync data from a specific platform
 * @access  Private
 */
router.post('/:platformId/sync', authenticate, platformController.syncPlatform);

/**
 * @route   POST /api/platforms/sync-all
 * @desc    Sync all connected platforms
 * @access  Private
 */
router.post('/sync-all', authenticate, platformController.syncAllPlatforms);

/**
 * @route   GET /api/platforms/:platformId/submissions
 * @desc    Get submissions from a specific platform
 * @access  Private
 */
router.get('/:platformId/submissions', authenticate, platformController.getPlatformSubmissions);

/**
 * @route   GET /api/platforms/:platformId/contests
 * @desc    Get contest history from a specific platform
 * @access  Private
 */
router.get('/:platformId/contests', authenticate, platformController.getPlatformContests);

export default router;
