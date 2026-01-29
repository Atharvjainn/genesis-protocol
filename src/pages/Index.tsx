import React, { useState, useEffect, useRef } from 'react';
import {
  TerminalPhase,
  CountdownPhase,
  AnimationPhase,
  TimerPhase,
} from '@/components/hackathon';
import { BootSequencePhase } from "@/components/hackathon/BootSpaceSequence";

type Phase = 'terminal' | 'countdown' | 'animation' | 'timer';

const Index = () => {
  // ✅ start in terminal
  const [currentPhase, setCurrentPhase] = useState<Phase>('terminal');

  // ✅ guard to prevent repeated resets
  const hasStartedRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://localhost:3001/status");
        const data = await res.json();

        // ✅ START ONLY ONCE
        if (data.state === "started" && !hasStartedRef.current) {
          hasStartedRef.current = true;
          setCurrentPhase("countdown");
        }

        // ✅ RESET CLEANLY
        if (data.state === "idle") {
          hasStartedRef.current = false;
          setCurrentPhase("terminal");
        }
      } catch {
        // server offline → ignore
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ---- Normal phase flow ----
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
        <BootSequencePhase onComplete={handleAnimationComplete} />
      )}

      {currentPhase === 'timer' && <TimerPhase />}
    </>
  );
};

export default Index;
