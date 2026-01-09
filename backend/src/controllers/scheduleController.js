import Schedule from '../models/Schedule.js';

// Get all schedule items
export const getAllSchedules = async (req, res) => {
  try {
    const items = await Schedule.find().sort({ startTime: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new schedule item
export const createSchedule = async (req, res) => {
  try {
    const newItem = new Schedule(req.body);
    await newItem.save();
    res.json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete schedule item
export const deleteSchedule = async (req, res) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
