import React from 'react';
import { Button } from './ui/Button';
import { ArrowRight, Layout, Zap, Palette, CheckCircle, Clock, Star, MousePointer2, Sparkles, Rocket, ShieldCheck } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="relative w-full h-full text-white overflow-y-auto overflow-x-hidden font-sans scroll-smooth custom-scrollbar">
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotateX(10deg) rotateY(10deg); }
          50% { transform: translateY(-20px) rotateX(5deg) rotateY(5deg); }
          100% { transform: translateY(0px) rotateX(10deg) rotateY(10deg); }
        }
        @keyframes float-delayed {
          0% { transform: translateY(0px) rotateX(5deg) rotateY(-10deg); }
          50% { transform: translateY(-15px) rotateX(10deg) rotateY(-5deg); }
          100% { transform: translateY(0px) rotateX(5deg) rotateY(-10deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 7s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 4s ease-in-out infinite; }
        .perspective-1000 { perspective: 1000px; }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .text-glow {
          text-shadow: 0 0 20px rgba(99, 102, 241, 0.5);
        }
      `}</style>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 w-full bg-slate-900/40 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-6 md:px-12 py-5 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:rotate-12 transition-transform duration-300">
              <span className="font-bold text-xl text-white">T</span>
            </div>
            <span className="text-2xl font-bold tracking-tighter uppercase">TimeFlow</span>
          </div>
          <div className="flex items-center gap-8 text-sm font-semibold">
            <nav className="hidden lg:flex items-center gap-8 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Features</a>
              <a href="#" className="hover:text-white transition-colors">Solutions</a>
              <a href="#" className="hover:text-white transition-colors">Pricing</a>
            </nav>
            <div className="flex gap-4">
              <button onClick={onGetStarted} className="hidden md:block text-gray-400 hover:text-white transition-colors">Sign In</button>
              <Button onClick={onGetStarted} className="px-8 bg-white text-indigo-950 hover:bg-indigo-50 rounded-full font-bold shadow-xl shadow-white/5">Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-32 flex flex-col lg:flex-row items-center gap-20 min-h-[calc(100vh-80px)]">

        {/* Left Content */}
        <div className="flex-1 space-y-10 animate-in slide-in-from-left duration-1000 z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
            <Sparkles size={14} className="animate-pulse" />
            <span>The Next Generation of Productivity</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
            MASTER <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-glow">
              YOUR TIME.
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-xl leading-relaxed font-medium">
            Escape the chaos. <span className="text-white">TimeFlow</span> is an immersive spatial environment designed to help you focus, plan, and achieve your most ambitious goals.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 pt-4">
            <Button onClick={onGetStarted} className="h-16 px-10 text-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:scale-105 transition-all duration-300 rounded-2xl shadow-2xl shadow-indigo-600/40 font-bold border-t border-white/20">
              Unlock Your Focus
            </Button>
            <Button onClick={onGetStarted} variant="secondary" className="h-16 px-10 text-xl rounded-2xl backdrop-blur-md border-white/10 hover:bg-white/5 font-bold">
              Watch Demo <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-8 pt-8">
            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20 group-hover:scale-110 transition-transform">
                <ShieldCheck size={20} className="text-green-500" />
              </div>
              <span className="text-sm text-gray-400 font-semibold group-hover:text-gray-200 transition-colors">Bank-level Security</span>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                <Rocket size={20} className="text-blue-500" />
              </div>
              <span className="text-sm text-gray-400 font-semibold group-hover:text-gray-200 transition-colors">Instant Setup</span>
            </div>
          </div>
        </div>

        {/* Right Visual Arts */}
        <div className="flex-1 w-full relative h-[500px] lg:h-[700px] perspective-1000 flex items-center justify-center">
          {/* Dynamic Glows */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/30 blur-[120px] rounded-full animate-pulse-glow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-600/20 blur-[100px] rounded-full animate-pulse-glow" style={{ animationDelay: '2s' }} />

          {/* Hero Mockup Cards */}
          <div className="relative w-full max-w-lg">
            {/* Main Card */}
            <div className="w-full aspect-[4/3] bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-500">
              <div className="absolute top-0 left-0 right-0 h-12 bg-white/5 border-b border-white/5 flex items-center px-6 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="pt-20 px-8 space-y-6">
                <div className="h-8 bg-white/5 rounded-lg w-3/4 animate-pulse" />
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-32 bg-indigo-500/20 border border-indigo-500/30 rounded-2xl shadow-lg animate-float" />
                  <div className="h-32 bg-pink-500/20 border border-pink-500/30 rounded-2xl shadow-lg animate-float-delayed" />
                  <div className="h-32 bg-purple-500/20 border border-purple-500/30 rounded-2xl shadow-lg animate-float" />
                </div>
                <div className="h-24 bg-white/5 rounded-2xl w-full" />
              </div>
            </div>

            {/* Floating Stat Card */}
            <div className="absolute -top-10 -right-10 md:-right-16 w-56 p-6 bg-slate-800/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl animate-float-delayed">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Weekly Growth</p>
              <h4 className="text-3xl font-black text-white">+84%</h4>
              <div className="mt-4 flex gap-1 h-8 items-end">
                {[3, 6, 4, 8, 5, 9, 7].map((h, i) => (
                  <div key={i} className="flex-1 bg-indigo-500/40 rounded-sm" style={{ height: `${h * 10}%` }} />
                ))}
              </div>
            </div>

            {/* Floating User Card */}
            <div className="absolute -bottom-12 -left-10 md:-left-16 w-64 p-5 bg-white text-slate-900 rounded-3xl shadow-2xl animate-float flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <CheckCircle size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">Focus Session</p>
                <p className="text-sm font-black">Completed Successfully</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Showcase */}
      <div className="relative py-32 bg-slate-950/50 backdrop-blur-xl border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl space-y-4">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter">BUILT FOR ELITE PERFORMANCE.</h2>
              <p className="text-gray-400 text-lg font-medium leading-relaxed">
                Every pixel is optimized for focus. TimeFlow provides the tools you need without the noise you don't.
              </p>
            </div>
            <Button onClick={onGetStarted} variant="secondary" className="px-8 rounded-full border-indigo-500/30 text-indigo-300 font-bold hover:bg-indigo-500/10">
              Explore All Features
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Layout className="text-indigo-400" />}
              title="Immersive Desktop"
              desc="A distraction-free spatial workspace that adapts to your needs and mood."
              gradient="from-indigo-500/10 to-transparent"
            />
            <FeatureCard
              icon={<Zap className="text-pink-400" />}
              title="Deep Work Mode"
              desc="One-click activation to silence notifications and launch your focus essentials."
              gradient="from-pink-500/10 to-transparent"
            />
            <FeatureCard
              icon={<MousePointer2 className="text-yellow-400" />}
              title="Intelligent Linking"
              desc="Connect your notes, tasks, and calendar events in a visual knowledge graph."
              gradient="from-yellow-500/10 to-transparent"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-slate-950 py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
              <span className="font-bold text-white">T</span>
            </div>
            <span className="font-bold tracking-widest uppercase text-sm">TimeFlow</span>
          </div>

          <div className="flex gap-8 text-sm font-bold text-gray-500 uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>

          <p className="text-gray-600 text-xs font-semibold">
            © {new Date().getFullYear()} TimeFlow. CRAFTED BY EXPERTS.
          </p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, gradient }: any) => (
  <div className={`group p-10 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-white/10 transition-all duration-500 hover:-translate-y-2 cursor-pointer bg-gradient-to-br ${gradient}`}>
    <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-2xl group-hover:shadow-indigo-500/20">
      {icon}
    </div>
    <h3 className="text-2xl font-black mb-4 group-hover:text-indigo-300 transition-colors uppercase tracking-tight">{title}</h3>
    <p className="text-gray-400 leading-relaxed font-medium group-hover:text-gray-300">
      {desc}
    </p>
  </div>
);

export default LandingPage;