import UserProfile from '../models/UserProfile.js';

// Get user profile
export const getUserProfile = async (req, res) => {
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
};

// Update user profile
export const updateUserProfile = async (req, res) => {
    try {
        const profile = await UserProfile.findOneAndUpdate({}, req.body, {
            upsert: true,
            new: true
        });
        res.json(profile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
