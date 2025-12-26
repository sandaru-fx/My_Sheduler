import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/Button';
import ContactForm from './ContactForm';
import { ArrowRight, Layout, Zap, Palette, CheckCircle, Clock, Star, MousePointer2, Sparkles, Rocket, ShieldCheck, Calendar, Users, Briefcase, BarChart4, Brain, Mic, Globe, Layers, Headphones, Mail, MapPin, Phone } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn?: () => void;
  onSignUp?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onSignIn, onSignUp }) => {
  const [activeSection, setActiveSection] = useState('hero');
  const featuresRef = useRef<HTMLDivElement>(null);
  const solutionsRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  
  // Handle scroll and update active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      if (featuresRef.current && solutionsRef.current && pricingRef.current) {
        const featuresPosition = featuresRef.current.offsetTop;
        const solutionsPosition = solutionsRef.current.offsetTop;
        const pricingPosition = pricingRef.current.offsetTop;
        
        if (scrollPosition >= pricingPosition) {
          setActiveSection('pricing');
        } else if (scrollPosition >= solutionsPosition) {
          setActiveSection('solutions');
        } else if (scrollPosition >= featuresPosition) {
          setActiveSection('features');
        } else {
          setActiveSection('hero');
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Scroll to section
  const scrollToSection = (section: string) => {
    let ref;
    switch(section) {
      case 'features':
        ref = featuresRef;
        break;
      case 'solutions':
        ref = solutionsRef;
        break;
      case 'pricing':
        ref = pricingRef;
        break;
      default:
        ref = null;
    }
    
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
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
              <button 
                onClick={() => scrollToSection('features')} 
                className={`hover:text-white transition-colors ${activeSection === 'features' ? 'text-white' : ''}`}
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('solutions')} 
                className={`hover:text-white transition-colors ${activeSection === 'solutions' ? 'text-white' : ''}`}
              >
                Solutions
              </button>
              <button 
                onClick={() => scrollToSection('pricing')} 
                className={`hover:text-white transition-colors ${activeSection === 'pricing' ? 'text-white' : ''}`}
              >
                Pricing
              </button>
            </nav>
            <div className="flex gap-4">
              <button onClick={onSignIn || onGetStarted} className="hidden md:block text-gray-400 hover:text-white transition-colors">Sign In</button>
              <Button onClick={onSignUp || onGetStarted} className="px-8 bg-white text-indigo-950 hover:bg-indigo-50 rounded-full font-bold shadow-xl shadow-white/5">Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Three.js Background */}
      <div className="relative max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-32 flex flex-col lg:flex-row items-center gap-20 min-h-[calc(100vh-80px)]">
        <ThreeJSAnimation />

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
      <div ref={featuresRef} id="features" className="relative py-32 bg-slate-950/50 backdrop-blur-xl border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-xs font-bold uppercase tracking-widest backdrop-blur-md mb-4">
                <Star size={14} className="text-yellow-400" />
                <span>Premium Features</span>
              </div>
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
            <FeatureCard
              icon={<Calendar className="text-emerald-400" />}
              title="Smart Scheduling"
              desc="AI-powered calendar that optimizes your day based on energy levels and priorities."
              gradient="from-emerald-500/10 to-transparent"
            />
            <FeatureCard
              icon={<Mic className="text-purple-400" />}
              title="Voice Commands"
              desc="Schedule tasks and take notes using natural language voice commands."
              gradient="from-purple-500/10 to-transparent"
            />
            <FeatureCard
              icon={<Brain className="text-blue-400" />}
              title="AI Assistant"
              desc="Intelligent assistant that helps you plan, prioritize, and execute your tasks."
              gradient="from-blue-500/10 to-transparent"
            />
          </div>
          
          {/* Feature Highlight */}
          <div className="mt-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-widest">
                <Sparkles size={14} className="animate-pulse" />
                <span>Spotlight Feature</span>
              </div>
              <h3 className="text-4xl font-black tracking-tighter">VOICE COMMAND TECHNOLOGY</h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                Schedule tasks with simple voice commands. Just say "Schedule a meeting tomorrow at 2 PM" and TimeFlow will handle the rest. Our advanced AI understands natural language and context.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-green-500/20 mt-1">
                    <CheckCircle size={16} className="text-green-500" />
                  </div>
                  <p className="text-gray-300">Supports multiple languages and accents</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-green-500/20 mt-1">
                    <CheckCircle size={16} className="text-green-500" />
                  </div>
                  <p className="text-gray-300">Works offline with local processing</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-green-500/20 mt-1">
                    <CheckCircle size={16} className="text-green-500" />
                  </div>
                  <p className="text-gray-300">Intelligent context awareness and disambiguation</p>
                </div>
              </div>
              
              <Button onClick={onGetStarted} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold">
                Try Voice Commands
              </Button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 blur-3xl opacity-30 rounded-full" />
              <div className="relative bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-3xl p-8 shadow-2xl">
                <div className="absolute -top-6 -right-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-4 shadow-lg shadow-indigo-500/30">
                  <Mic size={32} className="text-white" />
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                      <Mic size={20} className="text-indigo-400" />
                    </div>
                    <p className="text-gray-300 font-medium">"Schedule team meeting tomorrow at 3 PM"</p>
                  </div>
                  
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-sm text-gray-400 mb-3">Processing voice command...</p>
                    <div className="flex items-center gap-4 p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                        <Calendar size={20} className="text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Team Meeting</p>
                        <p className="text-gray-400 text-sm">Tomorrow at 3:00 PM</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle size={20} className="text-green-400" />
                    </div>
                    <p className="text-green-300 font-medium">Task scheduled successfully!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Solutions Section */}
      <div ref={solutionsRef} id="solutions" className="relative py-32 bg-gradient-to-b from-slate-950 to-slate-900 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-blue-300 text-xs font-bold uppercase tracking-widest backdrop-blur-md mb-4">
              <Briefcase size={14} className="text-blue-400" />
              <span>Business Solutions</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">TAILORED FOR EVERY WORKFLOW</h2>
            <p className="text-gray-400 text-lg font-medium leading-relaxed">
              TimeFlow adapts to your unique needs with specialized solutions for different industries and team sizes.
            </p>
          </div>

          {/* Solutions Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <SolutionCard 
              icon={<Users className="text-blue-400" />}
              title="For Teams"
              desc="Collaborative scheduling, shared workspaces, and team analytics to boost productivity across your organization."
              features={[
                "Team calendar synchronization",
                "Role-based permissions",
                "Collaborative task management",
                "Team analytics dashboard"
              ]}
              ctaText="Learn More"
              onClick={onGetStarted}
            />
            
            <SolutionCard 
              icon={<Briefcase className="text-purple-400" />}
              title="For Enterprises"
              desc="Enterprise-grade security, advanced integrations, and custom workflows for large organizations."
              features={[
                "SSO and advanced security",
                "Custom API integrations",
                "Dedicated support team",
                "Compliance and audit tools"
              ]}
              ctaText="Contact Sales"
              onClick={onGetStarted}
              highlight={true}
            />
            
            <SolutionCard 
              icon={<Globe className="text-emerald-400" />}
              title="For Remote Work"
              desc="Tools designed for distributed teams with time zone management and asynchronous collaboration."
              features={[
                "Time zone visualization",
                "Async communication tools",
                "Remote work analytics",
                "Digital wellness features"
              ]}
              ctaText="Explore Features"
              onClick={onGetStarted}
            />
          </div>
          
          {/* Case Study */}
          <div className="mt-32 bg-slate-900/50 border border-white/5 rounded-3xl p-8 md:p-12 backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="lg:w-1/2 space-y-6">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-emerald-300 text-xs font-bold uppercase tracking-widest">
                  <Star size={14} className="text-emerald-400" />
                  <span>Case Study</span>
                </div>
                
                <h3 className="text-3xl font-black tracking-tighter">ACME CORP INCREASED PRODUCTIVITY BY 37%</h3>
                
                <p className="text-gray-400 leading-relaxed">
                  After implementing TimeFlow across their organization, ACME Corp saw a dramatic increase in team productivity and employee satisfaction.
                </p>
                
                <div className="grid grid-cols-2 gap-6 pt-4">
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-4xl font-black text-indigo-400 mb-2">37%</p>
                    <p className="text-sm text-gray-400">Productivity Increase</p>
                  </div>
                  
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-4xl font-black text-pink-400 mb-2">42%</p>
                    <p className="text-sm text-gray-400">Meeting Reduction</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 pt-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" alt="CEO" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-white">John Smith</p>
                    <p className="text-sm text-gray-400">CTO, ACME Corporation</p>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-1/2 bg-slate-800/50 rounded-2xl p-8 border border-white/10 relative">
                <div className="absolute -top-4 -right-4 bg-indigo-500 rounded-full w-8 h-8 flex items-center justify-center">
                  <span className="text-white font-bold">"</span>
                </div>
                
                <p className="text-xl text-gray-300 italic leading-relaxed">
                  TimeFlow has transformed how our teams collaborate. The voice command feature alone saves each employee an average of 5 hours per week. The ROI has been incredible, and our teams are happier and more focused.
                </p>
                
                <div className="mt-8 flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={20} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div ref={pricingRef} id="pricing" className="relative py-32 bg-slate-950 border-t border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 to-purple-900/10" />
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-purple-300 text-xs font-bold uppercase tracking-widest backdrop-blur-md mb-4">
              <BarChart4 size={14} className="text-purple-400" />
              <span>Simple Pricing</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">CHOOSE YOUR PRODUCTIVITY LEVEL</h2>
            <p className="text-gray-400 text-lg font-medium leading-relaxed">
              Select the plan that best fits your needs. All plans include core features with no hidden fees.
            </p>
          </div>

          {/* Pricing Toggle */}
          <div className="flex justify-center mb-16">
            <div className="inline-flex items-center p-1 bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-xl">
              <button className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-bold">
                Monthly
              </button>
              <button className="px-6 py-2 rounded-lg text-gray-400 font-bold hover:text-white transition-colors">
                Annual
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-3xl p-8 transition-all duration-300 hover:border-indigo-500/30 hover:translate-y-[-4px]">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold mb-1">Starter</h3>
                  <p className="text-gray-400 text-sm">For individuals</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <Calendar size={24} className="text-indigo-400" />
                </div>
              </div>
              
              <div className="mb-6">
                <span className="text-4xl font-black">$9</span>
                <span className="text-gray-400">/month</span>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-green-500/20 mt-1">
                    <CheckCircle size={14} className="text-green-500" />
                  </div>
                  <p className="text-gray-300 text-sm">Personal schedule</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-green-500/20 mt-1">
                    <CheckCircle size={14} className="text-green-500" />
                  </div>
                  <p className="text-gray-300 text-sm">Basic voice commands</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-green-500/20 mt-1">
                    <CheckCircle size={14} className="text-green-500" />
                  </div>
                  <p className="text-gray-300 text-sm">3 themes</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-green-500/20 mt-1">
                    <CheckCircle size={14} className="text-green-500" />
                  </div>
                  <p className="text-gray-300 text-sm">7-day history</p>
                </div>
              </div>
              
              <Button onClick={onGetStarted} variant="secondary" className="w-full py-4 border-indigo-500/30 hover:bg-indigo-500/10 font-bold">
                Get Started
              </Button>
            </div>
            
            {/* Pro Plan */}
            <div className="bg-gradient-to-b from-indigo-950/50 to-slate-900/50 backdrop-blur-sm border border-indigo-500/30 rounded-3xl p-8 transform scale-105 shadow-xl shadow-indigo-500/10 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider">
                Most Popular
              </div>
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold mb-1">Pro</h3>
                  <p className="text-gray-400 text-sm">For professionals</p>
                </div>
                <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
                  <Zap size={24} className="text-indigo-400" />
                </div>
              </div>
              
              <div className="mb-6">
                <span className="text-4xl font-black">$19</span>
                <span className="text-gray-400">/month</span>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-green-500/20 mt-1">
                    <CheckCircle size={14} className="text-green-500" />
                  </div>
                  <p className="text-gray-300 text-sm">Everything in Starter</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-green-500/20 mt-1">
                    <CheckCircle size={14} className="text-green-500" />
                  </div>
                  <p className="text-gray-300 text-sm">Advanced voice commands</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-green-500/20 mt-1">
                    <CheckCircle size={14} className="text-green-500" />
                  </div>
                  <p className="text-gray-300 text-sm">All themes</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-green-500/20 mt-1">
                    <CheckCircle size={14} className="text-green-500" />
                  </div>
                  <p className="text-gray-300 text-sm">30-day history</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-green-500/20 mt-1">
                    <CheckCircle size={14} className="text-green-500" />
                  </div>
                  <p className="text-gray-300 text-sm">Priority support</p>
                </div>
              </div>
              
              <Button onClick={onGetStarted} className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold">
                Upgrade to Pro
              </Button>
            </div>
            
            {/* Enterprise Plan */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-3xl p-8 transition-all duration-300 hover:border-indigo-500/30 hover:translate-y-[-4px]">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold mb-1">Enterprise</h3>
                  <p className="text-gray-400 text-sm">For organizations</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <Briefcase size={24} className="text-indigo-400" />
                </div>
              </div>
              
              <div className="mb-6">
                <span className="text-4xl font-black">Custom</span>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-green-500/20 mt-1">
                    <CheckCircle size={14} className="text-green-500" />
                  </div>
                  <p className="text-gray-300 text-sm">Everything in Pro</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-green-500/20 mt-1">
                    <CheckCircle size={14} className="text-green-500" />
                  </div>
                  <p className="text-gray-300 text-sm">Custom integrations</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-green-500/20 mt-1">
                    <CheckCircle size={14} className="text-green-500" />
                  </div>
                  <p className="text-gray-300 text-sm">Dedicated account manager</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-green-500/20 mt-1">
                    <CheckCircle size={14} className="text-green-500" />
                  </div>
                  <p className="text-gray-300 text-sm">Unlimited history</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-green-500/20 mt-1">
                    <CheckCircle size={14} className="text-green-500" />
                  </div>
                  <p className="text-gray-300 text-sm">24/7 premium support</p>
                </div>
              </div>
              
              <Button onClick={onGetStarted} variant="secondary" className="w-full py-4 border-indigo-500/30 hover:bg-indigo-500/10 font-bold">
                Contact Sales
              </Button>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="mt-32">
            <h3 className="text-3xl font-black tracking-tighter text-center mb-12">FREQUENTLY ASKED QUESTIONS</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-indigo-500/30 transition-all duration-300">
                <h4 className="text-xl font-bold mb-4">Can I change plans later?</h4>
                <p className="text-gray-400">Yes, you can upgrade, downgrade, or cancel your plan at any time. Changes take effect at the start of the next billing cycle.</p>
              </div>
              
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-indigo-500/30 transition-all duration-300">
                <h4 className="text-xl font-bold mb-4">Is there a free trial?</h4>
                <p className="text-gray-400">Yes, all plans come with a 14-day free trial. No credit card required to start your trial.</p>
              </div>
              
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-indigo-500/30 transition-all duration-300">
                <h4 className="text-xl font-bold mb-4">What payment methods do you accept?</h4>
                <p className="text-gray-400">We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.</p>
              </div>
              
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-indigo-500/30 transition-all duration-300">
                <h4 className="text-xl font-bold mb-4">How secure is my data?</h4>
                <p className="text-gray-400">Your data is encrypted at rest and in transit. We use industry-standard security practices and regular audits.</p>
              </div>
            </div>
          </div>
          
          {/* Contact Section */}
          <div className="mt-32">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-xs font-bold uppercase tracking-widest backdrop-blur-md mb-4">
                <Mail size={14} className="text-indigo-400" />
                <span>Get In Touch</span>
              </div>
              <h3 className="text-4xl font-black tracking-tighter mb-6">READY TO TRANSFORM YOUR PRODUCTIVITY?</h3>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">Have questions or need assistance? Our team is here to help you get the most out of TimeFlow.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <ContactForm />
              </div>
              
              {/* Contact Info */}
              <div className="space-y-8">
                <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-xl">
                  <h4 className="text-xl font-bold mb-6">Company Information</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
                        <MapPin size={20} className="text-indigo-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Address</p>
                        <p className="text-gray-400">123 Productivity Street<br />Tech Valley, CA 94103</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
                        <Mail size={20} className="text-indigo-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Email</p>
                        <p className="text-gray-400">contact@timeflow.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
                        <Phone size={20} className="text-indigo-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Phone</p>
                        <p className="text-gray-400">+1 (555) 123-4567</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-xl">
                  <h4 className="text-xl font-bold mb-6">Business Hours</h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <p className="text-gray-400">Monday - Friday</p>
                      <p className="text-white font-medium">9:00 AM - 6:00 PM</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-400">Saturday</p>
                      <p className="text-white font-medium">10:00 AM - 4:00 PM</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-400">Sunday</p>
                      <p className="text-white font-medium">Closed</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button onClick={onGetStarted} className="flex-1 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl">
                    Start Free Trial
                  </Button>
                  <Button onClick={onGetStarted} variant="secondary" className="flex-1 py-4 border-indigo-500/30 hover:bg-indigo-500/10 font-bold rounded-xl">
                    Schedule Demo
                  </Button>
                </div>
              </div>
            </div>
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

interface SolutionCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  features: string[];
  ctaText: string;
  onClick: () => void;
  highlight?: boolean;
}

