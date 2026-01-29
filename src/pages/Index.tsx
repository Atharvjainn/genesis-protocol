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
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const tag = target?.tagName;

      // ❌ Ignore when typing
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.key === '8') {
        setCurrentPhase('timer');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [])
  const [currentPhase, setCurrentPhase] = useState<Phase>('terminal');
  const [hasStarted, setHasStarted] = useState(false); // 🔑 NEW

  return (
    <>
      {currentPhase === 'terminal' && (
        <TerminalPhase
          onComplete={() => {
            setHasStarted(true);        // 🔥 start signal
            setCurrentPhase('countdown');
          }}
          onReset={() => {
            setHasStarted(false);
            setCurrentPhase('terminal');
          }}
        />
      )}

      {currentPhase === 'countdown' && (
        <CountdownPhase
          enabled={hasStarted}          // 🔥 gated
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
