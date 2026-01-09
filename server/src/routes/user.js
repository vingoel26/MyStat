import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

/**
 * @route   GET /api/users/:username
 * @desc    Get public user profile
 * @access  Public
 */
router.get('/:username', userController.getPublicProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Update current user's profile
 * @access  Private
 */
router.put('/profile', authenticate, userController.updateProfile);

/**
 * @route   PUT /api/users/settings
 * @desc    Update user settings (privacy, etc.)
 * @access  Private
 */
router.put('/settings', authenticate, userController.updateSettings);

/**
 * @route   DELETE /api/users
 * @desc    Delete user account
 * @access  Private
 */
router.delete('/', authenticate, userController.deleteAccount);

/**
 * @route   GET /api/users/:username/stats
 * @desc    Get user statistics
 * @access  Public (respects privacy settings)
 */
router.get('/:username/stats', userController.getUserStats);

/**
 * @route   GET /api/users/:username/achievements
 * @desc    Get user achievements
 * @access  Public
 */
router.get('/:username/achievements', userController.getAchievements);

/**
 * @route   GET /api/users/:username/platforms
 * @desc    Get user's connected platforms
 * @access  Public (respects privacy settings)
 */
router.get('/:username/platforms', userController.getUserPlatforms);

export default router;
