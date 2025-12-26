import { ScheduleItem, NoteItem, UserProfile } from '../types';

// API Configuration
export const API_BASE_URL = 'http://localhost:5000/api';

// Local storage keys for fallback data
const SCHEDULE_STORAGE_KEY = 'timeflow_schedule';
const NOTES_STORAGE_KEY = 'timeflow_notes';

// Helper function to check if server is available
const isServerAvailable = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`, { 
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return response.ok;
  } catch (error) {
    console.error('Server health check failed:', error);
    return false;
  }
};

// Helper to save data to local storage
const saveToLocalStorage = (key: string, data: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
  }
};

// Helper to get data from local storage
const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return defaultValue;
  }
};

// --- Scheduler Service ---

export const getSchedule = async (): Promise<ScheduleItem[]> => {
  try {
    // First check if server is available
    const serverAvailable = await isServerAvailable();
    
    if (!serverAvailable) {
      console.log('Server unavailable, using local storage data');
      return getFromLocalStorage<ScheduleItem[]>(SCHEDULE_STORAGE_KEY, []);
    }
    
    // Server is available, try to fetch data
    const response = await fetch(`${API_BASE_URL}/schedule`);
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Save to local storage for offline use
    saveToLocalStorage(SCHEDULE_STORAGE_KEY, data);
    
    return data;
  } catch (err) {
    console.error('Fetch schedule error:', err);
    // Use local storage as fallback
    return getFromLocalStorage<ScheduleItem[]>(SCHEDULE_STORAGE_KEY, []);
  }
};

export const addScheduleItem = async (item: Omit<ScheduleItem, '_id'>): Promise<ScheduleItem> => {
  try {
    // Check if server is available
    const serverAvailable = await isServerAvailable();
    
    if (!serverAvailable) {
      console.log('Server unavailable, saving to local storage only');
      // Create a temporary ID for local storage
      const tempItem: ScheduleItem = {
        ...item,
        _id: `local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      };
      
      // Get existing items and add the new one
      const existingItems = getFromLocalStorage<ScheduleItem[]>(SCHEDULE_STORAGE_KEY, []);
      existingItems.push(tempItem);
      
      // Save back to local storage
      saveToLocalStorage(SCHEDULE_STORAGE_KEY, existingItems);
      
      return tempItem;
    }
    
    // Server is available, try to save
    const response = await fetch(`${API_BASE_URL}/schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (err) {
    console.error('Add schedule error:', err);
    
    // Fallback to local storage
    const tempItem: ScheduleItem = {
      ...item,
      _id: `local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    };
    
    // Get existing items and add the new one
    const existingItems = getFromLocalStorage<ScheduleItem[]>(SCHEDULE_STORAGE_KEY, []);
    existingItems.push(tempItem);
    
    // Save back to local storage
    saveToLocalStorage(SCHEDULE_STORAGE_KEY, existingItems);
    
    return tempItem;
  }
};

export const deleteScheduleItem = async (id: string): Promise<void> => {
  try {
    // If it's a local ID, just remove from local storage
    if (id.startsWith('local_')) {
      const existingItems = getFromLocalStorage<ScheduleItem[]>(SCHEDULE_STORAGE_KEY, []);
      const updatedItems = existingItems.filter(item => item._id !== id);
      saveToLocalStorage(SCHEDULE_STORAGE_KEY, updatedItems);
      return;
    }
    
    // Check if server is available
    const serverAvailable = await isServerAvailable();
    
    if (!serverAvailable) {
      console.log('Server unavailable, removing from local storage only');
      const existingItems = getFromLocalStorage<ScheduleItem[]>(SCHEDULE_STORAGE_KEY, []);
      const updatedItems = existingItems.filter(item => item._id !== id);
      saveToLocalStorage(SCHEDULE_STORAGE_KEY, updatedItems);
      return;
    }
    
    // Server is available, try to delete
    const response = await fetch(`${API_BASE_URL}/schedule/${id}`, { method: 'DELETE' });
    
    if (!response.ok) {
      console.error(`Delete failed: ${response.status} ${response.statusText}`);
    }
    
    // Also remove from local storage to keep in sync
    const existingItems = getFromLocalStorage<ScheduleItem[]>(SCHEDULE_STORAGE_KEY, []);
    const updatedItems = existingItems.filter(item => item._id !== id);
    saveToLocalStorage(SCHEDULE_STORAGE_KEY, updatedItems);
  } catch (err) {
    console.error('Delete schedule error:', err);
    
    // Fallback to local storage
    const existingItems = getFromLocalStorage<ScheduleItem[]>(SCHEDULE_STORAGE_KEY, []);
    const updatedItems = existingItems.filter(item => item._id !== id);
    saveToLocalStorage(SCHEDULE_STORAGE_KEY, updatedItems);
  }
};

// --- Notes Service ---

export const getNotes = async (): Promise<NoteItem[]> => {
  try {
    // First check if server is available
    const serverAvailable = await isServerAvailable();
    
    if (!serverAvailable) {
      console.log('Server unavailable, using local storage data for notes');
      return getFromLocalStorage<NoteItem[]>(NOTES_STORAGE_KEY, []);
    }
    
    // Server is available, try to fetch data
    const response = await fetch(`${API_BASE_URL}/notes`);
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Save to local storage for offline use
    saveToLocalStorage(NOTES_STORAGE_KEY, data);
    
    return data;
  } catch (err) {
    console.error('Fetch notes error:', err);
    // Use local storage as fallback
    return getFromLocalStorage<NoteItem[]>(NOTES_STORAGE_KEY, []);
  }
};

