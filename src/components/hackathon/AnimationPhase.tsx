import React, { useState, useEffect, useRef, useMemo } from 'react';

interface AnimationPhaseProps {
  onComplete: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
  orbitRadius: number;
  orbitSpeed: number;
  orbitAngle: number;
}

interface CodeChar {
  id: number;
  char: string;
  x: number;
  y: number;
  speed: number;
  delay: number;
  opacity: number;
}

/**
 * AnimationPhase Component
 * 
 * Three-stage cinematic animation sequence:
 * Stage A: Cosmic Energy Ignition - particles explode and orbit
 * Stage B: Code Compilation - digital rain and geometric patterns
 * Stage C: Circuit Awakening - neural pathways with energy pulses
 * 
 * Total duration: ~7 seconds
 */
export function AnimationPhase({ onComplete }: AnimationPhaseProps) {
  const [stage, setStage] = useState<'cosmic' | 'code' | 'circuit' | 'resolve'>('cosmic');
  const [particles, setParticles] = useState<Particle[]>([]);
  const [codeChars, setCodeChars] = useState<CodeChar[]>([]);
  const [lineWidth, setLineWidth] = useState(0);
  const [showCore, setShowCore] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Generate initial particles for cosmic phase
  const initialParticles = useMemo(() => {
    const count = 150;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: 0,
      y: 0,
      vx: (Math.random() - 0.5) * 20,
      vy: (Math.random() - 0.5) * 20,
      size: Math.random() * 4 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      hue: 200 + Math.random() * 80, // Blue to purple range
      orbitRadius: Math.random() * 200 + 50,
      orbitSpeed: (Math.random() - 0.5) * 0.05,
      orbitAngle: Math.random() * Math.PI * 2,
    }));
  }, []);

  // Code characters for digital rain
  const codeCharacters = '01{}[]();:=><+-*/&|!?#@$%^~`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  // Stage A: Cosmic Energy Ignition
  useEffect(() => {
    // Initial line expansion
    const lineTimer = setTimeout(() => {
      setLineWidth(300);
    }, 100);

    // Particles appear after line fractures
    const particleTimer = setTimeout(() => {
      setParticles(initialParticles);
    }, 800);

    return () => {
      clearTimeout(lineTimer);
      clearTimeout(particleTimer);
    };
  }, [initialParticles]);

  // Stage transitions
  useEffect(() => {
    const stageTimers = [
      setTimeout(() => setStage('code'), 2500),      // After 2.5s
      setTimeout(() => setStage('circuit'), 5000),    // After 5s
      setTimeout(() => setStage('resolve'), 6500),    // After 6.5s
      setTimeout(() => {
        setShowCore(true);
        setTimeout(onComplete, 800);                  // Complete after core animation
      }, 7000),
    ];

    return () => stageTimers.forEach(t => clearTimeout(t));
  }, [onComplete]);

  // Generate code characters for Stage B
  useEffect(() => {
    if (stage !== 'code') return;

    const chars: CodeChar[] = [];
    const columns = Math.floor(window.innerWidth / 20);
    
    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < 3; j++) {
        chars.push({
          id: i * 10 + j,
          char: codeCharacters[Math.floor(Math.random() * codeCharacters.length)],
          x: (i / columns) * 100,
          y: -20 - Math.random() * 100,
          speed: 2 + Math.random() * 3,
          delay: Math.random() * 500,
          opacity: 0.3 + Math.random() * 0.7,
        });
      }
    }

    setCodeChars(chars);
  }, [stage]);

  // Canvas animation for circuit phase
  useEffect(() => {
    if (stage !== 'circuit' && stage !== 'resolve') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Circuit paths
    const paths: { x: number; y: number; angle: number; length: number; progress: number }[] = [];
    const pathCount = 12;

    for (let i = 0; i < pathCount; i++) {
      const angle = (i / pathCount) * Math.PI * 2;
      paths.push({
        x: centerX,
        y: centerY,
        angle,
        length: 200 + Math.random() * 150,
        progress: 0,
      });
    }

    let frame = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw circuit paths
      paths.forEach((path, index) => {
        if (path.progress < 1) {
          path.progress += 0.02;
        }

        const currentLength = path.length * Math.min(path.progress, 1);
        const endX = path.x + Math.cos(path.angle) * currentLength;
        const endY = path.y + Math.sin(path.angle) * currentLength;

        // Main path
        ctx.beginPath();
        ctx.moveTo(path.x, path.y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = `hsla(${stage === 'resolve' ? 185 : 120 + index * 10}, 100%, 50%, ${0.3 + path.progress * 0.4})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Energy pulse traveling along path
        const pulsePos = (frame * 0.03 + index * 0.1) % 1;
        const pulseX = path.x + Math.cos(path.angle) * currentLength * pulsePos;
        const pulseY = path.y + Math.sin(path.angle) * currentLength * pulsePos;

        ctx.beginPath();
        ctx.arc(pulseX, pulseY, 4, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(185, 100%, 60%, ${0.8})`;
        ctx.fill();

        // Glow effect
        ctx.beginPath();
        ctx.arc(pulseX, pulseY, 12, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(185, 100%, 50%, ${0.3})`;
        ctx.fill();

        // Branch paths
        if (path.progress > 0.5 && currentLength > 100) {
          const branchStart = 0.5 + Math.random() * 0.3;
          const branchX = path.x + Math.cos(path.angle) * path.length * branchStart;
          const branchY = path.y + Math.sin(path.angle) * path.length * branchStart;
          const branchAngle = path.angle + (Math.random() - 0.5) * 0.8;
          const branchLength = 30 + Math.random() * 40;

          ctx.beginPath();
          ctx.moveTo(branchX, branchY);
          ctx.lineTo(
            branchX + Math.cos(branchAngle) * branchLength,
            branchY + Math.sin(branchAngle) * branchLength
          );
          ctx.strokeStyle = `hsla(${stage === 'resolve' ? 270 : 150}, 80%, 50%, 0.4)`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // Central node
      const centralGlow = 0.5 + Math.sin(frame * 0.1) * 0.3;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(185, 100%, 50%, ${centralGlow})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(185, 100%, 50%, ${centralGlow * 0.3})`;
      ctx.fill();

      frame++;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [stage]);

  // Get stage-specific background color
  const getBackgroundStyle = () => {
    switch (stage) {
      case 'cosmic':
        return 'from-[hsl(240,50%,5%)] via-[hsl(260,60%,8%)] to-[hsl(220,50%,5%)]';
      case 'code':
        return 'from-[hsl(160,50%,3%)] via-[hsl(140,60%,6%)] to-[hsl(180,50%,4%)]';
      case 'circuit':
      case 'resolve':
        return 'from-[hsl(200,50%,4%)] via-[hsl(185,60%,6%)] to-[hsl(220,50%,5%)]';
      default:
        return 'from-background via-hackathon-dark to-background';
    }
  };

  return (
    <div className={`fixed inset-0 overflow-hidden bg-gradient-to-br ${getBackgroundStyle()} transition-all duration-1000`}>
      {/* Stage A: Cosmic - Fracturing line and particles */}
      {stage === 'cosmic' && (
        <>
          {/* Central glowing line that fractures */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="h-[2px] bg-gradient-to-r from-transparent via-hackathon-cyan to-transparent transition-all duration-700 ease-out"
              style={{ 
                width: `${lineWidth}px`,
                boxShadow: '0 0 20px hsl(var(--hackathon-cyan)), 0 0 40px hsl(var(--hackathon-cyan) / 0.5)'
              }}
            />
          </div>

          {/* Exploding/orbiting particles */}
          {particles.map((particle, index) => (
            <div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                left: '50%',
                top: '50%',
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: `hsl(${particle.hue}, 100%, 60%)`,
                boxShadow: `0 0 ${particle.size * 3}px hsl(${particle.hue}, 100%, 50%)`,
                opacity: particle.opacity,
                transform: `translate(-50%, -50%) rotate(${particle.orbitAngle + index * 0.1}rad) translateX(${particle.orbitRadius * (lineWidth / 300)}px)`,
                transition: 'transform 2s ease-out, opacity 0.5s',
                animation: `orbit ${8 + index * 0.1}s linear infinite`,
                animationDelay: `${index * 20}ms`,
              }}
            />
          ))}
        </>
      )}

      {/* Stage B: Code Compilation - Digital rain */}
      {stage === 'code' && (
        <div className="absolute inset-0">
          {codeChars.map((char) => (
            <span
              key={char.id}
              className="absolute font-mono text-hackathon-green animate-code-fall"
              style={{
                left: `${char.x}%`,
                top: `${char.y}%`,
                opacity: char.opacity,
                fontSize: '14px',
                textShadow: '0 0 10px hsl(var(--hackathon-green))',
                '--fall-duration': `${4 / char.speed}s`,
                '--fall-delay': `${char.delay}ms`,
              } as React.CSSProperties}
            >
              {char.char}
            </span>
          ))}

          {/* Geometric pattern forming */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-[300px] h-[300px]">
              {[0, 60, 120, 180, 240, 300].map((rotation, i) => (
                <div
                  key={i}
                  className="absolute inset-0 border border-hackathon-green/40"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    animation: `scale-in 0.5s ease-out ${i * 100}ms forwards`,
                    opacity: 0,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Brief glitch effect */}
          <div 
            className="absolute inset-0 bg-hackathon-green/5"
            style={{
              animation: 'glitch 0.1s steps(2) 3',
            }}
          />
        </div>
      )}

      {/* Stage C: Circuit Awakening - Canvas-based neural paths */}
      {(stage === 'circuit' || stage === 'resolve') && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
        />
      )}

      {/* Resolution: Core collapse and expansion */}
      {showCore && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="w-4 h-4 rounded-full bg-primary animate-core-collapse"
            style={{
              boxShadow: `
                0 0 60px hsl(var(--primary)),
                0 0 120px hsl(var(--primary) / 0.5),
                0 0 200px hsl(var(--primary) / 0.3)
              `
            }}
          />
        </div>
      )}

      {/* Noise overlay for texture */}
      <div className="absolute inset-0 noise-overlay pointer-events-none" />
    </div>
  );
}
