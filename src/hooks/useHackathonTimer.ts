import { useEffect, useRef, useState, useCallback } from "react";

export function useHackathonTimer() {
  const [endTime, setEndTime] = useState<number | null>(null);
  const [remainingMs, setRemainingMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 🔁 Sync time from backend
  const syncTime = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:3001/time");
      const data = await res.json();

      if (data.endTime) {
        setEndTime(data.endTime);
        setRemainingMs(Math.max(0, data.endTime - Date.now()));
        setIsRunning(data.running);
      } else {
        setIsRunning(false);
        setRemainingMs(0);
      }
    } catch (err) {
      console.error("Time sync failed", err);
    }
  }, []);

  // ⏱ Start ticking locally
  const startTimer = useCallback(() => {
    if (!endTime) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const ms = Math.max(0, endTime - Date.now());
      setRemainingMs(ms);

      if (ms === 0) {
        setIsRunning(false);
        clearInterval(intervalRef.current!);
      }
    }, 1000);
  }, [endTime]);

  const resetTimer = useCallback(async () => {
    await fetch("http://localhost:3001/reset");
    setEndTime(null);
    setRemainingMs(0);
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  // 🔥 Initial sync (page load / refresh safe)
  useEffect(() => {
    syncTime();
  }, [syncTime]);

  // 🔄 Restart ticking when endTime updates
  useEffect(() => {
    if (endTime && isRunning) {
      startTimer();
    }
  }, [endTime, isRunning, startTimer]);

  // ⏱ Derived values
  const totalSeconds = Math.floor(remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const progress = endTime
    ? 1 - remainingMs / (endTime - (endTime - remainingMs))
    : 0;

  return {
    hours,
    minutes,
    seconds,
    progress,
    isRunning,
    startTimer,
    resetTimer,
    syncTime, // 🔑 expose this
  };
}
