'use client';

import { useState, useEffect, useRef } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

interface TimerSettings {
  focus: number; // minutes
  shortBreak: number;
  longBreak: number;
  autoStart: boolean;
}

const defaultSettings: TimerSettings = {
  focus: 25,
  shortBreak: 5,
  longBreak: 15,
  autoStart: false,
};

export default function FocusTimer() {
  const [settings, setSettings] = useLocalStorage<TimerSettings>('focusTimerSettings', defaultSettings);
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(settings.focus * 60); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useLocalStorage<number>('completedPomodoros', 0);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  useEffect(() => {
    setTimeLeft(settings[mode] * 60);
  }, [mode, settings]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    if (mode === 'focus') {
      setCompletedPomodoros(completedPomodoros + 1);
      // Auto switch to break after focus
      if (completedPomodoros % 3 === 2) {
        setMode('longBreak');
      } else {
        setMode('shortBreak');
      }
    } else {
      setMode('focus');
    }
    // Play notification sound (browser beep)
    if (typeof window !== 'undefined' && 'Audio' in window) {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OSdTQ8OUKjk8LZjGwY4kdfyzHksBSR3x/DdkEAKFF606euoVRQKRp/g8r5sIQUrgc7y2Yk2CBtpvfDknU0PDlCo5PC2YxsGOJHX8sx5LAUkd8fw3ZBAC');
      audio.play().catch(() => {});
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const total = settings[mode] * 60;
    return ((total - timeLeft) / total) * 100;
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(settings[mode] * 60);
  };

  const getModeColor = () => {
    switch (mode) {
      case 'focus':
        return 'from-red-500 to-orange-500';
      case 'shortBreak':
        return 'from-green-500 to-emerald-500';
      case 'longBreak':
        return 'from-blue-500 to-cyan-500';
    }
  };

  const getModeLabel = () => {
    switch (mode) {
      case 'focus':
        return 'Focus Time';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white/90 backdrop-blur-xl p-8 shadow-xl dark:border-zinc-800/80 dark:bg-zinc-900/90">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-2xl font-light tracking-tight text-zinc-900 dark:text-zinc-100">
          🍅 Focus Timer
        </h3>
        <div className="flex items-center gap-2">
          <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            {completedPomodoros} completed
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            ⚙️
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="mb-4 space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs text-zinc-600 dark:text-zinc-400">Focus</label>
              <input
                type="number"
                value={settings.focus}
                onChange={(e) =>
                  setSettings({ ...settings, focus: parseInt(e.target.value) || 25 })
                }
                className="mt-1 w-full rounded border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-700"
                min="1"
                max="60"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-600 dark:text-zinc-400">Short</label>
              <input
                type="number"
                value={settings.shortBreak}
                onChange={(e) =>
                  setSettings({ ...settings, shortBreak: parseInt(e.target.value) || 5 })
                }
                className="mt-1 w-full rounded border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-700"
                min="1"
                max="30"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-600 dark:text-zinc-400">Long</label>
              <input
                type="number"
                value={settings.longBreak}
                onChange={(e) =>
                  setSettings({ ...settings, longBreak: parseInt(e.target.value) || 15 })
                }
                className="mt-1 w-full rounded border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-700"
                min="1"
                max="60"
              />
            </div>
          </div>
        </div>
      )}

      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {getModeLabel()}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setMode('focus')}
              className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                mode === 'focus'
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                  : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              Focus
            </button>
            <button
              onClick={() => setMode('shortBreak')}
              className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                mode === 'shortBreak'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                  : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              Break
            </button>
          </div>
        </div>

        <div className="relative mb-4">
          <div className="relative h-32 w-32 mx-auto">
            <svg className="h-32 w-32 -rotate-90 transform">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-zinc-200 dark:text-zinc-700"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - getProgress() / 100)}`}
                className={`${
                  mode === 'focus'
                    ? 'text-red-500'
                    : mode === 'shortBreak'
                    ? 'text-green-500'
                    : 'text-blue-500'
                } transition-all duration-1000`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-mono font-bold text-zinc-900 dark:text-zinc-100">
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={resetTimer}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

