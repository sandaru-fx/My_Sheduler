import { ScheduleItem, NoteItem, UserProfile } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

// --- Scheduler Service ---

export const getSchedule = async (): Promise<ScheduleItem[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/schedule`);
    return await response.json();
  } catch (err) {
    console.error('Fetch schedule error:', err);
    return [];
  }
};

export const addScheduleItem = async (item: Omit<ScheduleItem, '_id'>): Promise<ScheduleItem> => {
  try {
    const response = await fetch(`${API_BASE_URL}/schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    return await response.json();
  } catch (err) {
    console.error('Add schedule error:', err);
    throw err;
  }
};

export const deleteScheduleItem = async (id: string): Promise<void> => {
  try {
    await fetch(`${API_BASE_URL}/schedule/${id}`, { method: 'DELETE' });
  } catch (err) {
    console.error('Delete schedule error:', err);
  }
};

// --- Notes Service ---

export const getNotes = async (): Promise<NoteItem[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes`);
    return await response.json();
  } catch (err) {
    console.error('Fetch notes error:', err);
    return [];
  }
};

export const addNote = async (note: Omit<NoteItem, '_id' | 'createdAt'>): Promise<NoteItem> => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note),
    });
    return await response.json();
  } catch (err) {
    console.error('Add note error:', err);
    throw err;
  }
};

export const deleteNote = async (id: string): Promise<void> => {
  try {
    await fetch(`${API_BASE_URL}/notes/${id}`, { method: 'DELETE' });
  } catch (err) {
    console.error('Delete note error:', err);
  }
};

// --- User Profile / Settings Service ---

export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile`);
    return await response.json();
  } catch (err) {
    console.error('Fetch profile error:', err);
    // Fallback to avoid complete crash if server is down initially
    return {
      name: 'Shehan Perera',
      email: 'shehan.p@gmail.com',
      role: 'Productive Architect',
      bio: 'Sculpting time, one task at a time.',
      theme: 'neon',
      joinedDate: new Date().toISOString(),
    };
  }
};

export const saveUserProfile = async (profile: UserProfile): Promise<UserProfile> => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    return await response.json();
  } catch (err) {
    console.error('Save profile error:', err);
    return profile;
  }
};