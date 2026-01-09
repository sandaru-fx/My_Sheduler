import Note from '../models/Note.js';

// Get all notes
export const getAllNotes = async (req, res) => {
    try {
        const items = await Note.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create new note
export const createNote = async (req, res) => {
    try {
        const newNote = new Note(req.body);
        await newNote.save();
        res.json(newNote);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete note
export const deleteNote = async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
