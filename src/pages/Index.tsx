import React, { useState, useEffect } from 'react';
import { TerminalPhase, CountdownPhase, AnimationPhase, TimerPhase } from '@/components/hackathon';

type Phase = 'terminal' | 'countdown' | 'animation' | 'timer';

const TIMER_STORAGE_KEY = 'hackathon-timer-end';

/**
 * Hackathon Kickoff Experience
 * 
 * A cinematic, terminal-controlled hackathon timer with:
 * - Terminal landing with "start" command
 * - Dramatic 3-2-1 countdown
 * - Three-stage cinematic animation (cosmic, code, circuit)
 * - Persistent 24-hour countdown timer
 * 
 * The experience persists across refreshes using localStorage.
 */
const Index = () => {
  const [currentPhase, setCurrentPhase] = useState<Phase>('terminal');

  // Check if timer is already running on mount (for page refresh handling)
  useEffect(() => {
    const stored = localStorage.getItem(TIMER_STORAGE_KEY);
    if (stored) {
      const endTime = parseInt(stored, 10);
      if (endTime > Date.now()) {
        // Timer is still active, skip to timer phase
        setCurrentPhase('timer');
      } else {
        // Timer has expired, clear storage
        localStorage.removeItem(TIMER_STORAGE_KEY);
      }
    }
  }, []);

  // Handle phase transitions
  const handleTerminalComplete = () => {
    setCurrentPhase('countdown');
  };

  const handleCountdownComplete = () => {
    setCurrentPhase('animation');
  };

  const handleAnimationComplete = () => {
    setCurrentPhase('timer');
  };

  return (
    <>
      {currentPhase === 'terminal' && (
        <TerminalPhase onComplete={handleTerminalComplete} />
      )}
      
      {currentPhase === 'countdown' && (
        <CountdownPhase onComplete={handleCountdownComplete} />
      )}
      
      {currentPhase === 'animation' && (
        <AnimationPhase onComplete={handleAnimationComplete} />
      )}
      
      {currentPhase === 'timer' && (
        <TimerPhase />
      )}
    </>
  );
};

export default Index;
