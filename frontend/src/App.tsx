import React, { useState, useEffect } from 'react';
import { ViewMode, UserProfile } from './models';
import { getUserProfile } from './services/api';
import ThreeBackground from './components/ThreeBackground';
import Scheduler from './views/SchedulerPage';
import Notes from './views/NotesPage';
import Settings from './views/SettingsPage';
import LoginPage from './views/LoginPage';
import LandingPage from './views/LandingPage';
import { LayoutDashboard, StickyNote, Menu, LogOut, User, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  // Navigation State
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'app'>('landing');

  const [view, setView] = useState<ViewMode>('scheduler');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    // Load profile on start
    const load = async () => {
      const data = await getUserProfile();
      setProfile(data);
      setLoadingProfile(false);
    };
    load();
  }, []);

  const handleUpdateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
  };

  const handleLoginSuccess = () => {
    setCurrentView('app');
  };

  const handleLogout = () => {
    setCurrentView('landing');
    setView('scheduler'); // Reset internal view
  };

  const NavItem = ({ mode, icon: Icon, label }: { mode: ViewMode; icon: any; label: string }) => (
    <button
      onClick={() => {
        setView(mode);
        setSidebarOpen(false); // Close mobile sidebar on select
      }}
      className={`flex items-center gap-4 w-full px-5 py-4 rounded-2xl transition-all duration-500 group relative overflow-hidden ${view === mode
        ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-xl shadow-indigo-600/30'
        : 'text-gray-500 hover:text-white hover:bg-white/5'
        }`}
    >
      <Icon size={20} className={`transition-transform duration-500 ${view === mode ? 'scale-110' : 'group-hover:scale-110'}`} />
      <span className="font-black uppercase tracking-[0.2em] text-xs">{label}</span>
      {view === mode && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white] animate-pulse" />
      )}

      {/* Hover Background Effect */}
      {view !== mode && (
        <div className="absolute inset-0 bg-white/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 -z-10" />
      )}
    </button>
  );

  if (loadingProfile || !profile) {
    return (
      <div className="w-full h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-black uppercase tracking-widest text-xs animate-pulse">Initializing Environment...</p>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-screen ${profile.theme === 'light' ? 'text-slate-900' : 'text-white'} overflow-hidden flex font-sans`}>
      {/* 3D Background with Dynamic Theme */}
      <ThreeBackground theme={profile.theme} />

      {/* --- Landing Page View --- */}
      {currentView === 'landing' && (
        <div className="absolute inset-0 z-50 bg-transparent animate-in fade-in duration-1000">
          <LandingPage onGetStarted={() => setCurrentView('login')} />
        </div>
      )}

      {/* --- Login View --- */}
      {currentView === 'login' && (
        <LoginPage
          onLogin={handleLoginSuccess}
          onBack={() => setCurrentView('landing')}
        />
      )}

      {/* --- Main App View --- */}
      {currentView === 'app' && (
        <>
          {/* Sidebar Navigation */}
          <aside className={`
            fixed lg:relative z-50 h-full w-80 ${profile.theme === 'light' ? 'bg-white/80 border-slate-200' : 'bg-slate-950/40 border-white/5'} lg:bg-transparent backdrop-blur-3xl border-r p-8 flex flex-col gap-10 transition-transform duration-500
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            {/* Branding */}
            <div className="flex items-center gap-4 px-2 group cursor-default">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-indigo-600/30 group-hover:rotate-12 transition-transform duration-300">
                <span className="font-bold text-2xl text-white">T</span>
              </div>
              <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400 uppercase tracking-tighter">
                TimeFlow
              </h1>
            </div>

            {/* Profile Summary Mini Card */}
            <button
              onClick={() => setView('settings')}
              className={`flex items-center gap-4 p-4 rounded-3xl border transition-all duration-500 text-left group
                  ${view === 'settings'
                  ? 'bg-white/10 border-white/20 shadow-xl'
                  : `${profile.theme === 'light' ? 'bg-indigo-50 border-indigo-100 hover:bg-indigo-100' : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'}`
                }
               `}
            >
              <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-slate-900 group-hover:scale-110 transition-transform duration-300">
                <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="overflow-hidden flex-1">
                <p className={`text-sm font-black truncate uppercase tracking-tight ${profile.theme === 'light' ? 'text-slate-800' : 'text-white'}`}>{profile.name}</p>
                <div className="flex items-center gap-1.5">
                  <Sparkles size={10} className="text-indigo-400" />
                  <p className="text-[10px] text-gray-400 truncate font-black tracking-widest uppercase">{profile.role}</p>
                </div>
              </div>
            </button>

            {/* Main Navigation */}
            <nav className="flex-1 space-y-3">
              <NavItem mode="scheduler" icon={LayoutDashboard} label="Daily Timeline" />
              <NavItem mode="notes" icon={StickyNote} label="Knowledge" />
              <NavItem mode="settings" icon={User} label="Official Profile" />
            </nav>

            {/* Sidebar Footer */}
            <div className="space-y-6">
              <button
                onClick={handleLogout}
                className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all duration-300 font-black uppercase tracking-widest text-xs"
              >
                <LogOut size={18} />
                <span>Terminate Session</span>
              </button>

              <div className={`p-6 rounded-3xl border ${profile.theme === 'light' ? 'bg-white/40 border-slate-200' : 'bg-white/5 border-white/5 shadow-inner'}`}>
                <p className="text-[10px] text-gray-500 text-center leading-relaxed font-bold uppercase tracking-widest">
                  "The future depends on what you do today."
                </p>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col h-full relative z-10 overflow-hidden">
            {/* Mobile Header */}
            <header className={`lg:hidden h-20 flex items-center justify-between px-8 border-b backdrop-blur-3xl ${profile.theme === 'light' ? 'bg-white/50 border-slate-200 text-slate-800' : 'bg-slate-950/50 border-white/10 text-white'}`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center">
                  <span className="font-bold text-white text-sm">T</span>
                </div>
                <span className="font-black text-lg uppercase tracking-tighter">
                  {view === 'scheduler' ? 'Timeline' : view === 'notes' ? 'Knowledge' : 'Profile'}
                </span>
              </div>
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-3 bg-white/5 rounded-xl border border-white/10">
                <Menu size={24} />
              </button>
            </header>

            {/* Content Container */}
            <div className="flex-1 p-6 lg:p-12 overflow-hidden flex flex-col">
              <div className="flex-1 h-full">
                {view === 'scheduler' ? (
                  <Scheduler />
                ) : view === 'notes' ? (
                  <Notes />
                ) : (
                  <Settings profile={profile} onUpdateProfile={handleUpdateProfile} />
                )}
              </div>
            </div>
          </main>

          {/* Mobile Overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-md animate-in fade-in duration-300"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default App;