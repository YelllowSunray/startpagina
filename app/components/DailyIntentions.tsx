'use client';

import { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface DailyIntention {
  id: string;
  text: string;
  completed: boolean;
}

export default function DailyIntentions() {
  const [intentions, setIntentions] = useLocalStorage<DailyIntention[]>('dailyIntentions', []);
  const [newIntention, setNewIntention] = useState('');
  const [lastResetDate, setLastResetDate] = useLocalStorage<string>('lastResetDate', '');

  // Reset intentions daily
  useEffect(() => {
    const today = new Date().toDateString();
    if (lastResetDate !== today) {
      setIntentions([]);
      setLastResetDate(today);
    }
  }, [lastResetDate, setIntentions, setLastResetDate]);

  const addIntention = () => {
    if (!newIntention.trim()) return;

    const intention: DailyIntention = {
      id: Date.now().toString(),
      text: newIntention.trim(),
      completed: false,
    };

    setIntentions([...intentions, intention]);
    setNewIntention('');
  };

  const toggleIntention = (id: string) => {
    setIntentions(
      intentions.map((intention) =>
        intention.id === id
          ? { ...intention, completed: !intention.completed }
          : intention
      )
    );
  };

  const deleteIntention = (id: string) => {
    setIntentions(intentions.filter((intention) => intention.id !== id));
  };

  const completedCount = intentions.filter((i) => i.completed).length;
  const totalCount = intentions.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-gradient-to-br from-indigo-50 via-blue-50/50 to-cyan-50/30 p-8 shadow-xl backdrop-blur-xl dark:border-zinc-800/80 dark:from-indigo-950/30 dark:via-blue-950/30 dark:to-cyan-950/20">
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-2xl font-light tracking-tight text-zinc-900 dark:text-zinc-100">
            ✨ Today's Intentions
          </h3>
          {totalCount > 0 && (
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              {completedCount}/{totalCount}
            </span>
          )}
        </div>
        {totalCount > 0 && (
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={newIntention}
          onChange={(e) => setNewIntention(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addIntention()}
          placeholder="What do you want to focus on today?"
          className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        />
        <button
          onClick={addIntention}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          Add
        </button>
      </div>

      <div className="space-y-2">
        {intentions.length === 0 ? (
          <div className="py-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Set your intentions for today. What matters most? 🎯
          </div>
        ) : (
          intentions.map((intention) => (
            <div
              key={intention.id}
              className="group flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-800/50"
            >
              <input
                type="checkbox"
                checked={intention.completed}
                onChange={() => toggleIntention(intention.id)}
                className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
              />
              <span
                className={`flex-1 text-sm ${
                  intention.completed
                    ? 'line-through text-zinc-400 dark:text-zinc-500'
                    : 'text-zinc-900 dark:text-zinc-100'
                }`}
              >
                {intention.text}
              </span>
              <button
                onClick={() => deleteIntention(intention.id)}
                className="opacity-0 text-zinc-400 transition-opacity hover:text-red-500 group-hover:opacity-100"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

