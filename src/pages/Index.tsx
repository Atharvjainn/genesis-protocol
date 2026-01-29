import React, { useState, useEffect } from 'react';
import {
  TerminalPhase,
  CountdownPhase,
  AnimationPhase,
  TimerPhase,
} from '@/components/hackathon';
import { BootSequencePhase } from "@/components/hackathon/BootSpaceSequence";

type Phase = 'terminal' | 'countdown' | 'animation' | 'timer';

const Index = () => {
  const [currentPhase, setCurrentPhase] = useState<Phase>('terminal');

  // 🔥 GLOBAL SKIP KEY (S)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // ignore typing inside inputs
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.key.toLowerCase() === 's') {
        setCurrentPhase('timer');
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <>
      {currentPhase === 'terminal' && (
        <TerminalPhase
          onComplete={() => setCurrentPhase('countdown')}
        />
      )}

      {currentPhase === 'countdown' && (
        <CountdownPhase
          onComplete={() => setCurrentPhase('animation')}
        />
      )}

      {currentPhase === 'animation' && (
        <BootSequencePhase
          onComplete={() => setCurrentPhase('timer')}
        />
      )}

      {currentPhase === 'timer' && <TimerPhase />}
    </>
  );
};

export default Index;
