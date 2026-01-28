import React, { useEffect, useState } from 'react';
import { useHackathonTimer } from '@/hooks/useHackathonTimer';
import { useGithubCommits } from "@/hooks/useGithubCommits";

interface TimerPhaseProps {
  onReset?: () => void;
}

export function TimerPhase({ onReset }: TimerPhaseProps) {
  useGithubCommits()
  const {
    hours,
    minutes,
    seconds,
    progress,
    isRunning,
    startTimer,
    resetTimer,
  } = useHackathonTimer();

  const [isVisible, setIsVisible] = useState(false);
  const [theme, setTheme] = useState<'cyan' | 'purple' | 'green'>('green');

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    startTimer();
  }, [startTimer]);

  const formatTime = (v: number) => v.toString().padStart(2, '0');

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
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center overflow-hidden">
      {/* Animated background */}
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

      {/* Main container */}
      <div
        className={`relative transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        } -translate-y-8`  }
      >
        {/* 🔥 LOGO + EVENT NAME */}
        <div className="flex flex-col items-center mb-4 animate-fade-in-up">
          <img
            src="/logo.png"
            alt="Quasar X AI Logo"
            className="w-70 h-40 mb-3 opacity-90"
          />

          {/* <h2 className="text-2xl md:text-3xl font-bold tracking-widest text-white">
            Quasar <span className="text-hackathon-green">X</span> AI
          </h2>

          <span className="text-sm tracking-[0.3em] text-muted-foreground mt-1">
            2026
          </span> */}

          {/* System status */}
          <div className="mt-4 text-xs font-mono tracking-widest text-hackathon-green/80">
            SYSTEM STATUS · TIME LOCK ACTIVE
          </div>
        </div>

        {/* Header */}
        <h1 className="text-center text-2xl md:text-3xl font-bold text-muted-foreground mb-12 tracking-widest uppercase animate-fade-in-up">
          Hackathon Time Remaining
        </h1>

        {/* Timer */}
        <div className="relative flex items-center justify-center">
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

          <div
            className={`relative z-10 flex items-center justify-center gap-4 font-mono ${getThemeGlow()}`}
            style={{ padding: '40px', borderRadius: '20px' }}
          >
            <TimeBlock label="Hours" value={hours} color={getThemeColor()} />
            <Separator color={getThemeColor()} />
            <TimeBlock label="Minutes" value={minutes} color={getThemeColor()} />
            <Separator color={getThemeColor()} />
            <TimeBlock label="Seconds" value={seconds} color={getThemeColor()} />
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-center gap-3 mt-10">
          <div
            className={`w-3 h-3 rounded-full ${
              isRunning ? 'bg-hackathon-green animate-pulse' : 'bg-destructive'
            }`}
          />
          <span className="text-muted-foreground text-sm uppercase tracking-wider">
            {isRunning ? 'Hackathon Active' : "Time's Up"}
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
