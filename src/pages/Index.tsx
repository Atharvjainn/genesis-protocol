import React, { useState } from 'react';
import { TerminalPhase, CountdownPhase, AnimationPhase, TimerPhase } from '@/components/hackathon';
import { BootSequencePhase } from "@/components/hackathon/BootSpaceSequence";


type Phase = 'terminal' | 'countdown' | 'animation' | 'timer';

/**
 * Hackathon Kickoff Experience
 *
 * Reloading the page ALWAYS restarts the experience:
 * terminal → countdown → animation → fresh 24h timer
 */
const Index = () => {
  const [currentPhase, setCurrentPhase] = useState<Phase>('terminal');

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
