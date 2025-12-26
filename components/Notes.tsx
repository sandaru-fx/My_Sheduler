import React, { useState, useEffect, useMemo } from 'react';
import { NoteItem, COLORS, NoteCategory } from '../types';
import { getNotes, addNote, deleteNote } from '../services/db';
import { Button } from './ui/Button';
import { Input, TextArea } from './ui/Input';
import { StickyNote, Trash2, CalendarDays, Search, Filter, Tag, Plus, Sparkles, FolderOpen } from 'lucide-react';

const CATEGORIES: NoteCategory[] = ['Work', 'Personal', 'Ideas', 'Urgent'];

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NoteCategory | 'All'>('All');

  // Form State
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [noteColor, setNoteColor] = useState(COLORS[1]); // Default purple
  const [noteCategory, setNoteCategory] = useState<NoteCategory>('Work');
  const [isAdding, setIsAdding] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    setLoading(true);
    const data = await getNotes();
    setNotes(data);
    setLoading(false);
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    if (!topic.trim()) {
      newErrors.topic = "Topic is required";
      isValid = false;
    }
    if (!date) {
      newErrors.date = "Date is required";
      isValid = false;
    }
    if (!content.trim()) {
      newErrors.content = "Content cannot be empty";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await addNote({
      topic,
      content,
      date,
      colorTag: noteColor,
      category: noteCategory
    });

    setTopic('');
    setContent('');
    setErrors({});
    setIsAdding(false);
    loadNotes();
  };

  const handleDelete = async (id: string) => {
    await deleteNote(id);
    loadNotes();
  };

  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const matchesSearch = note.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || note.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [notes, searchQuery, selectedCategory]);

  return (
    <div className="h-full flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Search & Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-900/40 backdrop-blur-3xl border border-white/10 p-6 rounded-3xl shadow-2xl">
        <div className="flex-1 w-full relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search your thoughts..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
            {['All', ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat as any)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                    : 'text-gray-500 hover:text-gray-300'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <Button onClick={() => setIsAdding(!isAdding)} className={`h-12 w-12 rounded-2xl p-0 shadow-xl transition-all ${isAdding ? 'bg-pink-500 rotate-45' : 'bg-gradient-to-br from-indigo-600 to-indigo-500'}`}>
            <Plus size={24} />
          </Button>
        </div>
      </div>

      {/* Adding Note Form (Collapsible) */}
      {isAdding && (
        <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-top-4 duration-500">
          <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-white uppercase tracking-tighter">
            <div className="p-2 bg-pink-500/20 rounded-xl text-pink-400 border border-pink-500/20">
              <StickyNote size={20} />
            </div>
            Capture New Idea
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Note Topic"
                  value={topic}
                  onChange={(e) => {
                    setTopic(e.target.value);
                    if (errors.topic) setErrors({ ...errors, topic: '' });
                  }}
                  placeholder="Project X Strategy..."
                  error={errors.topic}
                  className="bg-white/5 border-white/10"
                />
                <Input
                  label="Date"
                  type="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    if (errors.date) setErrors({ ...errors, date: '' });
                  }}
                  error={errors.date}
                  className="bg-white/5 border-white/10"
                />
              </div>
              <TextArea
                label="Your Content"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  if (errors.content) setErrors({ ...errors, content: '' });
                }}
                placeholder="Unleash your creativity..."
                rows={4}
                error={errors.content}
                className="bg-white/5 border-white/10 min-h-[150px]"
              />
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNoteCategory(cat)}
                      className={`py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${noteCategory === cat
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg'
                          : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Vibe</label>
                <div className="flex gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`w-9 h-9 rounded-xl ${c} transition-all duration-300 relative ${noteColor === c
                          ? 'scale-110 ring-4 ring-indigo-500/30 border-2 border-white'
                          : 'opacity-40 hover:opacity-100 hover:scale-105 border border-white/10'
                        }`}
                      onClick={() => setNoteColor(c)}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <Button type="submit" className="flex-1 h-14 bg-gradient-to-r from-indigo-600 to-indigo-500 font-bold rounded-2xl shadow-xl">
                  Add Note
                </Button>
                <Button type="button" variant="secondary" onClick={() => setIsAdding(false)} className="h-14 px-6 rounded-2xl font-bold bg-white/5 border-white/10">
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Notes Grid Display */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 animate-pulse">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Accessing Knowledge Base...</p>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10 shadow-2xl">
              <FolderOpen size={40} className="text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Workspace Clear.</h3>
            <p className="text-gray-400 max-w-xs font-medium">No ideas found matching your criteria. Start a new chapter today.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
            {filteredNotes.map((note, idx) => (
              <div
                key={note._id}
                className="group relative bg-slate-900/60 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] flex flex-col hover:border-white/20 animate-in zoom-in-95 duration-500"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* Note Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/10 bg-white/5 ${note.colorTag.replace('bg-', 'text-')}`}>
                        {note.category || 'General'}
                      </span>
                      <div className={`w-2 h-2 rounded-full ${note.colorTag} shadow-[0_0_10px_currentColor]`} />
                    </div>
                    <h3 className="text-xl font-black text-white leading-tight uppercase tracking-tight group-hover:text-indigo-300 transition-colors">
                      {note.topic}
                    </h3>
                  </div>
                  <div className="p-2 bg-white/5 rounded-xl border border-white/10">
                    <Sparkles size={14} className="text-indigo-400" />
                  </div>
                </div>

                {/* Note Content */}
                <p className="text-gray-400 text-sm font-medium whitespace-pre-wrap leading-relaxed flex-1 mb-6 max-h-[200px] overflow-hidden group-hover:text-gray-300 transition-colors">
                  {note.content}
                </p>

                {/* Note Footer */}
                <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    <CalendarDays size={12} className="text-indigo-500" />
                    {note.date}
                  </div>
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="opacity-0 group-hover:opacity-100 p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all scale-75 group-hover:scale-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
};

export default Notes;