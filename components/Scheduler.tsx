import React, { useState, useEffect, useRef, Suspense } from 'react';
import { ScheduleItem, COLORS } from '../types';
import { getSchedule, addScheduleItem, deleteScheduleItem } from '../services/db';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Trash2, Plus, Calendar, Clock, Zap, Sparkles, LayoutDashboard, ChevronLeft, ChevronRight } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// --- 3D Living Timeline Element ---
const LivingTimeline3D = ({ itemsCount }: { itemsCount: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.2;
    meshRef.current.rotation.y = t * 0.3;
    // Scale slightly based on items count
    const targetScale = 1 + (Math.min(itemsCount, 10) * 0.05);
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  return (
    <Float speed={4} rotationIntensity={1} floatIntensity={1}>
      <Sphere args={[1, 64, 64]} ref={meshRef}>
        <MeshDistortMaterial
          color="#6366f1"
          speed={3}
          distort={0.4}
          radius={1}
          emissive="#4f46e5"
          emissiveIntensity={0.5}
        />
      </Sphere>
    </Float>
  );
};

const Scheduler: React.FC<{ lastUpdated?: number }> = ({ lastUpdated }) => {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Date State - Default to local date YYYY-MM-DD
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  });

  // Form State
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  // Validation State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        // Try to get from API first
        const data = await getSchedule();
        setItems(data);
        
        // Check if we have any local items that need to be merged
        const localItemsStr = localStorage.getItem('timeflow_schedule');
        if (localItemsStr) {
          const localItems = JSON.parse(localItemsStr);
          if (localItems.length > 0) {
            console.log('Found local items to merge:', localItems.length);
            // Merge local items with API items (avoiding duplicates by title+time+date)
            const mergedItems = [...data];
            
            localItems.forEach(localItem => {
              // Check if this item already exists in API data
              const exists = data.some(apiItem => 
                apiItem.title === localItem.title && 
                apiItem.startTime === localItem.startTime &&
                apiItem.date === localItem.date
              );
              
              if (!exists) {
                mergedItems.push(localItem);
              }
            });
            
            setItems(mergedItems);
            // Clear local storage since we've merged
            localStorage.removeItem('timeflow_schedule');
          }
        }
      } catch (error) {
        console.error('Error fetching schedule from API:', error);
        
        // Fallback to local storage if API fails
        const localItemsStr = localStorage.getItem('timeflow_schedule');
        if (localItemsStr) {
          const localItems = JSON.parse(localItemsStr);
          setItems(localItems);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchSchedule();
  }, [lastUpdated]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    if (!startTime) {
      newErrors.startTime = "Required";
      isValid = false;
    }
    if (!endTime) {
      newErrors.endTime = "Required";
      isValid = false;
    }
    if (!title.trim()) {
      newErrors.title = "Task title is required";
      isValid = false;
    }

    if (startTime && endTime) {
      if (endTime <= startTime) {
        newErrors.endTime = "End time must be after start time";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await getSchedule();
      setItems(data);
    } catch (error) {
      console.error('Error loading schedule items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await addScheduleItem({
        startTime,
        endTime,
        title,
        description,
        color: selectedColor,
        date: selectedDate, // Use the selected date
      });

      setTitle('');
      setDescription('');
      setStartTime('');
      setEndTime('');
      setErrors({});
      
      // Reload items after adding
      loadItems();
    } catch (error) {
      console.error('Error adding schedule item:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteScheduleItem(id);
      loadItems();
    } catch (error) {
      console.error('Error deleting schedule item:', error);
    }
  };

  const getDuration = (start: string, end: string) => {
    if (!start || !end) return '';
    const [h1, m1] = start.split(':').map(Number);
    const [h2, m2] = end.split(':').map(Number);
    let diff = (h2 * 60 + m2) - (h1 * 60 + m1);
    if (diff < 0) diff += 24 * 60;

    const hours = Math.floor(diff / 60);
    const mins = diff % 60;

    if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
    if (hours > 0) return `${hours}h`;
    return `${mins}m`;
  };

  // Helper to change date by days
  const changeDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    
    // Format back to YYYY-MM-DD
    const newDate = new Date(d.getTime() - (d.getTimezoneOffset() * 60000))
      .toISOString()
      .split('T')[0];
      
    setSelectedDate(newDate);
  };

  // Filter items for selected date
  const filteredItems = items.filter(item => {
    // Handle potentially different date formats (ISO string vs YYYY-MM-DD)
    const itemDate = item.date ? (item.date.includes('T') ? item.date.split('T')[0] : item.date) : '';
    return itemDate === selectedDate;
  });

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Left Sidebar: Form & Visuals */}
      <div className="w-full lg:w-[400px] flex flex-col gap-6 h-full">

        {/* 3D Living Stat Card */}
        <div className="relative h-48 bg-gradient-to-br from-indigo-600/20 to-pink-600/10 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl group">
          <div className="absolute inset-0 -z-10">
            <Canvas camera={{ position: [0, 0, 4] }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1.5} color="#ec4899" />
              <Suspense fallback={null}>
                <LivingTimeline3D itemsCount={filteredItems.length} />
              </Suspense>
            </Canvas>
          </div>

          <div className="p-6 h-full flex flex-col justify-between relative">
            <div className="flex justify-between items-start">
              <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                <Zap size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white">Flow State Active</span>
              </div>
              <Sparkles size={18} className="text-indigo-400 animate-pulse" />
            </div>

            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Tasks for {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-white">{filteredItems.length}</span>
                <span className="text-sm font-bold text-indigo-400">Total Tasks</span>
              </div>
            </div>
          </div>
        </div>

        {/* Input Form Section */}
        <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 shadow-2xl flex-1 overflow-y-auto custom-scrollbar">
          <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-white uppercase tracking-tighter">
            <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400 border border-indigo-500/20">
              <Plus size={20} />
            </div>
            Design Your Day
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Date Picker */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Target Date</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={18} className="text-indigo-400" />
                </div>
                <input 
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 block pl-10 p-3 transition-all outline-none group-hover:bg-white/10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Time"
                type="time"
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value);
                  if (errors.startTime) setErrors({ ...errors, startTime: '' });
                  if (errors.endTime) setErrors({ ...errors, endTime: '' });
                }}
                error={errors.startTime}
                className="bg-white/5 border-white/10 h-11"
              />
              <Input
                label="End Time"
                type="time"
                value={endTime}
                onChange={(e) => {
                  setEndTime(e.target.value);
                  if (errors.endTime) setErrors({ ...errors, endTime: '' });
                }}
                error={errors.endTime}
                className="bg-white/5 border-white/10 h-11"
              />
            </div>

            <Input
              label="Work Detail"
              placeholder="What is your focus?"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors({ ...errors, title: '' });
              }}
              error={errors.title}
              className="bg-white/5 border-white/10"
              startIcon={<LayoutDashboard size={18} />}
            />

            <Input
              label="Note (Optional)"
              placeholder="Any specific goals?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-white/5 border-white/10"
              startIcon={<Clock size={18} />}
            />

            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Atmosphere</label>
              <div className="flex gap-3 px-1">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`w-9 h-9 rounded-xl ${c} transition-all duration-300 relative ${selectedColor === c
                        ? 'scale-110 ring-4 ring-indigo-500/30 border-2 border-white'
                        : 'opacity-40 hover:opacity-100 hover:scale-105 border border-white/10'
                      }`}
                    onClick={() => setSelectedColor(c)}
                  >
                    {selectedColor === c && <div className="absolute inset-0 bg-white/20 animate-pulse rounded-lg" />}
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full h-14 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:scale-[1.02] transition-all duration-300 font-bold text-lg rounded-2xl shadow-xl shadow-indigo-600/20 active:scale-95">
              Add to Timeline
            </Button>
          </form>
        </div>
      </div>

      {/* Main Content: Timeline Section */}
      <div className="flex-1 bg-slate-900/20 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 shadow-2xl flex flex-col group overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] -z-10 rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-600/10 blur-[100px] -z-10 rounded-full" />

        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-black flex items-center gap-4 text-white uppercase tracking-tighter">
              <div className="p-3 bg-pink-500/20 rounded-2xl text-pink-400 border border-pink-500/20 shadow-lg shadow-pink-500/10">
                <Calendar size={24} />
              </div>
              <span className="hidden md:inline">Timeline</span>
            </h2>
            
            {/* Date Navigator */}
            <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/10">
              <button 
                onClick={() => changeDate(-1)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="px-4 font-bold text-white text-sm whitespace-nowrap">
                {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric' })}
              </div>
              <button 
                onClick={() => changeDate(1)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 bg-white/5 px-4 py-2 rounded-full border border-white/5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live Sync
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-4 space-y-8 relative pb-20 custom-scrollbar">
          {/* Vertical Line */}
          <div className="absolute left-[95px] top-4 bottom-4 w-1 bg-gradient-to-b from-indigo-500/50 via-pink-500/50 to-indigo-500/50 rounded-full opacity-20" />

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 animate-pulse">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Synchronizing Schedule...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-40 text-center animate-in fade-in zoom-in duration-500">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10 shadow-2xl">
                <Clock size={40} className="text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No plans for this day.</h3>
              <p className="text-gray-400 max-w-xs font-medium">Capture your vision and design your day. Time is waiting for you.</p>
              <Button 
                onClick={() => document.querySelector('input[name="title"]')?.focus()}
                className="mt-6 bg-white/5 hover:bg-white/10 text-white border border-white/10"
              >
                Add First Task
              </Button>
            </div>
          ) : (
            filteredItems.map((item, idx) => (
              <div key={item._id} className="flex group/item animate-in slide-in-from-left duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                {/* Time Column */}
                <div className="w-[85px] flex flex-col items-end mr-8 pt-2">
                  <span className="font-black text-2xl text-white tracking-tighter transition-all group-hover/item:text-indigo-400">{item.startTime}</span>
                  <span className="text-sm text-gray-500 font-bold tracking-widest uppercase">{item.endTime}</span>
                  <div className="mt-3 bg-white/5 border border-white/10 px-2 py-1 rounded-lg">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-wider whitespace-nowrap">
                      {getDuration(item.startTime, item.endTime)}
                    </span>
                  </div>
                </div>

                {/* Card Container */}
                <div className="flex-1 pb-4 relative">
                  {/* Bullet Point on Line */}
                  <div className={`absolute -left-[35px] top-4 w-4 h-4 rounded-full border-4 border-slate-950 ${item.color} shadow-lg z-10 transition-transform group-hover/item:scale-125`} />

                  <div className="bg-white/5 backdrop-blur-xl border border-white/5 hover:border-white/20 p-6 rounded-[2rem] transition-all duration-500 hover:translate-x-2 group-hover/item:bg-white/10 group-hover/item:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] cursor-default">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-2xl font-black text-white leading-tight uppercase tracking-tight">{item.title}</h3>
                          <div className={`w-2 h-2 rounded-full ${item.color} animate-pulse shadow-[0_0_10px_currentColor]`} />
                        </div>
                        {item.description && (
                          <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-2xl">{item.description}</p>
                        )}
                        <div className="flex items-center gap-4 pt-2">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            <Clock size={12} /> Scheduled
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                            <Zap size={12} /> High Priority
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="opacity-0 group-hover/item:opacity-100 p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all duration-300"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Scheduler;