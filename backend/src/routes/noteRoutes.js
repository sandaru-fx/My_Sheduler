import express from 'express';
import { getAllNotes, createNote, deleteNote } from '../controllers/noteController.js';

const router = express.Router();

// GET /api/notes - Get all notes
router.get('/', getAllNotes);

// POST /api/notes - Create new note
router.post('/', createNote);

// DELETE /api/notes/:id - Delete note
router.delete('/:id', deleteNote);

export default router;
