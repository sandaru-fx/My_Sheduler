export interface ScheduleItem {
  _id: string;
  startTime: string; // HH:mm format
  endTime: string;   // HH:mm format
  title: string;
  description?: string;
  color: string;
  date: string; // ISO Date string for the day
}

export type NoteCategory = 'Work' | 'Personal' | 'Ideas' | 'Urgent';

export interface NoteItem {
  _id: string;
  topic: string;
  content: string;
  date: string; // ISO string
  createdAt: number;
  colorTag: string;
  category?: NoteCategory;
}

export type ViewMode = 'scheduler' | 'notes' | 'settings';

export type ThemeVariant = 'neon' | 'light' | 'stars' | 'flowers' | 'snow';

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  bio: string;
  avatar?: string;
  theme: ThemeVariant;
  joinedDate: string;
}

export const COLORS = [
  'bg-blue-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-green-500',
  'bg-orange-500',
  'bg-teal-500',
];