export const addNote = async (note: Omit<NoteItem, '_id' | 'createdAt'>): Promise<NoteItem> => {
  try {
    // Check if server is available
    const serverAvailable = await isServerAvailable();
    
    if (!serverAvailable) {
      console.log('Server unavailable, saving note to local storage only');
      // Create a temporary ID and timestamp for local storage
      const tempNote: NoteItem = {
        ...note,
        _id: `local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        createdAt: Date.now()
      };
      
      // Get existing notes and add the new one
      const existingNotes = getFromLocalStorage<NoteItem[]>(NOTES_STORAGE_KEY, []);
      existingNotes.push(tempNote);
      
      // Save back to local storage
      saveToLocalStorage(NOTES_STORAGE_KEY, existingNotes);
      
      return tempNote;
    }
    
    // Server is available, try to save
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note),
    });
    
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }
    
    const savedNote = await response.json();
    
    // Also save to local storage for offline access
    const existingNotes = getFromLocalStorage<NoteItem[]>(NOTES_STORAGE_KEY, []);
    const updatedNotes = [...existingNotes.filter(n => n._id !== savedNote._id), savedNote];
    saveToLocalStorage(NOTES_STORAGE_KEY, updatedNotes);
    
    return savedNote;
  } catch (err) {
    console.error('Add note error:', err);
    
    // Fallback to local storage
    const tempNote: NoteItem = {
      ...note,
      _id: `local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: Date.now()
    };
    
    // Get existing notes and add the new one
    const existingNotes = getFromLocalStorage<NoteItem[]>(NOTES_STORAGE_KEY, []);
    existingNotes.push(tempNote);
    
    // Save back to local storage
    saveToLocalStorage(NOTES_STORAGE_KEY, existingNotes);
    
    return tempNote;
  }
};

export const deleteNote = async (id: string): Promise<void> => {
  try {
    // If it's a local ID, just remove from local storage
    if (id.startsWith('local_')) {
      const existingNotes = getFromLocalStorage<NoteItem[]>(NOTES_STORAGE_KEY, []);
      const updatedNotes = existingNotes.filter(note => note._id !== id);
      saveToLocalStorage(NOTES_STORAGE_KEY, updatedNotes);
      return;
    }
    
    // Check if server is available
    const serverAvailable = await isServerAvailable();
    
    if (!serverAvailable) {
      console.log('Server unavailable, removing note from local storage only');
      const existingNotes = getFromLocalStorage<NoteItem[]>(NOTES_STORAGE_KEY, []);
      const updatedNotes = existingNotes.filter(note => note._id !== id);
      saveToLocalStorage(NOTES_STORAGE_KEY, updatedNotes);
      return;
    }
    
    // Server is available, try to delete
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, { method: 'DELETE' });
    
    if (!response.ok) {
      console.error(`Delete note failed: ${response.status} ${response.statusText}`);
    }
    
    // Also remove from local storage to keep in sync
    const existingNotes = getFromLocalStorage<NoteItem[]>(NOTES_STORAGE_KEY, []);
    const updatedNotes = existingNotes.filter(note => note._id !== id);
    saveToLocalStorage(NOTES_STORAGE_KEY, updatedNotes);
  } catch (err) {
    console.error('Delete note error:', err);
    
    // Fallback to local storage
    const existingNotes = getFromLocalStorage<NoteItem[]>(NOTES_STORAGE_KEY, []);
    const updatedNotes = existingNotes.filter(note => note._id !== id);
    saveToLocalStorage(NOTES_STORAGE_KEY, updatedNotes);
  }
};

// --- User Profile / Settings Service ---

// Local storage key for user profile
const USER_PROFILE_KEY = 'timeflow_user_profile';

// Default profile for new users
const DEFAULT_PROFILE: UserProfile = {
  name: 'Shehan Perera',
  email: 'shehan.p@gmail.com',
  role: 'Productive Architect',
  bio: 'Sculpting time, one task at a time.',
  theme: 'neon',
  joinedDate: new Date().toISOString(),
};

export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    // First check if we have a profile in local storage
    const localProfile = getFromLocalStorage<UserProfile | null>(USER_PROFILE_KEY, null);
    
    // Check if server is available
    const serverAvailable = await isServerAvailable();
    
    if (!serverAvailable) {
      console.log('Server unavailable, using local profile data');
      // If we have a local profile, use it
      if (localProfile) {
        return localProfile;
      }
      // Otherwise return default profile
      return DEFAULT_PROFILE;
    }
    
    // Server is available, try to fetch profile
    const response = await fetch(`${API_BASE_URL}/profile`);
    
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }
    
    const profile = await response.json();
    
    // Save to local storage for offline use
    saveToLocalStorage(USER_PROFILE_KEY, profile);
    
    return profile;
  } catch (err) {
    console.error('Fetch profile error:', err);
    
    // Check if we have a profile in local storage
    const localProfile = getFromLocalStorage<UserProfile | null>(USER_PROFILE_KEY, null);
    
    // If we have a local profile, use it
    if (localProfile) {
      return localProfile;
    }
    
    // Otherwise return default profile
    return DEFAULT_PROFILE;
  }
};

export const saveUserProfile = async (profile: UserProfile): Promise<UserProfile> => {
  try {
    // Always save to local storage first for immediate feedback
    saveToLocalStorage(USER_PROFILE_KEY, profile);
    
    // Check if server is available
    const serverAvailable = await isServerAvailable();
    
    if (!serverAvailable) {
      console.log('Server unavailable, profile saved to local storage only');
      return profile;
    }
    
    // Server is available, try to save
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }
    
    const savedProfile = await response.json();
    
    // Update local storage with server response
    saveToLocalStorage(USER_PROFILE_KEY, savedProfile);
    
    return savedProfile;
  } catch (err) {
    console.error('Save profile error:', err);
    // Profile is already saved to local storage, so just return it
    return profile;
  }
};