import { ScheduleItem } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const parseCommand = (input: string): Partial<ScheduleItem> | null => {
  const lower = input.toLowerCase();
  const now = new Date();
  let targetDate = new Date();
  
  // 1. Detect Date
  if (lower.includes('tomorrow')) {
    targetDate.setDate(targetDate.getDate() + 1);
  } else if (lower.includes('next week')) {
    targetDate.setDate(targetDate.getDate() + 7);
  }
  // Simple day detection (e.g. "on friday")
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  days.forEach((day, index) => {
    if (lower.includes(day)) {
      const currentDay = now.getDay();
      let diff = index - currentDay;
      if (diff <= 0) diff += 7; // Next occurrence
      targetDate.setDate(now.getDate() + diff);
    }
  });

  const dateStr = targetDate.toISOString().split('T')[0];

  // 2. Detect Time
  // Patterns: 3pm, 3:30pm, 15:00, 3 am
  const timeRegex = /(\d{1,2})(?::(\d{2}))?\s*(am|pm|a\.m\.|p\.m\.)?/i;
  const timeMatch = input.match(timeRegex);
  
  let startTime = '09:00';
  let endTime = '10:00';

  if (timeMatch) {
    let hour = parseInt(timeMatch[1]);
    const minute = timeMatch[2] || '00';
    const meridiem = timeMatch[3]?.toLowerCase();

    if (meridiem?.includes('p') && hour < 12) hour += 12;
    if (meridiem?.includes('a') && hour === 12) hour = 0;

    const hourStr = hour.toString().padStart(2, '0');
    startTime = `${hourStr}:${minute}`;
    
    // Default duration 1 hour
    let endHour = hour + 1;
    const endHourStr = endHour.toString().padStart(2, '0');
    endTime = `${endHourStr}:${minute}`;
  }

  // 3. Extract Title (Remove time/date keywords)
  // This is a naive removal, but works for "Meeting at 3pm" -> "Meeting at"
  let cleanTitle = input
    .replace(timeRegex, '')
    .replace(/tomorrow|today|next week/gi, '')
    .replace(new RegExp(days.join('|'), 'gi'), '')
    .replace(/\bat\b|\bon\b/gi, '') // Remove prepositions often used with time
    .replace(/\s+/g, ' ')
    .trim();

  // If empty title (e.g. user just typed "3pm"), default to "New Task"
  if (!cleanTitle) cleanTitle = "New Task";

  return {
    title: cleanTitle,
    date: dateStr,
    startTime,
    endTime,
    color: 'bg-indigo-500', // Default AI color
    description: 'Scheduled via AI Command Center',
  };
};
