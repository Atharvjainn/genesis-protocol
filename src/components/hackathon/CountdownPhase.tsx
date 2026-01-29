import React, { useState, useEffect } from 'react';

interface CountdownPhaseProps {
  onComplete: () => void;
  enabled: boolean;
}

/**
 * CountdownPhase Component
 * Dramatic 3-2-1 countdown
 * Runs ONLY when `enabled === true`
 */
export function CountdownPhase({ onComplete, enabled }: CountdownPhaseProps) {
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [gradientHue, setGradientHue] = useState(220);

  useEffect(() => {
    if (!enabled) return; // 🔥 DO NOTHING until start command

    const numbers = [3, 2, 1];
    let index = 0;
    const numberDuration = 900;

    const showNextNumber = () => {
      if (index < numbers.length) {
        setCurrentNumber(numbers[index]);
        setIsShaking(true);
        setGradientHue(220 + index * 40);

        setTimeout(() => setIsShaking(false), 500);

        index++;
        setTimeout(showNextNumber, numberDuration);
      } else {
        setTimeout(onComplete, 300);
      }
    };

    const startDelay = setTimeout(showNextNumber, 300);

    return () => {
      clearTimeout(startDelay);
    };
  }, [enabled, onComplete]);

  // 🚫 Render nothing unless countdown is active
  if (!enabled || currentNumber === null) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center overflow-hidden transition-all duration-300 ${
        isShaking ? 'animate-shake' : ''
      }`}
      style={{
        background: `linear-gradient(135deg,
          hsl(${gradientHue}, 50%, 5%) 0%,
          hsl(${gradientHue + 30}, 60%, 8%) 50%,
          hsl(${gradientHue}, 50%, 5%) 100%)`,
      }}
    >
      {/* Radial glow */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: `radial-gradient(circle,
            hsl(var(--primary) / 0.3) 0%,
            transparent 70%)`,
          filter: 'blur(60px)',
        }}
      />

      {/* Number */}
      <div className="relative">
        <span
          className="glitch-text text-[25vw] md:text-[30vw] font-display font-bold text-primary animate-number-impact select-none"
          data-text={currentNumber}
        >
          {currentNumber}
        </span>

        {/* Glitch overlay */}
        <span
          className="absolute inset-0 text-[25vw] md:text-[30vw] font-display font-bold opacity-50"
          style={{
            color: 'hsl(var(--hackathon-cyan))',
            animation: 'glitch 0.3s infinite',
            clipPath: 'inset(40% 0 40% 0)',
          }}
        >
          {currentNumber}
        </span>
      </div>

      {/* Pulsing rings */}
      <div
        className="absolute w-[50vw] h-[50vw] rounded-full border-2 border-primary/30 animate-ping"
        style={{ animationDuration: '1s' }}
      />
      <div
        className="absolute w-[70vw] h-[70vw] rounded-full border border-primary/20 animate-ping"
        style={{ animationDuration: '1.5s', animationDelay: '0.2s' }}
      />

      <div className="absolute inset-0 noise-overlay pointer-events-none" />
    </div>
  );
}
