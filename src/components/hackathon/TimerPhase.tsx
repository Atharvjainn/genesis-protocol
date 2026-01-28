import React, { useEffect, useState } from 'react';
import { useHackathonTimer } from '@/hooks/useHackathonTimer';

interface TimerPhaseProps {
  onReset?: () => void;
}

/**
 * TimerPhase Component
 * 
 * Active 24-hour countdown timer display with:
 * - Large digital time display
 * - Breathing glow animation
 * - Pulsing progress ring
 * - Subtle animated background
 * - Theme customization option
 */
export function TimerPhase({ onReset }: TimerPhaseProps) {
  const { hours, minutes, seconds, progress, isRunning, startTimer, resetTimer } = useHackathonTimer();
  const [isVisible, setIsVisible] = useState(false);
  const [theme, setTheme] = useState<'cyan' | 'purple' | 'green'>('cyan');

  // Start timer on mount if not already running
  useEffect(() => {
    // Brief delay for entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Start the timer when component mounts
  useEffect(() => {
    startTimer();
  }, [startTimer]);

  // Format time with leading zeros
  const formatTime = (value: number): string => {
    return value.toString().padStart(2, '0');
  };

  // Get theme color classes
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

  // Calculate progress ring circumference
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
          `
        }}
      />

      {/* Content container with entrance animation */}
      <div 
        className={`relative transition-all duration-1000 ease-out ${
          isVisible 
            ? 'opacity-100 transform scale-100' 
            : 'opacity-0 transform scale-90'
        }`}
      >
        {/* Header */}
        <h1 
          className="text-center text-2xl md:text-3xl font-display font-bold text-muted-foreground mb-12 tracking-widest uppercase animate-fade-in-up"
          style={{ animationDelay: '200ms' }}
        >
          Hackathon Time Remaining
        </h1>

        {/* Timer container with progress ring */}
        <div className="relative flex items-center justify-center">
          {/* SVG Progress Ring */}
          <svg 
            className="absolute animate-ring-rotate"
            width={radius * 2 + 40}
            height={radius * 2 + 40}
            style={{ transform: 'rotate(-90deg)' }}
          >
            {/* Background ring */}
            <circle
              cx={radius + 20}
              cy={radius + 20}
              r={radius}
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="4"
              opacity="0.3"
            />
            {/* Progress ring */}
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
            {/* Gradient definition */}
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--hackathon-cyan))" />
                <stop offset="50%" stopColor="hsl(var(--hackathon-purple))" />
                <stop offset="100%" stopColor="hsl(var(--hackathon-green))" />
              </linearGradient>
            </defs>
          </svg>

          {/* Timer display */}
          <div 
            className={`relative z-10 flex items-center justify-center gap-2 md:gap-4 font-mono animate-breathing ${getThemeGlow()}`}
            style={{
              padding: '40px',
              borderRadius: '20px',
            }}
          >
            {/* Hours */}
            <div className="text-center">
              <span className={`text-6xl md:text-8xl lg:text-9xl font-bold ${getThemeColor()} animate-text-glow`}>
                {formatTime(hours)}
              </span>
              <p className="text-muted-foreground text-sm mt-2 uppercase tracking-wider">Hours</p>
            </div>

            {/* Separator */}
            <span className={`text-5xl md:text-7xl lg:text-8xl font-bold ${getThemeColor()} animate-pulse`}>
              :
            </span>

            {/* Minutes */}
            <div className="text-center">
              <span className={`text-6xl md:text-8xl lg:text-9xl font-bold ${getThemeColor()} animate-text-glow`}>
                {formatTime(minutes)}
              </span>
              <p className="text-muted-foreground text-sm mt-2 uppercase tracking-wider">Minutes</p>
            </div>

            {/* Separator */}
            <span className={`text-5xl md:text-7xl lg:text-8xl font-bold ${getThemeColor()} animate-pulse`}>
              :
            </span>

            {/* Seconds */}
            <div className="text-center">
              <span className={`text-6xl md:text-8xl lg:text-9xl font-bold ${getThemeColor()} animate-text-glow`}>
                {formatTime(seconds)}
              </span>
              <p className="text-muted-foreground text-sm mt-2 uppercase tracking-wider">Seconds</p>
            </div>
          </div>
        </div>

        {/* Theme switcher */}
        <div 
          className="flex items-center justify-center gap-4 mt-12 animate-fade-in-up"
          style={{ animationDelay: '400ms' }}
        >
          <span className="text-muted-foreground text-sm uppercase tracking-wider mr-4">Theme</span>
          <button
            onClick={() => setTheme('cyan')}
            className={`w-8 h-8 rounded-full bg-hackathon-cyan transition-all ${
              theme === 'cyan' ? 'ring-2 ring-offset-2 ring-offset-background ring-hackathon-cyan scale-110' : 'opacity-50 hover:opacity-100'
            }`}
            aria-label="Cyan theme"
          />
          <button
            onClick={() => setTheme('purple')}
            className={`w-8 h-8 rounded-full bg-hackathon-purple transition-all ${
              theme === 'purple' ? 'ring-2 ring-offset-2 ring-offset-background ring-hackathon-purple scale-110' : 'opacity-50 hover:opacity-100'
            }`}
            aria-label="Purple theme"
          />
          <button
            onClick={() => setTheme('green')}
            className={`w-8 h-8 rounded-full bg-hackathon-green transition-all ${
              theme === 'green' ? 'ring-2 ring-offset-2 ring-offset-background ring-hackathon-green scale-110' : 'opacity-50 hover:opacity-100'
            }`}
            aria-label="Green theme"
          />
        </div>

        {/* Status indicator */}
        <div 
          className="flex items-center justify-center gap-3 mt-8 animate-fade-in-up"
          style={{ animationDelay: '600ms' }}
        >
          <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-hackathon-green animate-pulse' : 'bg-destructive'}`} />
          <span className="text-muted-foreground text-sm uppercase tracking-wider">
            {isRunning ? 'Hackathon Active' : 'Time\'s Up!'}
          </span>
        </div>
      </div>

      {/* Noise overlay */}
      <div className="absolute inset-0 noise-overlay pointer-events-none" />
    </div>
  );
}
