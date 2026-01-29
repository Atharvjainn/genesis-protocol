import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useHackathonTimer } from '@/hooks/useHackathonTimer';

interface TerminalPhaseProps {
  onComplete?: () => void;
}

export function TerminalPhase({ onComplete }: TerminalPhaseProps) {
  const {
    startTimer,
    pauseTimer,
    resetTimer,
    setTime,
    hardReset,
    isRunning,
  } = useHackathonTimer();

  const [displayedText, setDisplayedText] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isTyping, setIsTyping] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);

  const welcomeText = `
> HACKATHON COMMAND TERMINAL v2.0
> ==============================
> System initialized.
> Environment loaded.
>
> Available commands:
> start | pause | reset | settime HH:MM:SS
> status | clear | factory-reset
>
> Type a command to continue.
`;

  /* ---------------- TYPING EFFECT ---------------- */

  useEffect(() => {
    let index = 0;
    const speed = 15;

    const type = () => {
      if (index < welcomeText.length) {
        setDisplayedText(welcomeText.slice(0, index + 1));
        index++;
        setTimeout(type, speed);
      } else {
        setIsTyping(false);
        setIsDisabled(false);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    };

    type();
  }, []);

  /* ---------------- CURSOR BLINK ---------------- */

  useEffect(() => {
    if (isTyping) {
      setShowCursor(true);
      return;
    }

    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => clearInterval(interval);
  }, [isTyping]);

  /* ---------------- INPUT ---------------- */

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isDisabled) return;
    setInputValue(e.target.value);
  };

  /* ---------------- COMMAND HANDLER ---------------- */

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const cmd = inputValue.trim().toLowerCase();
      setInputValue('');

      let response = '';

      if (cmd === 'start') {
        startTimer();
        response = '> Hackathon started';
        onComplete?.();
      }

      else if (cmd === 'pause') {
        pauseTimer();
        response = '> Hackathon paused';
      }

      else if (cmd === 'reset') {
        resetTimer();
        response = '> Timer reset to default (24h)';
      }

      else if (cmd.startsWith('settime')) {
        const [, time] = cmd.split(' ');
        if (!time) {
          response = '> Usage: settime HH:MM:SS';
        } else {
          const [h, m, s] = time.split(':').map(Number);
          if ([h, m, s].some(isNaN)) {
            response = '> Invalid time format';
          } else {
            setTime(h, m, s);
            response = `> Time set to ${time}`;
          }
        }
      }

      else if (cmd === 'status') {
        response = isRunning
          ? '> Status: RUNNING'
          : '> Status: IDLE';
      }

      else if (cmd === 'clear') {
        setDisplayedText('');
        return;
      }

      else if (cmd === 'factory-reset') {
        hardReset();
        setDisplayedText('');
        return;
      }

      else {
        response = '> Unknown command';
      }

      setDisplayedText(prev => prev + '\n' + response);
    },
    [inputValue, startTimer, pauseTimer, resetTimer, setTime, hardReset, isRunning]
  );

  const handleContainerClick = () => {
    if (!isDisabled) inputRef.current?.focus();
  };

  /* ---------------- UI ---------------- */

  return (
    <div
      className="fixed inset-0 bg-background flex items-center justify-center p-8 cursor-text noise-overlay"
      onClick={handleContainerClick}
    >
      <div className="absolute inset-0 scanlines pointer-events-none opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-br from-hackathon-dark via-background to-hackathon-dark opacity-50" />

      <div className="relative w-full max-w-4xl">
        <div className="bg-hackathon-dark/80 border border-primary/30 rounded-lg overflow-hidden shadow-glow">
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-3 bg-hackathon-black/50 border-b border-primary/20">
            <div className="w-3 h-3 rounded-full bg-destructive/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-hackathon-green/70" />
            <span className="ml-4 text-muted-foreground text-sm font-mono">
              hackathon@terminal:~
            </span>
          </div>

          {/* Terminal */}
          <div className="p-6 min-h-[400px] font-mono text-sm md:text-base">
            <pre className="text-primary whitespace-pre-wrap leading-relaxed">
              {displayedText}
              {isTyping && <span className="animate-cursor-blink">▊</span>}
            </pre>

            {!isTyping && (
              <form onSubmit={handleSubmit} className="mt-4 flex items-center">
                <span className="text-hackathon-green mr-2">&gt;</span>
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    disabled={isDisabled}
                    className="w-full bg-transparent border-none outline-none text-foreground font-mono caret-transparent"
                    autoComplete="off"
                    spellCheck={false}
                  />
                  <span
                    className={`absolute top-0 text-primary transition-opacity ${
                      showCursor ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ left: `${inputValue.length}ch` }}
                  >
                    ▊
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>

        {!isTyping && !isDisabled && (
          <p className="text-center text-muted-foreground text-sm mt-6 animate-fade-in-up">
            Press <kbd className="px-2 py-1 bg-secondary rounded text-primary">Enter</kbd> to execute
          </p>
        )}
      </div>
    </div>
  );
}
