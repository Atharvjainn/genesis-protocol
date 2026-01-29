import { useEffect, useRef, useState, useCallback } from "react";

const DEFAULT_DURATION_HOURS = 24;

export function useHackathonTimer() {
  const [endTime, setEndTime] = useState<number | null>(null);
  const [remainingMs, setRemainingMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /* ---------------- INIT (DO NOT CREATE TIME) ---------------- */
  useEffect(() => {
    const storedEndTime = localStorage.getItem("hackathonEndTime");
    const storedState = localStorage.getItem("hackathonState");

    if (storedEndTime) {
      const parsed = Number(storedEndTime);
      setEndTime(parsed);
      setRemainingMs(Math.max(0, parsed - Date.now()));
      setIsRunning(storedState === "started");
    } else {
      // 🔥 Hackathon NOT initialized yet
      setEndTime(null);
      setRemainingMs(0);
      setIsRunning(false);
    }
  }, []);

  /* ---------------- TIMER TICK ---------------- */
  useEffect(() => {
    if (!isRunning || !endTime) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const ms = Math.max(0, endTime - Date.now());
      setRemainingMs(ms);

      if (ms === 0) {
        setIsRunning(false);
        localStorage.setItem("hackathonState", "idle");
        clearInterval(intervalRef.current!);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, endTime]);

  /* ---------------- COMMAND ACTIONS ---------------- */

  // ▶ START (INITIALIZES IF NEEDED)
  const startTimer = useCallback(() => {
    let newEndTime = endTime;

    // 🔥 FIRST EVER START → CREATE END TIME
    if (!newEndTime) {
      newEndTime =
        Date.now() + DEFAULT_DURATION_HOURS * 60 * 60 * 1000;

      localStorage.setItem("hackathonEndTime", String(newEndTime));
      setEndTime(newEndTime);
      setRemainingMs(newEndTime - Date.now());
    }

    setIsRunning(true);
    localStorage.setItem("hackathonState", "started");
  }, [endTime]);

  // ⏸ PAUSE
  const pauseTimer = useCallback(() => {
    if (!endTime) return;
    setIsRunning(false);
    localStorage.setItem("hackathonState", "idle");
  }, [endTime]);

  // 🔁 RESET (ONLY IF INITIALIZED)
  const resetTimer = useCallback(() => {
    if (!endTime) return;

    const defaultEnd =
      Date.now() + DEFAULT_DURATION_HOURS * 60 * 60 * 1000;

    localStorage.setItem("hackathonEndTime", String(defaultEnd));
    localStorage.setItem("hackathonState", "idle");

    setEndTime(defaultEnd);
    setRemainingMs(defaultEnd - Date.now());
    setIsRunning(false);
  }, [endTime]);

  // ⏱ SETTIME HH:MM:SS (ONLY IF INITIALIZED)
  const setTime = useCallback((h: number, m: number, s: number) => {
    if (!endTime) return;

    const totalMs = (h * 3600 + m * 60 + s) * 1000;
    const newEnd = Date.now() + totalMs;

    localStorage.setItem("hackathonEndTime", String(newEnd));
    localStorage.setItem("hackathonState", "idle");

    setEndTime(newEnd);
    setRemainingMs(totalMs);
    setIsRunning(false);
  }, [endTime]);

  // 🔥 FACTORY RESET (FULL WIPE)
  const hardReset = useCallback(() => {
    localStorage.removeItem("hackathonEndTime");
    localStorage.removeItem("hackathonState");

    setEndTime(null);
    setRemainingMs(0);
    setIsRunning(false);
  }, []);

  /* ---------------- DERIVED VALUES ---------------- */

  const totalSeconds = Math.floor(remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const progress =
    endTime && remainingMs >= 0
      ? 1 - remainingMs / (endTime - (endTime - remainingMs))
      : 0;

  return {
    hours,
    minutes,
    seconds,
    progress,
    isRunning,
    hasInitialized: endTime !== null, // 👈 optional but useful

    // terminal commands
    startTimer,
    pauseTimer,
    resetTimer,
    setTime,
    hardReset,
  };
}
