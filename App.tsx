import React, { useState, useEffect, lazy, Suspense } from 'react';
import { ViewMode, UserProfile } from './types';
import { getUserProfile } from './services/db';
import { LayoutDashboard, StickyNote, Menu, LogOut, User, Sparkles, Mic } from 'lucide-react';
import { AuthProvider, useAuth } from './components/AuthContext';
import ServerStatus from './components/ServerStatus';

// Lazy load components
const ThreeBackground = lazy(() => import('./components/ThreeBackground'));
const Scheduler = lazy(() => import('./components/Scheduler'));
const Notes = lazy(() => import('./components/Notes'));
const Settings = lazy(() => import('./components/Settings'));
const LoginPage = lazy(() => import('./components/LoginPage'));
const LandingPage = lazy(() => import('./components/LandingPage'));
const CommandCenter = lazy(() => import('./components/CommandCenter'));
const SignIn = lazy(() => import('./components/SignIn'));
const SignUp = lazy(() => import('./components/SignUp'));

const AppContent: React.FC = () => {
  const { isAuthenticated, signIn, signUp, signOut, updateProfile, user, token } = useAuth();
  // Navigation State
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'app' | 'signin' | 'signup'>('landing');
  
  // If user is authenticated, show app view
  useEffect(() => {
    if (isAuthenticated && user) {
      setCurrentView('app');
    }
  }, [isAuthenticated, user]);

  const [view, setView] = useState<ViewMode>('scheduler');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [previewTheme, setPreviewTheme] = useState<any>(null);
  
  // AI Command Center State
  const [commandCenterOpen, setCommandCenterOpen] = useState(false);
  const [schedulerLastUpdated, setSchedulerLastUpdated] = useState(0);

  useEffect(() => {
    // Load profile on start
    const load = async () => {
      try {
        // If user is authenticated, use their profile from AuthContext
        if (isAuthenticated && user) {
          const userProfile: UserProfile = {
            name: user.name,
            email: user.email,
            role: user.role || 'TimeFlow User',
            bio: user.bio || 'Productivity enthusiast using TimeFlow Scheduler',
            theme: (user.theme as any) || 'neon',
            avatar: user.profilePicture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&h=200&auto=format&fit=crop',
            joinedDate: user.createdAt || new Date().toISOString(),
          };
          setProfile(userProfile);
          setLoadingProfile(false);
        } else {
          // Otherwise load default profile
          const data = await getUserProfile();
          setProfile(data);
          setLoadingProfile(false);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        // Fallback profile
        setProfile({
          name: 'Guest User',
          email: 'guest@example.com',
          role: 'TimeFlow Guest',
          bio: 'Exploring TimeFlow Scheduler',
          theme: 'neon',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&h=200&auto=format&fit=crop',
          joinedDate: new Date().toISOString(),
        });
        setLoadingProfile(false);
      }
    };
    load();

    // Keyboard shortcut for Command Center (Ctrl+K or Cmd+K)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandCenterOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthenticated, user]);

  const handleUpdateProfile = async (newProfile: UserProfile) => {
    try {
      // Optimistically update local state
      setProfile(newProfile);
      setPreviewTheme(null);
      
      // If authenticated, update on backend
      if (isAuthenticated) {
        await updateProfile({
          name: newProfile.name,
          email: newProfile.email,
          profilePicture: newProfile.avatar,
          role: newProfile.role,
          bio: newProfile.bio,
          theme: newProfile.theme
        });
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      // Optionally revert state here if needed
    }
  };

  const handleTaskAddedViaAI = () => {
    setSchedulerLastUpdated(Date.now());
  };

  const handleLoginSuccess = () => {
    setCurrentView('app');
  };

  const handleLogout = () => {
    signOut();
    setCurrentView('landing');
    setView('scheduler'); // Reset internal view
  };
  
  const handleSignIn = async (email: string, password: string) => {
    try {
      await signIn(email, password);
      setCurrentView('app');
    } catch (error) {
      throw error;
    }
  };
  
  const handleSignUp = async (name: string, email: string, password: string) => {
    try {
      await signUp(name, email, password);
      setCurrentView('app');
    } catch (error) {
      throw error;
    }
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
      {/* Server Status Indicator */}
      <div className="fixed top-4 right-4 z-50">
        <ServerStatus />
      </div>

      {/* 3D Background with Dynamic Theme */}
      <Suspense fallback={<div className="absolute inset-0 bg-slate-900"></div>}>
        <ThreeBackground theme={previewTheme || profile.theme} />
      </Suspense>

      {/* --- Landing Page View --- */}
      {currentView === 'landing' && (
        <div className="absolute inset-0 z-50 bg-transparent animate-in fade-in duration-1000">
          <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>}>
            <LandingPage 
              onGetStarted={() => setCurrentView('login')} 
              onSignIn={() => setCurrentView('signin')} 
              onSignUp={() => setCurrentView('signup')} 
            />
          </Suspense>
        </div>
      )}

      {/* --- Login View --- */}
      {currentView === 'login' && (
        <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>}>
          <LoginPage
            onLogin={handleLoginSuccess}
            onBack={() => setCurrentView('landing')}
          />
        </Suspense>
      )}
      
      {/* --- Sign In View --- */}
      {currentView === 'signin' && (
        <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>}>
          <SignIn
            onSignIn={handleSignIn}
            onNavigateToSignUp={() => setCurrentView('signup')}
          />
        </Suspense>
      )}
      
      {/* --- Sign Up View --- */}
      {currentView === 'signup' && (
        <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>}>
          <SignUp
            onSignUp={handleSignUp}
            onNavigateToSignIn={() => setCurrentView('signin')}
          />
        </Suspense>
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
            <div className="flex-1 p-6 lg:p-12 overflow-hidden flex flex-col relative">
              <div className="flex-1 h-full">
                <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>}>
                  {view === 'scheduler' ? (
                    <Scheduler lastUpdated={schedulerLastUpdated} />
                  ) : view === 'notes' ? (
                    <Notes />
                  ) : (
                    <Settings 
                      profile={profile} 
                      onUpdateProfile={handleUpdateProfile}
                      onThemePreview={setPreviewTheme}
                    />
                  )}
                </Suspense>
              </div>

              {/* Floating AI Command Button */}
              {view === 'scheduler' && (
                <button
                  onClick={() => setCommandCenterOpen(true)}
                  className="absolute bottom-8 right-8 w-16 h-16 bg-indigo-600 hover:bg-indigo-500 rounded-full shadow-2xl shadow-indigo-600/40 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group z-30"
                >
                  <div className="absolute inset-0 bg-indigo-400 rounded-full animate-ping opacity-20" />
                  <Mic size={28} className="text-white relative z-10" />
                  <div className="absolute -top-12 right-0 bg-white text-indigo-900 text-xs font-bold px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                    Ask AI (Ctrl+K)
                    <div className="absolute bottom-[-4px] right-6 w-2 h-2 bg-white rotate-45" />
                  </div>
                </button>
              )}
            </div>
          </main>

          <Suspense fallback={null}>
            <CommandCenter 
              isOpen={commandCenterOpen} 
              onClose={() => setCommandCenterOpen(false)}
              onTaskAdded={handleTaskAddedViaAI}
            />
          </Suspense>

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

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;