const SolutionCard: React.FC<SolutionCardProps> = ({ 
  icon, 
  title, 
  desc, 
  features, 
  ctaText, 
  onClick, 
  highlight = false 
}) => (
  <div 
    className={`p-8 rounded-3xl border transition-all duration-500 hover:-translate-y-2 ${highlight 
      ? 'bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border-indigo-500/30 shadow-xl shadow-indigo-500/10' 
      : 'bg-white/5 border-white/10 hover:border-indigo-500/20'}`}
  >
    <div className="flex items-center gap-4 mb-6">
      <div className={`p-3 rounded-xl flex items-center justify-center ${highlight ? 'bg-indigo-500/20 border border-indigo-500/30' : 'bg-white/5 border border-white/10'}`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold">{title}</h3>
    </div>
    
    <p className="text-gray-400 mb-8 leading-relaxed">{desc}</p>
    
    <div className="space-y-3 mb-8">
      {features.map((feature, index) => (
        <div key={index} className="flex items-start gap-3">
          <div className="p-1 rounded-full bg-green-500/20 mt-1">
            <CheckCircle size={14} className="text-green-500" />
          </div>
          <p className="text-gray-300 text-sm">{feature}</p>
        </div>
      ))}
    </div>
    
    <Button 
      onClick={onClick} 
      className={highlight 
        ? 'w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold' 
        : 'w-full bg-white/5 hover:bg-white/10 text-white font-bold border border-white/10'}
    >
      {ctaText}
    </Button>
  </div>
);

// Three.js Animation Component
const ThreeJSAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Import Three.js dynamically to avoid SSR issues
    const initThree = async () => {
      try {
        const THREE = await import('three');
        const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls');
        
        // Setup scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
          canvas: canvasRef.current as HTMLCanvasElement,
          alpha: true,
          antialias: true
        });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Add objects
        const geometry = new THREE.IcosahedronGeometry(1, 0);
        const material = new THREE.MeshPhongMaterial({
          color: 0x6366f1,
          wireframe: true,
          emissive: 0x6366f1,
          emissiveIntensity: 0.2,
          shininess: 100
        });
        
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);
        
        // Add lights
        const pointLight = new THREE.PointLight(0xec4899, 1);
        pointLight.position.set(2, 3, 4);
        scene.add(pointLight);
        
        const pointLight2 = new THREE.PointLight(0x6366f1, 1);
        pointLight2.position.set(-2, -3, -4);
        scene.add(pointLight2);
        
        // Position camera
        camera.position.z = 3;
        
        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enableZoom = false;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1;
        
        // Handle resize
        const handleResize = () => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        };
        
        window.addEventListener('resize', handleResize);
        
        // Animation loop
        const animate = () => {
          requestAnimationFrame(animate);
          sphere.rotation.x += 0.001;
          sphere.rotation.y += 0.002;
          controls.update();
          renderer.render(scene, camera);
        };
        
        animate();
        
        // Cleanup
        return () => {
          window.removeEventListener('resize', handleResize);
          scene.remove(sphere);
          geometry.dispose();
          material.dispose();
          renderer.dispose();
        };
      } catch (error) {
        console.error('Error initializing Three.js:', error);
      }
    };
    
    initThree();
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 -z-10 w-full h-full pointer-events-none"
    />
  );
};

export default LandingPage;