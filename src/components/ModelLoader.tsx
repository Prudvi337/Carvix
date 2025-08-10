import { useEffect, useState, useRef } from 'react';

interface ModelLoaderProps {
  onLoadingComplete?: () => void;
}

const ModelLoader = ({ onLoadingComplete }: ModelLoaderProps) => {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, vx: number, vy: number, life: number, size: number}>>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Phase descriptions for the car configuration loading experience
  const phases = [
    "Initializing Car Configuration System...",
    "Loading Vehicle 3D Model...",
    "Preparing Material Presets...",
    "Calibrating Lighting Effects...",
    "Optimizing Car Visualization..."
  ];

  useEffect(() => {
    // Create initial particles
    const initialParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      life: Math.random(),
      size: Math.random() * 3 + 1
    }));
    setParticles(initialParticles);

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1;
        
        // Update phase based on progress
        const phase = Math.floor((newProgress / 100) * phases.length);
        setCurrentPhase(Math.min(phase, phases.length - 1));
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => onLoadingComplete?.(), 500);
          return 100;
        }
        return newProgress;
      });
    }, 30);

    return () => {
      clearInterval(interval);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [onLoadingComplete]);

  // Advanced particle system animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      setParticles(prevParticles => 
        prevParticles.map(particle => {
          // Complex particle physics with magnetic attraction to center
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const dx = centerX - particle.x;
          const dy = centerY - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Apply forces based on loading progress
          const force = (progress / 100) * 0.02;
          particle.vx += (dx / distance) * force;
          particle.vy += (dy / distance) * force;
          
          // Add some turbulence
          particle.vx += Math.sin(Date.now() * 0.001 + particle.id) * 0.1;
          particle.vy += Math.cos(Date.now() * 0.001 + particle.id) * 0.1;
          
          // Update position
          particle.x += particle.vx;
          particle.y += particle.vy;
          
          // Apply friction
          particle.vx *= 0.99;
          particle.vy *= 0.99;
          
          // Update life and size based on progress
          particle.life = Math.sin(Date.now() * 0.003 + particle.id) * 0.5 + 0.5;
          particle.size = (Math.sin(Date.now() * 0.002 + particle.id) * 0.5 + 0.5) * 4 + 1;
          
          // Draw particle with advanced effects
          const alpha = particle.life * (progress / 100);
          const hue = (particle.id * 137.508 + Date.now() * 0.1) % 360; // Golden ratio for color distribution
          
          ctx.shadowBlur = particle.size * 2;
          ctx.shadowColor = `hsl(${hue}, 70%, 50%)`;
          ctx.fillStyle = `hsla(${hue}, 70%, 50%, ${alpha})`;
          
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          
          // Draw connecting lines between nearby particles
          prevParticles.forEach(other => {
            if (other.id <= particle.id) return;
            const odx = other.x - particle.x;
            const ody = other.y - particle.y;
            const odist = Math.sqrt(odx * odx + ody * ody);
            
            if (odist < 100) {
              const lineAlpha = (1 - odist / 100) * alpha * 0.3;
              ctx.strokeStyle = `hsla(${hue}, 70%, 50%, ${lineAlpha})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
            }
          });
          
          return particle;
        })
      );
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [progress]);

  const progressAngle = (progress / 100) * 360;
  const pulseIntensity = Math.sin(Date.now() * 0.005) * 0.5 + 0.5;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Advanced Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)' }}
      />
      
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0">
        {/* Animated Gradient Orbs */}
        <div 
          className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl animate-pulse"
          style={{
            background: `conic-gradient(from ${Date.now() * 0.1}deg, #3b82f6, #8b5cf6, #06b6d4, #3b82f6)`,
            left: '10%',
            top: '20%',
            animation: 'float 8s ease-in-out infinite, rotate 20s linear infinite'
          }}
        />
        <div 
          className="absolute w-64 h-64 rounded-full opacity-15 blur-2xl"
          style={{
            background: `radial-gradient(circle, rgba(168,85,247,${pulseIntensity}) 0%, transparent 70%)`,
            right: '15%',
            bottom: '25%',
            animation: 'float 6s ease-in-out infinite reverse, pulse 3s ease-in-out infinite'
          }}
        />
        
        {/* Hexagonal Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30l15-8.66v-8.66L30 21.34 15 12.68v8.66L30 30zm0 17.32L15 38.66v8.66L30 56l15-8.68v-8.66L30 47.32z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            animation: 'drift 15s linear infinite'
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md p-8">
          
          {/* Logo with Advanced 3D Effects */}
          <div className="mb-12 flex justify-center relative">
            <div className="relative">
              {/* Glow Effects */}
              <div className="absolute inset-0 w-40 h-40 rounded-full opacity-30 blur-2xl"
                style={{
                  background: 'radial-gradient(circle, rgba(59,130,246,0.6) 0%, rgba(139,92,246,0.3) 70%, transparent 100%)',
                  animation: 'pulse 2s ease-in-out infinite'
                }}
              />
              
              {/* Main Logo Container with Hologram Effect */}
              <div 
                className="relative w-40 h-40 p-4"
                style={{
                  animation: 'logoFloat 4s ease-in-out infinite, logoPulse 2s ease-in-out infinite'
                }}
              >
                <img
                  src="/images/icon.png"
                  alt="Carvix Logo"
                  className="w-full h-full object-contain relative z-10"
                  style={{ 
                    filter: 'drop-shadow(0 0 10px rgba(59,130,246,0.5))',
                    animation: 'logoPulse 2s ease-in-out infinite'
                  }}
                />
                
                {/* Scanning Lines Effect */}
                <div 
                  className="absolute inset-0 overflow-hidden"
                  style={{
                    background: `linear-gradient(90deg, 
                      transparent 0%, 
                      rgba(59,130,246,0.1) 50%, 
                      transparent 100%)`,
                    animation: 'scan 3s ease-in-out infinite'
                  }}
                />
              </div>
              
              {/* Orbital Rings */}
              <div className="absolute inset-0 -m-8">
                <div 
                  className="absolute inset-0 border-2 border-blue-500/20 rounded-full"
                  style={{
                    animation: 'rotate 8s linear infinite',
                    clipPath: `polygon(0 0, ${progress}% 0, ${progress}% 100%, 0% 100%)`
                  }}
                />
                <div 
                  className="absolute inset-4 border border-purple-500/30 rounded-full"
                  style={{
                    animation: 'rotate 6s linear infinite reverse',
                    clipPath: `polygon(0 0, ${progress * 0.8}% 0, ${progress * 0.8}% 100%, 0% 100%)`
                  }}
                />
              </div>
            </div>
          </div>

          {/* Futuristic Progress Ring */}
          <div className="relative mb-8 flex justify-center">
            <div className="w-48 h-48 relative">
              {/* Background Ring */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50" cy="50" r="45"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="2"
                />
                
                {/* Progress Ring with Gradient */}
                <circle
                  cx="50" cy="50" r="45"
                  fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                  style={{
                    filter: `drop-shadow(0 0 10px rgba(59,130,246,${pulseIntensity}))`,
                    transition: 'stroke-dashoffset 0.3s ease-out'
                  }}
                />
                
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Center Progress Display */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div 
                    className="text-4xl font-bold text-white mb-1"
                    style={{
                      textShadow: '0 0 20px rgba(59,130,246,0.8)',
                      animation: 'textGlow 2s ease-in-out infinite alternate'
                    }}
                  >
                    {progress}%
                  </div>
                  <div className="text-xs text-blue-300/60 uppercase tracking-wider">
                    Loading
                  </div>
                </div>
              </div>
              
              {/* Pulsing Dot at Progress Point */}
              <div 
                className="absolute w-3 h-3 bg-cyan-400 rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `
                    translate(-50%, -50%) 
                    rotate(${progressAngle - 90}deg) 
                    translateY(-45px)
                  `,
                  boxShadow: '0 0 15px rgba(6,182,212,0.8)',
                  animation: 'pulse 1s ease-in-out infinite'
                }}
              />
            </div>
          </div>

          {/* Dynamic Phase Indicator */}
          <div className="text-center mb-6">
            <div 
              className="text-xl font-medium text-white mb-2"
              style={{
                textShadow: '0 0 10px rgba(255,255,255,0.5)',
                animation: 'fadeInOut 0.5s ease-in-out'
              }}
              key={currentPhase}
            >
              {phases[currentPhase]}
            </div>
            
            {/* Animated Dots */}
            <div className="flex justify-center space-x-1">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-2 h-2 bg-blue-400 rounded-full"
                  style={{
                    animation: `loadingDot 1.5s ease-in-out infinite`,
                    animationDelay: `${i * 0.2}s`,
                    opacity: 0.3
                  }}
                />
              ))}
            </div>
          </div>

          {/* Status Indicators */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10">
              <div className="text-blue-300 mb-1">GPU Acceleration</div>
              <div className="text-green-400">✓ Enabled</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10">
              <div className="text-purple-300 mb-1">WebGL 2.0</div>
              <div className="text-green-400">✓ Ready</div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.02); }
        }
        
        @keyframes logoPulse {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.2); }
        }
        
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes drift {
          from { transform: translateX(-30px); }
          to { transform: translateX(30px); }
        }
        
        @keyframes textGlow {
          0% { text-shadow: 0 0 20px rgba(59,130,246,0.8); }
          100% { text-shadow: 0 0 30px rgba(59,130,246,1), 0 0 40px rgba(139,92,246,0.5); }
        }
        
        @keyframes loadingDot {
          0%, 80%, 100% { opacity: 0.3; transform: scale(1); }
          40% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes fadeInOut {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default ModelLoader;