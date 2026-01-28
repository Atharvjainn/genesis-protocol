import React, { useEffect, useState } from "react";

interface BootSequencePhaseProps {
  onComplete: () => void;
}

type BootLine = {
  text: string;
  delayAfter?: number;
  highlight?: boolean;
};

/**
 * FUN + TECHY HACKATHON BOOT SEQUENCE
 * Duration: ~7–8 seconds
 * Purpose: Build anticipation, keep judges engaged
 */
const BOOT_LINES: BootLine[] = [
  { text: "booting genesis protocol v1.0..." },
  { text: "checking caffeine levels........... sufficient ☕", delayAfter: 500 },
  { text: "allocating neurons for creativity..." },

  // 👇 SLOW, FUNNY SECTION
  { text: "thinking...", delayAfter: 900 },
  { text: "still thinking...", delayAfter: 900 },
  { text: "arguing with the compiler..........", delayAfter: 1200 },
  { text: "compiler lost ✔", delayAfter: 1400 },

  { text: "downloading motivation packets..... 100%" },
  { text: "spawning bugs...................... done (good luck)", delayAfter: 700 },
  { text: "initializing late-night debugging..." },
  { text: "syncing team brainwaves............. OK" },
  { text: "optimizing for chaos................ stable-ish", delayAfter: 800 },
  { text: "locking time window................. 24:00:00", delayAfter: 900 },
  { text: "HACKATHON STARTED", highlight: true, delayAfter: 1200 },
];

export function BootSequencePhase({ onComplete }: BootSequencePhaseProps) {
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (lineIndex >= BOOT_LINES.length) {
      const finishTimer = setTimeout(onComplete, 500);
      return () => clearTimeout(finishTimer);
    }

    const line = BOOT_LINES[lineIndex].text;

    if (charIndex < line.length) {
      const typingTimer = setTimeout(() => {
        setCurrentLine(prev => prev + line[charIndex]);
        setCharIndex(c => c + 1);
      }, 20); // typing speed (human-like)

      return () => clearTimeout(typingTimer);
    } else {
      const delayTimer = setTimeout(() => {
        setCompletedLines(prev => [...prev, line]);
        setCurrentLine("");
        setCharIndex(0);
        setLineIndex(i => i + 1);
      }, BOOT_LINES[lineIndex].delayAfter ?? 400);

      return () => clearTimeout(delayTimer);
    }
  }, [charIndex, lineIndex, onComplete]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="w-full max-w-4xl px-8 font-mono text-green-400 text-xl md:text-2xl leading-relaxed">
        {completedLines.map((line, i) => (
          <div
            key={i}
            className={`whitespace-pre ${
              line === "HACKATHON STARTED"
                ? "text-green-300 font-bold text-3xl tracking-widest mt-4"
                : ""
            }`}
          >
            {"> "}{line}
          </div>
        ))}

        {lineIndex < BOOT_LINES.length && (
          <div className="whitespace-pre">
            {"> "}{currentLine}
            <span className="ml-1 animate-blink">█</span>
          </div>
        )}
      </div>
    </div>
  );
}
