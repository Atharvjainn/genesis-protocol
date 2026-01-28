import React, { useState, useEffect } from 'react';

interface CountdownPhaseProps {
  onComplete: () => void;
}

/**
 * CountdownPhase Component
 * 
 * Dramatic 3-2-1 countdown with screen shake, glitch effects,
 * and gradient pulse animations. Each number has ~800ms display time.
 */
export function CountdownPhase({ onComplete }: CountdownPhaseProps) {
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [gradientHue, setGradientHue] = useState(220);

  useEffect(() => {
    const numbers = [3, 2, 1];
    let index = 0;
    const numberDuration = 900; // ms per number

    const showNextNumber = () => {
      if (index < numbers.length) {
        setCurrentNumber(numbers[index]);
        setIsShaking(true);
        
        // Shift gradient color for each number
        setGradientHue(220 + (index * 40));

        // Stop shake after animation
        setTimeout(() => setIsShaking(false), 500);

        index++;
        setTimeout(showNextNumber, numberDuration);
      } else {
        // Brief pause before next phase
        setTimeout(onComplete, 300);
      }
    };

    // Start countdown after brief delay
    setTimeout(showNextNumber, 300);
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center overflow-hidden transition-all duration-300 ${
        isShaking ? 'animate-shake' : ''
      }`}
      style={{
        background: `linear-gradient(135deg, 
          hsl(${gradientHue}, 50%, 5%) 0%, 
          hsl(${gradientHue + 30}, 60%, 8%) 50%, 
          hsl(${gradientHue}, 50%, 5%) 100%)`
      }}
    >
      {/* Radial glow behind number */}
      {currentNumber && (
        <div 
          className="absolute w-[600px] h-[600px] rounded-full transition-all duration-500"
          style={{
            background: `radial-gradient(circle, 
              hsl(var(--primary) / 0.3) 0%, 
              transparent 70%)`,
            filter: 'blur(60px)',
          }}
        />
      )}

      {/* Number display with glitch effect */}
      {currentNumber && (
        <div className="relative">
          {/* Main number */}
          <span 
            className="glitch-text text-[25vw] md:text-[30vw] font-display font-bold text-primary animate-number-impact select-none"
            data-text={currentNumber}
            style={{
              textShadow: `
                0 0 40px hsl(var(--primary) / 0.8),
                0 0 80px hsl(var(--primary) / 0.5),
                0 0 120px hsl(var(--primary) / 0.3)
              `
            }}
          >
            {currentNumber}
          </span>

          {/* Glitch layers */}
          <span 
            className="absolute inset-0 text-[25vw] md:text-[30vw] font-display font-bold opacity-50"
            style={{
              color: 'hsl(var(--hackathon-cyan))',
              animation: currentNumber ? 'glitch 0.3s infinite' : 'none',
              clipPath: 'inset(40% 0 40% 0)',
            }}
          >
            {currentNumber}
          </span>
        </div>
      )}

      {/* Pulsing rings */}
      {currentNumber && (
        <>
          <div 
            className="absolute w-[50vw] h-[50vw] rounded-full border-2 border-primary/30 animate-ping"
            style={{ animationDuration: '1s' }}
          />
          <div 
            className="absolute w-[70vw] h-[70vw] rounded-full border border-primary/20 animate-ping"
            style={{ animationDuration: '1.5s', animationDelay: '0.2s' }}
          />
        </>
      )}

      {/* Noise overlay */}
      <div className="absolute inset-0 noise-overlay pointer-events-none" />
    </div>
  );
}
