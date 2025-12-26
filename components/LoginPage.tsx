import React, { useState, useRef, Suspense } from 'react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { ArrowRight, Lock, User, Zap, ArrowLeft, Mail, X, Check, Shield, Globe } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface LoginPageProps {
  onLogin: () => void;
  onBack?: () => void;
}

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const Logo3D = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.5;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[1, 0]} />
        <MeshDistortMaterial 
          color="#6366f1" 
          speed={2} 
          distort={0.4} 
          radius={1}
          emissive="#4f46e5"
          emissiveIntensity={0.5}
        />
      </mesh>
    </Float>
  );
};

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onBack }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Sign In State
  const [username, setUsername] = useState('dev_user');
  const [password, setPassword] = useState('123456');

  // Sign Up State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [role, setRole] = useState('');

  // Validation State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    if (mode === 'signin') {
        if (!username.trim()) {
            newErrors.username = "Username or Email is required";
            isValid = false;
        }
        if (!password) {
            newErrors.password = "Password is required";
            isValid = false;
        }
    } else {
        if (!fullName.trim()) {
            newErrors.fullName = "Full Name is required";
            isValid = false;
        }
        if (!email.trim()) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Please enter a valid email address";
            isValid = false;
        }
        if (!newPassword) {
            newErrors.password = "Password is required";
            isValid = false;
        } else if (newPassword.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
            isValid = false;
        }
        if (!role) {
            newErrors.role = "Please select your primary role";
            isValid = false;
        }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onLogin();
      }, 800);
    }, 1800);
  };

  const handleGoogleClick = () => setShowGoogleModal(true);

  const selectGoogleAccount = (accountName: string) => {
    setShowGoogleModal(false);
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        setTimeout(() => {
            onLogin();
        }, 800);
    }, 1500);
  };

  const toggleMode = () => {
      setMode(prev => prev === 'signin' ? 'signup' : 'signin');
      setErrors({});
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center overflow-hidden font-sans">
      
      {/* Official Google Modal Simulation */}
      {showGoogleModal && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white text-gray-800 w-full max-w-[360px] rounded-lg shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
              <div className="p-8 pb-4 text-center">
                 <div className="flex justify-center mb-4">
                    <GoogleIcon />
                 </div>
                 <h2 className="text-2xl font-normal text-[#202124] mb-2">Sign in</h2>
                 <p className="text-base text-[#202124] mb-6">to continue to TimeFlow</p>
                 
                 <div className="space-y-0.5 text-left">
                    <button onClick={() => selectGoogleAccount('dev')} className="w-full flex items-center gap-3 p-3 hover:bg-[#f8f9fa] border-t border-gray-100 transition-colors group">
                       <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-medium text-sm">D</div>
                       <div className="flex-1 overflow-hidden">
                          <div className="text-sm font-medium text-[#3c4043] truncate">Developer Account</div>
                          <div className="text-xs text-[#70757a] truncate">dev.user@timeflow.app</div>
                       </div>
                    </button>
                    <button onClick={() => selectGoogleAccount('personal')} className="w-full flex items-center gap-3 p-3 hover:bg-[#f8f9fa] border-t border-gray-100 transition-colors group">
                       <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-medium text-sm">S</div>
                       <div className="flex-1 overflow-hidden">
                          <div className="text-sm font-medium text-[#3c4043] truncate">Shehan Perera</div>
                          <div className="text-xs text-[#70757a] truncate">shehan.p@gmail.com</div>
                       </div>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 hover:bg-[#f8f9fa] border-t border-gray-100 transition-colors group">
                       <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center">
                          <User size={16} className="text-gray-500" />
                       </div>
                       <div className="flex-1 text-sm font-medium text-[#3c4043]">Use another account</div>
                    </button>
                 </div>
              </div>
              <div className="px-8 py-6 text-xs text-[#70757a] leading-relaxed border-t border-gray-100">
                 To continue, Google will share your name, email address, language preference, and profile picture with TimeFlow.
                 <div className="mt-4 flex gap-4 font-medium text-gray-600">
                    <button className="hover:text-black">Privacy Policy</button>
                    <button className="hover:text-black">Terms of Service</button>
                 </div>
              </div>
              <button 
                onClick={() => setShowGoogleModal(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
              >
                <X size={20} />
              </button>
           </div>
        </div>
      )}

      <div className="w-full max-w-[1000px] grid lg:grid-cols-2 gap-0 overflow-hidden bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] m-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Left Side: Visuals & Branding */}
        <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-indigo-600/20 to-pink-600/10 border-r border-white/5 overflow-hidden">
           {/* 3D Background element */}
           <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_70%)]" />
           <div className="absolute inset-0 -z-20 opacity-40">
              <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#6366f1" />
                <Suspense fallback={null}>
                  <Logo3D />
                </Suspense>
              </Canvas>
           </div>

           <div className="space-y-2">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                   <span className="font-bold text-xl text-white">T</span>
                 </div>
                 <span className="text-2xl font-bold tracking-tight text-white uppercase tracking-widest">TimeFlow</span>
              </div>
           </div>

           <div className="space-y-6">
              <h2 className="text-4xl font-extrabold text-white leading-tight">
                Plan like a pro, <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-pink-300">Live like a king.</span>
              </h2>
              <div className="space-y-4">
                 <div className="flex items-center gap-4 text-gray-300">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                       <Shield size={20} className="text-indigo-400" />
                    </div>
                    <p className="text-sm font-medium">Enterprise-grade security and encryption</p>
                 </div>
                 <div className="flex items-center gap-4 text-gray-300">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                       <Globe size={20} className="text-pink-400" />
                    </div>
                    <p className="text-sm font-medium">Sync seamlessly across all your devices</p>
                 </div>
              </div>
           </div>

           <div className="pt-8 border-t border-white/5">
              <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">Join 10,000+ top performers worldwide</p>
           </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center h-full max-h-[90vh] overflow-y-auto custom-scrollbar">
          {onBack && !success && (
              <button onClick={onBack} className="absolute top-8 right-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium px-4 py-2 rounded-full border border-white/5 hover:border-white/10 bg-white/5">
                  <ArrowLeft size={16} /> Close
              </button>
          )}

          {success ? (
            <div className="flex flex-col items-center justify-center space-y-6 animate-in zoom-in duration-500 text-center">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                <Check size={40} className="text-green-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Authenticated Successfully</h3>
                <p className="text-gray-400">Preparing your personalized workspace...</p>
              </div>
              <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden max-w-xs mx-auto">
                <div className="bg-green-500 h-full animate-progress-fast" />
              </div>
            </div>
          ) : (
            <>
              <div className="mb-10">
                <h1 className="text-3xl font-bold text-white mb-2">
                    {mode === 'signin' ? 'Sign In' : 'Create Account'}
                </h1>
                <p className="text-gray-400">
                    {mode === 'signin' ? "Welcome back! Let's get things done." : "Join the future of productivity today."}
                </p>
              </div>

              <div className="space-y-6">
                 <button
                    type="button"
                    onClick={handleGoogleClick}
                    disabled={loading}
                    className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold h-12 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed group"
                 >
                    <GoogleIcon />
                    <span className="group-hover:translate-x-0.5 transition-transform">Continue with Google</span>
                 </button>

                 <div className="relative flex items-center py-1">
                    <div className="flex-grow border-t border-white/5"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-500 text-xs font-semibold uppercase tracking-widest">Or use email</span>
                    <div className="flex-grow border-t border-white/5"></div>
                 </div>

                 <form onSubmit={handleAuth} className="space-y-4">
                    {mode === 'signup' && (
                       <>
                        <Input 
                            label="Full Name" 
                            placeholder="e.g. Shehan Perera" 
                            startIcon={<User size={18} />}
                            value={fullName}
                            onChange={(e) => {
                                setFullName(e.target.value);
                                if (errors.fullName) setErrors({...errors, fullName: ''});
                            }}
                            error={errors.fullName}
                            className="bg-white/5 border-white/10"
                        />
                        <div className="space-y-1">
                           <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1 mb-1 block">Role</label>
                           <div className="grid grid-cols-2 gap-2">
                              {['Professional', 'Entrepreneur', 'Student', 'Creative'].map((r) => (
                                 <button
                                    key={r}
                                    type="button"
                                    onClick={() => {
                                       setRole(r);
                                       if (errors.role) setErrors({...errors, role: ''});
                                    }}
                                    className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                                       role === r 
                                       ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                                       : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:border-white/10'
                                    }`}
                                 >
                                    {r}
                                 </button>
                              ))}
                           </div>
                           {errors.role && <p className="text-xs text-red-300 mt-1 ml-1">{errors.role}</p>}
                        </div>
                       </>
                    )}
                    
                    <Input 
                        label={mode === 'signin' ? "Username or Email" : "Email Address"}
                        type={mode === 'signup' ? "email" : "text"}
                        placeholder={mode === 'signup' ? "name@example.com" : "Enter your username"} 
                        startIcon={mode === 'signup' ? <Mail size={18} /> : <User size={18} />}
                        value={mode === 'signup' ? email : username}
                        onChange={(e) => {
                            if (mode === 'signup') {
                                setEmail(e.target.value);
                                if (errors.email) setErrors({...errors, email: ''});
                            } else {
                                setUsername(e.target.value);
                                if (errors.username) setErrors({...errors, username: ''});
                            }
                        }}
                        error={mode === 'signup' ? errors.email : errors.username}
                        className="bg-white/5 border-white/10"
                    />

                    <div className="space-y-1">
                        <Input 
                            label="Password" 
                            type="password" 
                            placeholder="••••••••" 
                            startIcon={<Lock size={18} />}
                            value={mode === 'signin' ? password : newPassword}
                            onChange={(e) => {
                                if (mode === 'signin') {
                                    setPassword(e.target.value);
                                } else {
                                    setNewPassword(e.target.value);
                                }
                                if (errors.password) setErrors({...errors, password: ''});
                            }}
                            error={errors.password}
                            className="bg-white/5 border-white/10"
                        />
                        {mode === 'signin' && (
                            <div className="flex justify-end pr-1">
                                <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium">Forgot password?</a>
                            </div>
                        )}
                    </div>

                    <div className="pt-4">
                        <Button 
                           type="submit" 
                           className="w-full h-12 text-base font-bold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 shadow-xl shadow-indigo-600/20 rounded-xl" 
                           isLoading={loading}
                        >
                            <span>{mode === 'signin' ? 'Sign In to Workspace' : 'Create My Account'}</span>
                            {!loading && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
                        </Button>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/5 text-center">
                       <p className="text-gray-400 text-sm">
                          {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
                          <button 
                              type="button"
                              onClick={toggleMode}
                              className="text-white font-bold hover:text-indigo-400 transition-colors"
                          >
                              {mode === 'signin' ? 'Sign Up Now' : 'Sign In Instead'}
                          </button>
                       </p>
                    </div>
                 </form>
              </div>
            </>
          )}
        </div>
      </div>
      
      <style>{`
        .animate-progress-fast {
          animation: progress 0.8s ease-in-out forwards;
        }
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default LoginPage;