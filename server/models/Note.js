import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
    topic: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: String, required: true },
    colorTag: { type: String, required: true },
    category: String,
    createdAt: { type: Number, default: Date.now }
});

export default mongoose.model('Note', NoteSchema);
