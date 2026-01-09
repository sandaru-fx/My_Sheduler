import express from 'express';
import { getAllSchedules, createSchedule, deleteSchedule } from '../controllers/scheduleController.js';

const router = express.Router();

// GET /api/schedule - Get all schedule items
router.get('/', getAllSchedules);

// POST /api/schedule - Create new schedule item
router.post('/', createSchedule);

// DELETE /api/schedule/:id - Delete schedule item
router.delete('/:id', deleteSchedule);

export default router;
