import React, { useState, useEffect } from 'react';
import { UserProfile, ThemeVariant } from '../types';
import { saveUserProfile } from '../services/db';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { User, Palette, Check, Snowflake, Sun, Moon, Sparkles, Flower2, Mail, Briefcase, Info, Calendar, Camera, Shield, Bell, AppWindow, Zap } from 'lucide-react';

interface SettingsProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onThemePreview?: (theme: ThemeVariant | null) => void;
}

const ThemeCard = ({
  theme,
  current,
  onClick,
  onPreview,
  icon: Icon,
  label
}: {
  theme: ThemeVariant;
  current: ThemeVariant;
  onClick: () => void;
  onPreview?: (theme: ThemeVariant | null) => void;
  icon: any;
  label: string;
}) => {
  const isSelected = theme === current;
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => onPreview && onPreview(theme)}
      onMouseLeave={() => onPreview && onPreview(null)}
      className={`relative group flex flex-col items-center justify-center p-6 rounded-3xl border transition-all duration-500 overflow-hidden ${isSelected
          ? 'bg-indigo-500/20 border-indigo-500 shadow-[0_20px_40px_-15px_rgba(99,102,241,0.3)] scale-105 z-10'
          : 'bg-slate-900/40 border-white/5 hover:border-white/20 hover:bg-slate-900/60 hover:scale-105'
        }`}
    >
      <div className={`p-4 rounded-2xl mb-4 transition-all duration-300 ${isSelected ? 'bg-indigo-500 text-white shadow-lg' : 'bg-white/5 text-gray-500 group-hover:text-white group-hover:bg-white/10'}`}>
        <Icon size={28} />
      </div>
      <span className={`text-xs font-black uppercase tracking-widest ${isSelected ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>
        {label}
      </span>
      {isSelected && (
        <div className="absolute top-3 right-3 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg border-2 border-slate-900">
          <Check size={14} className="text-white" />
        </div>
      )}
    </button>
  );
};

const Profile: React.FC<SettingsProps> = ({ profile, onUpdateProfile, onThemePreview }) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'account'>('profile');

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    await saveUserProfile(formData);
    onUpdateProfile(formData);
    setTimeout(() => setSaving(false), 800);
  };

  const NavButton = ({ id, label, icon: Icon }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-300 font-bold uppercase tracking-widest text-xs border ${activeTab === id
          ? 'bg-white/10 border-white/20 text-white shadow-xl'
          : 'text-gray-500 border-transparent hover:text-gray-300 hover:bg-white/5'
        }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );

  return (
    <div className="h-full flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto w-full">

      {/* Profile Header Card */}
      <div 
        className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group transition-all duration-500 hover:shadow-indigo-500/10 hover:border-white/20"
        style={{ perspective: '1000px' }}
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 blur-[100px] -z-10 rounded-full group-hover:bg-indigo-600/20 transition-all duration-1000" />

        <div className="flex flex-col md:flex-row items-center gap-10 transform transition-transform duration-500 group-hover:scale-[1.01]">
          <div className="relative group/avatar">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-gradient-to-br from-indigo-500 to-pink-500 p-1 shadow-2xl transition-transform duration-500 group-hover/avatar:rotate-6 group-hover/avatar:scale-105">
              <div className="w-full h-full rounded-[2.3rem] overflow-hidden border-4 border-slate-900 bg-slate-800 relative">
                <img
                  src={formData.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&h=200&auto=format&fit=crop"}
                  alt="Profile"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/avatar:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
            <button className="absolute -bottom-2 -right-2 p-3 bg-indigo-600 text-white rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all border-4 border-slate-900 z-10 hover:bg-indigo-500">
              <Camera size={20} />
            </button>
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="space-y-1">
              <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-400">
                {formData.name}
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <p className="text-indigo-400 font-black uppercase tracking-[0.3em] text-[10px] bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                  {formData.role}
                </p>
                {/* Status Indicator */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Online</span>
                </div>
              </div>
            </div>
            <p className="text-gray-400 font-medium max-w-xl leading-relaxed">
              {formData.bio}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-white/5 py-2 px-4 rounded-full border border-white/5">
                <Calendar size={14} className="text-pink-500" />
                Joined {new Date(formData.joinedDate).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-white/5 py-2 px-4 rounded-full border border-white/5">
                <Sparkles size={14} className="text-emerald-500" />
                Premium Explorer
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center md:justify-start gap-4">
        <NavButton id="profile" label="Official Profile" icon={User} />
        <NavButton id="appearance" label="Atmosphere" icon={Palette} />
        <NavButton id="account" label="Security" icon={Shield} />
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-12">
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-left duration-500">
            <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400 border border-indigo-500/20"><Info size={20} /></div>
                Information
              </h3>
              <div className="space-y-6">
                <Input
                  label="Full Display Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  startIcon={<User size={18} />}
                  className="bg-white/5 border-white/10 h-12"
                />
                <Input
                  label="Professional Role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  startIcon={<Briefcase size={18} />}
                  className="bg-white/5 border-white/10 h-12"
                />
                <Input
                  label="Work Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  startIcon={<Mail size={18} />}
                  className="bg-white/5 border-white/10 h-12"
                />
              </div>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                <div className="p-2 bg-pink-500/20 rounded-xl text-pink-400 border border-pink-500/20"><Zap size={20} /></div>
                Bio & Vision
              </h3>
              <div className="h-full">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Tell your story</label>
                <textarea
                  className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-white text-sm font-medium placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all min-h-[180px] resize-none"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="What drives you to achieve your best?"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl space-y-10 animate-in slide-in-from-right duration-500">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Atmosphere Engine</h2>
              <p className="text-gray-400 font-medium leading-relaxed">Customize the spatial environment of your workspace to match your current flow state.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <ThemeCard
                theme="neon"
                current={formData.theme}
                onClick={() => setFormData({ ...formData, theme: 'neon' })}
                onPreview={onThemePreview}
                icon={Moon}
                label="Neon Night"
              />
              <ThemeCard
                theme="stars"
                current={formData.theme}
                onClick={() => setFormData({ ...formData, theme: 'stars' })}
                onPreview={onThemePreview}
                icon={Sparkles}
                label="Cosmic Void"
              />
              <ThemeCard
                theme="light"
                current={formData.theme}
                onClick={() => setFormData({ ...formData, theme: 'light' })}
                onPreview={onThemePreview}
                icon={Sun}
                label="Crystal Day"
              />
              <ThemeCard
                theme="snow"
                current={formData.theme}
                onClick={() => setFormData({ ...formData, theme: 'snow' })}
                onPreview={onThemePreview}
                icon={Snowflake}
                label="Silent Snow"
              />
              <ThemeCard
                theme="flowers"
                current={formData.theme}
                onClick={() => setFormData({ ...formData, theme: 'flowers' })}
                onPreview={onThemePreview}
                icon={Flower2}
                label="Spring Flora"
              />
            </div>
          </div>
        )}

        {activeTab === 'account' && (
          <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl animate-in fade-in duration-500">
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                <Shield size={40} className="text-gray-500" />
              </div>
              <h3 className="text-2xl font-bold text-white uppercase tracking-tighter">Security Center</h3>
              <p className="text-gray-400 max-w-md font-medium">Enterprise-grade security is active. Your data is protected with 256-bit encryption and spatial isolation.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md mt-6">
                <button className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors text-xs font-black uppercase tracking-widest text-gray-300">
                  <Bell size={16} /> Notifications
                </button>
                <button className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors text-xs font-black uppercase tracking-widest text-gray-300">
                  <AppWindow size={16} /> Device Management
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Action Bar */}
      <div className="sticky bottom-0 bg-slate-950/80 backdrop-blur-3xl border-t border-white/10 p-6 flex justify-between items-center rounded-t-[2.5rem] shadow-[0_-20px_40px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col">
          <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Configuration Status</span>
          <span className="text-indigo-400 font-bold text-sm">Synchronized in real-time</span>
        </div>
        <Button onClick={handleSave} isLoading={saving} className="px-10 h-14 bg-gradient-to-r from-indigo-600 to-indigo-500 font-bold rounded-2xl shadow-xl shadow-indigo-600/20">
          Publish Changes
        </Button>
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
      `}</style>
    </div>
  );
};

export default Profile;