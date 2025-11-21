'use client';

import { useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function FocusStats() {
  const [completedPomodoros] = useLocalStorage<number>('completedPomodoros', 0);
  const [habits] = useLocalStorage<any[]>('habits', []);
  const [todos] = useLocalStorage<any[]>('todos', []);
  const [intentions] = useLocalStorage<any[]>('dailyIntentions', []);

  const stats = useMemo(() => {
    const completedTodos = todos.filter((t) => t.completed).length;
    const totalTodos = todos.length;
    const completedIntentions = intentions.filter((i) => i.completed).length;
    const totalIntentions = intentions.length;
    const activeHabits = habits.filter((h) => {
      if (!h.lastCompleted) return false;
      const today = new Date().toDateString();
      return new Date(h.lastCompleted).toDateString() === today;
    }).length;

    const totalStreak = habits.reduce((sum, h) => sum + (h.streak || 0), 0);

    return {
      pomodoros: completedPomodoros,
      todosCompleted: completedTodos,
      todosTotal: totalTodos,
      intentionsCompleted: completedIntentions,
      intentionsTotal: totalIntentions,
      habitsActive: activeHabits,
      totalStreak,
    };
  }, [completedPomodoros, habits, todos, intentions]);

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-gradient-to-br from-emerald-50 via-teal-50/50 to-cyan-50/30 p-8 shadow-xl backdrop-blur-xl dark:border-zinc-800/80 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-cyan-950/20">
      <h3 className="mb-6 text-2xl font-light tracking-tight text-zinc-900 dark:text-zinc-100">
        📊 Focus Stats
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-zinc-200/50 bg-white/70 p-4 backdrop-blur-sm dark:border-zinc-800/50 dark:bg-zinc-800/70">
          <div className="text-3xl font-light tracking-tight text-zinc-900 dark:text-zinc-100">
            {stats.pomodoros}
          </div>
          <div className="mt-1 text-xs font-light text-zinc-600 dark:text-zinc-400">Pomodoros</div>
        </div>
        <div className="rounded-xl border border-zinc-200/50 bg-white/70 p-4 backdrop-blur-sm dark:border-zinc-800/50 dark:bg-zinc-800/70">
          <div className="text-3xl font-light tracking-tight text-zinc-900 dark:text-zinc-100">
            {stats.totalStreak}
          </div>
          <div className="mt-1 text-xs font-light text-zinc-600 dark:text-zinc-400">Habit Streak</div>
        </div>
        <div className="rounded-xl border border-zinc-200/50 bg-white/70 p-4 backdrop-blur-sm dark:border-zinc-800/50 dark:bg-zinc-800/70">
          <div className="text-3xl font-light tracking-tight text-zinc-900 dark:text-zinc-100">
            {stats.todosCompleted}/{stats.todosTotal}
          </div>
          <div className="mt-1 text-xs font-light text-zinc-600 dark:text-zinc-400">Tasks Done</div>
        </div>
        <div className="rounded-xl border border-zinc-200/50 bg-white/70 p-4 backdrop-blur-sm dark:border-zinc-800/50 dark:bg-zinc-800/70">
          <div className="text-3xl font-light tracking-tight text-zinc-900 dark:text-zinc-100">
            {stats.intentionsCompleted}/{stats.intentionsTotal}
          </div>
          <div className="mt-1 text-xs font-light text-zinc-600 dark:text-zinc-400">Intentions</div>
        </div>
      </div>
      {stats.habitsActive > 0 && (
        <div className="mt-4 rounded-lg bg-white/60 p-3 text-center dark:bg-zinc-800/60">
          <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            🔥 {stats.habitsActive} habit{stats.habitsActive !== 1 ? 's' : ''} completed today!
          </div>
        </div>
      )}
    </div>
  );
}

