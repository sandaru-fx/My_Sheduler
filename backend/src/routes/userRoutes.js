import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userController.js';

const router = express.Router();

// GET /api/profile - Get user profile
router.get('/', getUserProfile);

// POST /api/profile - Update user profile
router.post('/', updateUserProfile);

export default router;
