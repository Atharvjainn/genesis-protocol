import { useEffect, useRef, useState, useCallback } from "react";

const DEFAULT_DURATION_HOURS = 24;

export function useHackathonTimer() {
  const [endTime, setEndTime] = useState<number | null>(null);
  const [remainingMs, setRemainingMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /* ---------------- INIT (LOAD FROM LOCAL STORAGE) ---------------- */
  useEffect(() => {
    const storedEndTime = localStorage.getItem("hackathonEndTime");
    const storedState = localStorage.getItem("hackathonState");

    if (storedEndTime) {
      const parsed = Number(storedEndTime);
      setEndTime(parsed);
      setRemainingMs(Math.max(0, parsed - Date.now()));
    } else {
      const defaultEnd =
        Date.now() + DEFAULT_DURATION_HOURS * 60 * 60 * 1000;
      localStorage.setItem("hackathonEndTime", String(defaultEnd));
      setEndTime(defaultEnd);
      setRemainingMs(defaultEnd - Date.now());
    }

    setIsRunning(storedState === "started");
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

    return () => clearInterval(intervalRef.current!);
  }, [isRunning, endTime]);

  /* ---------------- COMMAND ACTIONS ---------------- */

  // ▶ start
  const startTimer = useCallback(() => {
    if (!endTime) return;
    setIsRunning(true);
    localStorage.setItem("hackathonState", "started");
  }, [endTime]);

  // ⏸ pause
  const pauseTimer = useCallback(() => {
    setIsRunning(false);
    localStorage.setItem("hackathonState", "idle");
  }, []);

  // 🔁 reset to default (24h)
  const resetTimer = useCallback(() => {
    const defaultEnd =
      Date.now() + DEFAULT_DURATION_HOURS * 60 * 60 * 1000;

    localStorage.setItem("hackathonEndTime", String(defaultEnd));
    localStorage.setItem("hackathonState", "idle");

    setEndTime(defaultEnd);
    setRemainingMs(defaultEnd - Date.now());
    setIsRunning(false);
  }, []);

  // ⏱ settime HH:MM:SS
  const setTime = useCallback((h: number, m: number, s: number) => {
    const totalMs = (h * 3600 + m * 60 + s) * 1000;
    const newEnd = Date.now() + totalMs;

    localStorage.setItem("hackathonEndTime", String(newEnd));
    localStorage.setItem("hackathonState", "idle");

    setEndTime(newEnd);
    setRemainingMs(totalMs);
    setIsRunning(false);
  }, []);

  // 🔥 HARD RESET (wipe everything)
  const hardReset = useCallback(() => {
    localStorage.removeItem("hackathonEndTime");
    localStorage.removeItem("hackathonState");

    const defaultEnd =
      Date.now() + DEFAULT_DURATION_HOURS * 60 * 60 * 1000;

    localStorage.setItem("hackathonEndTime", String(defaultEnd));
    localStorage.setItem("hackathonState", "idle");

    setEndTime(defaultEnd);
    setRemainingMs(defaultEnd - Date.now());
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

    // terminal commands
    startTimer,
    pauseTimer,
    resetTimer,
    setTime,
    hardReset,
  };
}
