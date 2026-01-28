import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'hackathon-timer-end';
const DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface TimerState {
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  isRunning: boolean;
  progress: number; // 0 to 1, how much time has elapsed
}

/**
 * Custom hook for managing a persistent 24-hour hackathon countdown timer.
 * Uses localStorage to persist across refreshes and syncs across tabs.
 */
export function useHackathonTimer() {
  const [timerState, setTimerState] = useState<TimerState>({
    hours: 24,
    minutes: 0,
    seconds: 0,
    totalMs: DURATION_MS,
    isRunning: false,
    progress: 0,
  });

  // Calculate time remaining from end timestamp
  const calculateTimeRemaining = useCallback((endTime: number): TimerState => {
    const now = Date.now();
    const remaining = Math.max(0, endTime - now);
    const elapsed = DURATION_MS - remaining;
    
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

    return {
      hours,
      minutes,
      seconds,
      totalMs: remaining,
      isRunning: remaining > 0,
      progress: Math.min(1, elapsed / DURATION_MS),
    };
  }, []);

  // Start the timer (called when hackathon begins)
  const startTimer = useCallback(() => {
    const endTime = Date.now() + DURATION_MS;
    localStorage.setItem(STORAGE_KEY, endTime.toString());
    
    // Dispatch storage event for cross-tab sync
    window.dispatchEvent(new StorageEvent('storage', {
      key: STORAGE_KEY,
      newValue: endTime.toString(),
    }));

    setTimerState(calculateTimeRemaining(endTime));
  }, [calculateTimeRemaining]);

  // Reset the timer
  const resetTimer = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setTimerState({
      hours: 24,
      minutes: 0,
      seconds: 0,
      totalMs: DURATION_MS,
      isRunning: false,
      progress: 0,
    });
  }, []);

  // Check if timer already exists (for page refresh handling)
  const checkExistingTimer = useCallback((): boolean => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const endTime = parseInt(stored, 10);
      if (endTime > Date.now()) {
        setTimerState(calculateTimeRemaining(endTime));
        return true;
      } else {
        // Timer has expired
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    return false;
  }, [calculateTimeRemaining]);

  // Update timer every second
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    const endTime = parseInt(stored, 10);
    
    const interval = setInterval(() => {
      const newState = calculateTimeRemaining(endTime);
      setTimerState(newState);

      if (!newState.isRunning) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [calculateTimeRemaining, timerState.isRunning]);

  // Sync across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        if (e.newValue) {
          const endTime = parseInt(e.newValue, 10);
          setTimerState(calculateTimeRemaining(endTime));
        } else {
          // Timer was reset in another tab
          setTimerState({
            hours: 24,
            minutes: 0,
            seconds: 0,
            totalMs: DURATION_MS,
            isRunning: false,
            progress: 0,
          });
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [calculateTimeRemaining]);

  return {
    ...timerState,
    startTimer,
    resetTimer,
    checkExistingTimer,
  };
}
