import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, MeshDistortMaterial, Sphere } from '@react-three/drei';
import { Button } from './ui/Button';
import { CheckCircle, Sparkles, Infinity, Heart, Shield, Zap } from 'lucide-react';

function AnimatedSphere() {
  const meshRef = useRef<any>(null);

  useFrame((state) => {
    if (meshRef.current) {
        const t = state.clock.getElapsedTime();
        meshRef.current.distort = 0.4 + Math.sin(t) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <Sphere args={[1, 100, 200]} scale={1.8}>
        <MeshDistortMaterial
          color="#6366f1"
          attach="material"
          distort={0.5}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

const FreeTierHero: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  return (
    <div className="relative w-full overflow-hidden rounded-[3rem] bg-slate-950 border border-white/10 shadow-2xl isolate">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0 opacity-60">
        <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={1} />
            <pointLight position={[10, 10, 10]} intensity={2} />
            <pointLight position={[-10, -10, -5]} intensity={1} color="#c084fc" />
            <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
            <AnimatedSphere />
        </Canvas>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 px-6 py-24 md:p-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-sm font-bold uppercase tracking-widest backdrop-blur-xl mb-10 shadow-lg animate-fade-in-up">
            <Infinity size={18} className="text-indigo-400" />
            <span>Forever Free</span>
        </div>

        <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-br from-white via-indigo-200 to-indigo-500 drop-shadow-2xl">
            PREMIUM POWER.<br/>ZERO COST.
        </h2>

        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mb-12 leading-relaxed font-medium">
            We believe in democratizing productivity. Experience the full power of TimeFlow without spending a dime. No credit card required, ever.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 mb-20 w-full sm:w-auto">
            <Button onClick={onGetStarted} className="h-16 px-12 text-xl bg-white text-indigo-950 hover:bg-indigo-50 font-black rounded-2xl shadow-2xl shadow-white/10 hover:scale-105 transition-all duration-300">
                Start for Free
            </Button>
            <Button onClick={onGetStarted} variant="secondary" className="h-16 px-12 text-xl border-white/20 hover:bg-white/10 font-bold rounded-2xl backdrop-blur-md">
                Learn More
            </Button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
            {[
                { icon: Zap, text: "Unlimited Scheduling", sub: "Plan without limits" },
                { icon: Shield, text: "Enterprise Security", sub: "Your data is safe" },
                { icon: Heart, text: "Community Supported", sub: "Open source core" },
                { icon: CheckCircle, text: "All Features Included", sub: "No hidden paywalls" },
                { icon: Sparkles, text: "AI Assistant", sub: "Smart productivity" },
                { icon: Infinity, text: "Lifetime Access", sub: "Free forever promise" }
            ].map((item, i) => (
                <div key={i} className="group flex items-center gap-5 bg-white/5 border border-white/5 p-6 rounded-3xl backdrop-blur-md hover:bg-white/10 hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-1">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <item.icon size={24} className="text-indigo-400 group-hover:text-white transition-colors" />
                    </div>
                    <div className="text-left">
                        <h4 className="font-bold text-white text-lg">{item.text}</h4>
                        <p className="text-sm text-gray-400 font-medium">{item.sub}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default FreeTierHero;
