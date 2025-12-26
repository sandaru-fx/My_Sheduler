import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import Schedule from './models/Schedule.js';
import Note from './models/Note.js';
import UserProfile from './models/UserProfile.js';
// We'll need to convert User model to ESM format
import User from './models/User.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// --- MongoDB Connection ---
const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGODB_URI ? 'URI is set' : 'URI is NOT set');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');
    return true;
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
    return false;
  }
};

// Connect to MongoDB
connectDB();

// --- API Routes ---

// Auth Routes
const JWT_SECRET = process.env.JWT_SECRET || 'timeflow-secret-key';

// Auth middleware
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Find user with the id from token
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Add user to request object
    req.user = user;
    req.token = token;
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// Sign up
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password
    });

    // Save user to database
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// Sign in
app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ message: 'Server error during signin' });
  }
});

// Get user profile
app.get('/api/auth/profile', auth, async (req, res) => {
  try {
    // Remove password from response
    const userResponse = req.user.toObject();
    delete userResponse.password;
    
    res.json({ user: userResponse });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error getting profile' });
  }
});

// Update user profile
app.put('/api/auth/profile', auth, async (req, res) => {
  try {
    const { name, email, profilePicture, role, bio, theme } = req.body;
    const user = req.user;

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (profilePicture) user.profilePicture = profilePicture;
    if (role) user.role = role;
    if (bio) user.bio = bio;
    if (theme) user.theme = theme;

    // Save updated user
    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ user: userResponse });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

// Change password
app.post('/api/auth/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error changing password' });
  }
});

// Protected routes middleware
const protectRoute = (req, res, next) => {
  // For now, we'll make this optional to maintain backward compatibility
  // Later, you can make this required by removing the token check bypass
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    // Allow access for now, but in production you'd want to require authentication
    return next();
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    // Allow access even if token is invalid for now
    next();
  }
};

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

// Health check endpoint
app.get('/health', (req, res) => {
  const status = {
    server: 'up',
    timestamp: new Date(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  };
  
  console.log('Health check:', status);
  
  if (status.mongodb === 'connected') {
    return res.status(200).json(status);
  } else {
    return res.status(500).json({
      ...status,
      error: 'MongoDB connection is down'
    });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Server error',
    message: err.message || 'An unexpected error occurred'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});
