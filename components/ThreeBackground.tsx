import React, { useRef, useMemo, lazy, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { ThemeVariant } from '../types';

// Lazy load heavy components
const Stars = lazy(() => import('@react-three/drei').then(module => ({ default: module.Stars })));
const Cloud = lazy(() => import('@react-three/drei').then(module => ({ default: module.Cloud })));

// --- Shared Components ---

const FloatingShape = ({ position, color, speed, geometry = 'icosahedron' }: any) => {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.cos(t * speed) * 0.2;
    meshRef.current.rotation.y = Math.sin(t * speed) * 0.2;
    meshRef.current.rotation.z = Math.sin(t * speed * 0.5) * 0.1;
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        {geometry === 'icosahedron' ? <icosahedronGeometry args={[1, 0]} /> : <dodecahedronGeometry args={[0.8, 0]} />}
        <meshStandardMaterial 
          color={color} 
          roughness={0.1} 
          metalness={0.8} 
          wireframe 
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  );
};

// --- Scenes ---

const NeonScene = () => {
  // Reduced particle count for better performance
  const count = 80; 
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    return new Array(count).fill(0).map(() => ({
      t: Math.random() * 100,
      factor: 20 + Math.random() * 100,
      speed: 0.01 + Math.random() / 200,
      xFactor: -50 + Math.random() * 100,
      yFactor: -50 + Math.random() * 100,
      zFactor: -50 + Math.random() * 100,
      mx: 0, my: 0
    }));
  }, []);

  useFrame(() => {
    if (!mesh.current) return;
    particles.forEach((particle, i) => {
      let { factor, speed, xFactor, yFactor, zFactor } = particle;
      let t = (particle.t += speed / 2);
      const s = Math.cos(t);
      dummy.position.set(
        xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );
      dummy.scale.set(s, s, s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <fog attach="fog" args={['#0f172a', 10, 35]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#ec4899" />
      <pointLight position={[-10, -10, -10]} intensity={1.5} color="#6366f1" />
      
      <Suspense fallback={null}>
        <Stars radius={100} depth={50} count={2500} factor={4} saturation={0} fade speed={1} />
      </Suspense>
      
      <FloatingShape position={[-6, 2, -5]} color="#ec4899" speed={0.5} />
      <FloatingShape position={[6, -2, -5]} color="#6366f1" speed={0.3} />
      <FloatingShape position={[0, 5, -8]} color="#8b5cf6" speed={0.2} />
      
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <dodecahedronGeometry args={[0.2, 0]} />
        <meshPhongMaterial color="#6366f1" />
      </instancedMesh>
    </>
  );
};

const SnowScene = () => {
  // Reduced particle count for better performance
  const count = 500;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    return new Array(count).fill(0).map(() => ({
      x: (Math.random() - 0.5) * 50,
      y: (Math.random() - 0.5) * 50,
      z: (Math.random() - 0.5) * 30 - 10,
      speed: 0.05 + Math.random() * 0.1,
      wobble: Math.random() * Math.PI * 2
    }));
  }, []);

  useFrame((state) => {
    if (!mesh.current) return;
    particles.forEach((particle, i) => {
      particle.y -= particle.speed;
      particle.x += Math.sin(state.clock.elapsedTime + particle.wobble) * 0.02;
      
      if (particle.y < -25) {
        particle.y = 25;
      }
      
      dummy.position.set(particle.x, particle.y, particle.z);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
       <fog attach="fog" args={['#0f172a', 10, 50]} />
       <ambientLight intensity={0.5} />
       <pointLight position={[0, 10, 0]} intensity={0.5} color="#ffffff" />
       <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
      </instancedMesh>
    </>
  );
};

const FlowersScene = () => {
  const count = 60;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    return new Array(count).fill(0).map(() => ({
      x: (Math.random() - 0.5) * 40,
      y: (Math.random() - 0.5) * 40,
      z: (Math.random() - 0.5) * 20 - 5,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      scale: 0.5 + Math.random() * 0.5,
      color: Math.random() > 0.5 ? '#ec4899' : '#f472b6' // Pink shades
    }));
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    particles.forEach((particle, i) => {
      const y = particle.y + Math.sin(t * 0.5 + particle.x) * 1;
      
      dummy.position.set(particle.x, y, particle.z);
      dummy.rotation.x += particle.rotationSpeed;
      dummy.rotation.y += particle.rotationSpeed;
      dummy.scale.set(particle.scale, particle.scale, particle.scale);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <fog attach="fog" args={['#0f172a', 10, 40]} />
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#fce7f3" />
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <dodecahedronGeometry args={[0.5, 0]} />
        <meshToonMaterial color="#ec4899" />
      </instancedMesh>
      <FloatingShape position={[-5, 0, -10]} color="#10b981" speed={0.2} geometry="icosahedron" />
      <FloatingShape position={[5, 2, -8]} color="#f43f5e" speed={0.3} geometry="icosahedron" />
    </>
  );
};

const LightScene = () => {
   return (
    <>
      <color attach="background" args={['#e2e8f0']} />
      <fog attach="fog" args={['#e2e8f0', 5, 30]} />
      <ambientLight intensity={1} />
      {/* @ts-ignore - Cloud props typing from drei may be narrower */}
      <Cloud opacity={0.5} speed={0.4} width={10} depth={1.5} segments={20} position={[0, 0, -10]} color="#ffffff" />
      <FloatingShape position={[-4, 2, -5]} color="#64748b" speed={0.2} />
      <FloatingShape position={[4, -2, -5]} color="#94a3b8" speed={0.3} />
    </>
   )
}

const StarsScene = () => {
  return (
    <>
      <fog attach="fog" args={['#0f172a', 20, 100]} />
      <ambientLight intensity={0.1} />
      <Suspense fallback={null}>
        <Stars radius={100} depth={50} count={5000} factor={6} saturation={1} fade speed={0.5} />
      </Suspense>
    </>
  )
}

const SceneSelector: React.FC<{ theme: ThemeVariant }> = ({ theme }) => {
  switch (theme) {
    case 'snow': return <SnowScene />;
    case 'flowers': return <FlowersScene />;
    case 'light': return <LightScene />;
    case 'stars': return <StarsScene />;
    case 'neon': default: return <NeonScene />;
  }
};

const ThreeBackground: React.FC<{ theme?: ThemeVariant }> = ({ theme = 'neon' }) => {
  return (
    <div className={`absolute inset-0 -z-10 ${theme === 'light' ? 'bg-slate-200' : 'bg-slate-900'} transition-colors duration-1000`}>
      <Canvas 
        camera={{ position: [0, 0, 15], fov: 45 }}
        dpr={[1, 1.5]} // Limit pixel ratio for better performance
        performance={{ min: 0.5 }} // Allow performance scaling
        gl={{ 
          powerPreference: 'high-performance',
          antialias: false,
          stencil: false,
          depth: false 
        }}
      >
        <Suspense fallback={null}>
          {/* We use the theme as a key to force the SceneSelector to re-mount completely when theme changes */}
          <SceneSelector key={theme} theme={theme as ThemeVariant} />
        </Suspense>
      </Canvas>
      {theme !== 'light' && (
         <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900 opacity-80 pointer-events-none" />
      )}
    </div>
  );
};

export default ThreeBackground;