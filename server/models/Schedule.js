import mongoose from 'mongoose';

const ScheduleSchema = new mongoose.Schema({
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    title: { type: String, required: true },
    description: String,
    color: { type: String, required: true },
    date: { type: String, required: true }
});

export default mongoose.model('Schedule', ScheduleSchema);
