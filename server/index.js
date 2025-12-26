import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import Schedule from './models/Schedule.js';
import Note from './models/Note.js';
import UserProfile from './models/UserProfile.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- API Routes ---

// Scheduler Routes
app.get('/api/schedule', async (req, res) => {
    try {
        const items = await Schedule.find().sort({ startTime: 1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/schedule', async (req, res) => {
    try {
        const newItem = new Schedule(req.body);
        await newItem.save();
        res.json(newItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/schedule/:id', async (req, res) => {
    try {
        await Schedule.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Notes Routes
app.get('/api/notes', async (req, res) => {
    try {
        const items = await Note.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/notes', async (req, res) => {
    try {
        const newNote = new Note(req.body);
        await newNote.save();
        res.json(newNote);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/notes/:id', async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// User Profile Routes
app.get('/api/profile', async (req, res) => {
    try {
        let profile = await UserProfile.findOne();
        if (!profile) {
            // Create default if none exists
            profile = new UserProfile({
                name: 'Shehan Perera',
                email: 'shehan.p@gmail.com',
                role: 'Productive Architect',
                bio: 'Sculpting time, one task at a time. Lover of Three.js and premium UI.',
                theme: 'neon',
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&h=200&auto=format&fit=crop',
                joinedDate: new Date().toISOString(),
            });
            await profile.save();
        }
        res.json(profile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/profile', async (req, res) => {
    try {
        const profile = await UserProfile.findOneAndUpdate({}, req.body, { upsert: true, new: true });
        res.json(profile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
