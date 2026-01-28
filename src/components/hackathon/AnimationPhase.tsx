import React, { useEffect, useMemo, useRef, useState } from "react";

interface AnimationPhaseProps {
  onComplete: () => void;
}

type Stage = "energy" | "code" | "resolve";

/**
 * FAST CINEMATIC HACKATHON ANIMATION
 *
 * Total duration ≈ 2.2s
 * energy → code → resolve → timer
 */
export function AnimationPhase({ onComplete }: AnimationPhaseProps) {
  const [stage, setStage] = useState<Stage>("energy");
  const [showCore, setShowCore] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>();

  /* ---------- PARTICLES (ENERGY BURST) ---------- */

  const particles = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      angle: Math.random() * Math.PI * 2,
      distance: 120 + Math.random() * 80,
      size: 2 + Math.random() * 3,
      hue: 190 + Math.random() * 40,
    }));
  }, []);

  /* ---------- STAGE TIMELINE ---------- */

  useEffect(() => {
    const t1 = setTimeout(() => setStage("code"), 600);
    const t2 = setTimeout(() => setStage("resolve"), 1400);
    const t3 = setTimeout(() => {
      setShowCore(true);
      onComplete();
    }, 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  /* ---------- CIRCUIT CANVAS (RESOLVE) ---------- */

  useEffect(() => {
    if (stage !== "resolve") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    let frame = 0;
    const maxFrames = 40;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < 10; i++) {
        const angle = (i / 10) * Math.PI * 2;
        const len = 80 + frame * 3;

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(
          cx + Math.cos(angle) * len,
          cy + Math.sin(angle) * len
        );
        ctx.strokeStyle = "hsla(185,100%,60%,0.6)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      frame++;
      if (frame < maxFrames) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [stage]);

  /* ---------- RENDER ---------- */

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#020617] via-[#030a1a] to-[#020617] overflow-hidden">

      {/* ENERGY BURST */}
      {stage === "energy" && (
        <>
          {/* central snap line */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-[2px] w-[260px] bg-cyan-400 shadow-[0_0_40px_cyan] animate-lineSnap" />
          </div>

          {/* burst particles */}
          {particles.map(p => (
            <div
              key={p.id}
              className="absolute rounded-full animate-burst"
              style={{
                left: "50%",
                top: "50%",
                width: p.size,
                height: p.size,
                background: `hsl(${p.hue},100%,60%)`,
                boxShadow: `0 0 12px hsl(${p.hue},100%,60%)`,
                "--x": `${Math.cos(p.angle) * p.distance}px`,
                "--y": `${Math.sin(p.angle) * p.distance}px`,
              } as React.CSSProperties}
            />
          ))}
        </>
      )}

      {/* CODE CONVERGENCE */}
      {stage === "code" && (
        <div className="absolute inset-0 flex items-center justify-center font-mono text-green-400 text-lg">
          {"{ compile.start(); }".split("").map((c, i) => (
            <span
              key={i}
              className="animate-codeIn"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {c}
            </span>
          ))}
        </div>
      )}

      {/* CIRCUIT RESOLVE */}
      {stage === "resolve" && (
        <canvas ref={canvasRef} className="absolute inset-0" />
      )}

      {/* CORE */}
      {showCore && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-corePulse shadow-[0_0_120px_cyan]" />
        </div>
      )}
    </div>
  );
}
