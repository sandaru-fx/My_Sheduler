import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';

// Import routes
import scheduleRoutes from './routes/scheduleRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/schedule', scheduleRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/profile', userRoutes);

// Health check route
app.get('/', (req, res) => {
    res.json({ message: 'TimeFlow Scheduler API is running!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
