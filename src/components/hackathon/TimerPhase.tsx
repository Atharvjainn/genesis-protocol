import React, { useEffect, useState } from 'react';
import { useHackathonTimer } from '@/hooks/useHackathonTimer';

interface TimerPhaseProps {
  onReset?: () => void;
}

export function TimerPhase({ onReset }: TimerPhaseProps) {
  // 🔥 REMOVED: useGithubCommits() - now in App.tsx

  const {
    hours,
    minutes,
    seconds,
    progress,
    isRunning,
    startTimer,
  } = useHackathonTimer();

  const [isVisible, setIsVisible] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [theme] = useState<'cyan' | 'purple' | 'green'>('green');

  // ✅ TIME OVER only after real run
  const isTimeOver =
    hasStarted &&
    !isRunning &&
    hours === 0 &&
    minutes === 0 &&
    seconds === 0;

  // Fade-in
  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Detect start
  useEffect(() => {
    if (isRunning) {
      setHasStarted(true);
      startTimer();
    }
  }, [isRunning, startTimer]);

  const getThemeColor = () => {
    switch (theme) {
      case 'purple':
        return 'text-hackathon-purple';
      case 'green':
        return 'text-hackathon-green';
      default:
        return 'text-hackathon-cyan';
    }
  };

  const getThemeGlow = () => {
    switch (theme) {
      case 'purple':
        return 'shadow-glow-purple';
      case 'green':
        return 'shadow-glow-green';
      default:
        return 'shadow-glow-cyan';
    }
  };

  const radius = 180;
  const circumference = 2 * Math.PI * radius;

  // 🔥 Freeze ring when time over
  const strokeDashoffset = circumference * (1 - progress);


  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 opacity-30 animate-gradient-shift"
        style={{
          background: `
            radial-gradient(ellipse at 20% 50%, hsl(var(--hackathon-purple) / 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 50%, hsl(var(--hackathon-cyan) / 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 100%, hsl(var(--hackathon-blue) / 0.1) 0%, transparent 50%)
          `,
        }}
      />

      <div
        className={`relative transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        } -translate-y-8`}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-4">
          <img
            src="/logo.png"
            alt="Quasar X AI Logo"
            className="w-70 h-40 mb-3 opacity-90"
          />
          <div className="mt-2 text-xs font-mono tracking-widest text-hackathon-green/80">
            SYSTEM STATUS · TIME LOCK ACTIVE
          </div>
        </div>

        <h1 className="text-center text-2xl md:text-3xl font-bold text-muted-foreground mb-12 tracking-widest uppercase">
          Hackathon Time Remaining
        </h1>

        {/* Ring */}
       <div className="relative flex items-center justify-center">

  {/* ⭕ RING — ONLY WHEN TIMER IS ACTIVE */}
  {!isTimeOver && (
    <svg
      className="absolute animate-ring-rotate"
      width={radius * 2 + 40}
      height={radius * 2 + 40}
      style={{ transform: 'rotate(-90deg)' }}
    >
      <circle
        cx={radius + 20}
        cy={radius + 20}
        r={radius}
        fill="none"
        stroke="hsl(var(--muted))"
        strokeWidth="4"
        opacity="0.3"
      />
      <circle
        cx={radius + 20}
        cy={radius + 20}
        r={radius}
        fill="none"
        stroke="url(#progressGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        className="transition-all duration-1000"
      />
      <defs>
        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--hackathon-cyan))" />
          <stop offset="50%" stopColor="hsl(var(--hackathon-purple))" />
          <stop offset="100%" stopColor="hsl(var(--hackathon-green))" />
        </linearGradient>
      </defs>
    </svg>
  )}

  {/* CENTER CONTENT */}
  <div
    className={`relative z-10 flex items-center justify-center font-mono ${getThemeGlow()}`}
    style={{ padding: '48px', borderRadius: '20px', minWidth: '520px' }}
  >
    {!isTimeOver ? (
      <div className="flex items-center gap-4">
        <TimeBlock label="Hours" value={hours} color={getThemeColor()} />
        <Separator color={getThemeColor()} />
        <TimeBlock label="Minutes" value={minutes} color={getThemeColor()} />
        <Separator color={getThemeColor()} />
        <TimeBlock label="Seconds" value={seconds} color={getThemeColor()} />
      </div>
    ) : (
      <div className="text-center animate-fade-in-up">
        <div className={`text-6xl md:text-7xl font-bold ${getThemeColor()} tracking-widest`}>
          TIME OVER
        </div>
        <div className="mt-3 text-sm uppercase tracking-widest text-muted-foreground">
          Submissions Closed
        </div>
      </div>
    )}
  </div>
</div>


        {/* Status */}
        <div className="flex items-center justify-center gap-3 mt-10">
          <div
            className={`w-3 h-3 rounded-full ${
              isTimeOver
                ? 'bg-destructive'
                : isRunning
                ? 'bg-hackathon-green animate-pulse'
                : 'bg-yellow-500'
            }`}
          />
          <span className="text-muted-foreground text-sm uppercase tracking-wider">
            {isTimeOver ? 'Time Over' : isRunning ? 'Hackathon Active' : 'Paused'}
          </span>
        </div>
      </div>

      <div className="absolute inset-0 noise-overlay pointer-events-none" />
    </div>
  );
}

/* ---------- Small Components ---------- */

function TimeBlock({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="text-center">
      <span className={`text-7xl md:text-9xl font-bold ${color}`}>
        {value.toString().padStart(2, '0')}
      </span>
      <p className="text-muted-foreground text-sm mt-2 uppercase tracking-wider">
        {label}
      </p>
    </div>
  );
}

function Separator({ color }: { color: string }) {
  return (
    <span className={`text-6xl md:text-8xl font-bold ${color} animate-pulse`}>
      :
    </span>
  );
}