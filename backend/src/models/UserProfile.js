import mongoose from 'mongoose';

const UserProfileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
    bio: String,
    avatar: String,
    theme: { type: String, default: 'neon' },
    joinedDate: { type: String, required: true }
});

export default mongoose.model('UserProfile', UserProfileSchema);
