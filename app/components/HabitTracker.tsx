'use client';

import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface Habit {
  id: string;
  name: string;
  color: string;
  streak: number;
  lastCompleted?: string;
}

interface HabitTrackerProps {
  maxHabits?: number;
}

export default function HabitTracker({ maxHabits = 5 }: HabitTrackerProps) {
  const [habits, setHabits] = useLocalStorage<Habit[]>('habits', []);
  const [newHabitName, setNewHabitName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const colors = [
    { name: 'Blue', value: 'bg-blue-500' },
    { name: 'Green', value: 'bg-green-500' },
    { name: 'Purple', value: 'bg-purple-500' },
    { name: 'Pink', value: 'bg-pink-500' },
    { name: 'Orange', value: 'bg-orange-500' },
  ];

  const addHabit = (name: string, color: string) => {
    if (!name.trim() || habits.length >= maxHabits) return;

    const habit: Habit = {
      id: Date.now().toString(),
      name: name.trim(),
      color,
      streak: 0,
    };

    setHabits([...habits, habit]);
    setNewHabitName('');
    setShowAddForm(false);
  };

  const completeHabit = (id: string) => {
    const today = new Date().toDateString();
    setHabits(
      habits.map((habit) => {
        if (habit.id !== id) return habit;

        const lastCompleted = habit.lastCompleted
          ? new Date(habit.lastCompleted).toDateString()
          : null;

        // If already completed today, don't increment
        if (lastCompleted === today) return habit;

        // If completed yesterday, increment streak
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const wasYesterday = lastCompleted === yesterday.toDateString();

        return {
          ...habit,
          streak: wasYesterday ? habit.streak + 1 : lastCompleted ? 1 : 1,
          lastCompleted: new Date().toISOString(),
        };
      })
    );
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter((habit) => habit.id !== id));
  };

  const isCompletedToday = (habit: Habit) => {
    if (!habit.lastCompleted) return false;
    const today = new Date().toDateString();
    const lastCompleted = new Date(habit.lastCompleted).toDateString();
    return lastCompleted === today;
  };

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white/90 backdrop-blur-xl p-8 shadow-xl dark:border-zinc-800/80 dark:bg-zinc-900/90">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-2xl font-light tracking-tight text-zinc-900 dark:text-zinc-100">
          🔥 Habit Tracker
        </h3>
        {habits.length < maxHabits && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            + Add
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="mb-4 space-y-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
          <input
            type="text"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newHabitName.trim()) {
                addHabit(newHabitName, colors[0].value);
              }
            }}
            placeholder="Habit name..."
            className="w-full rounded border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
            autoFocus
          />
          <div className="flex gap-2">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => addHabit(newHabitName, color.value)}
                className={`h-6 w-6 rounded-full ${color.value} transition-transform hover:scale-110`}
                title={color.name}
              />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        {habits.length === 0 ? (
          <div className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
            No habits yet. Add one to start tracking! 🎯
          </div>
        ) : (
          habits.map((habit) => {
            const completed = isCompletedToday(habit);
            return (
              <div
                key={habit.id}
                className={`group flex items-center gap-3 rounded-lg border p-3 transition-all ${
                  completed
                    ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                    : 'border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50'
                }`}
              >
                <button
                  onClick={() => completeHabit(habit.id)}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${
                    completed
                      ? `${habit.color} border-transparent text-white`
                      : 'border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-700'
                  }`}
                >
                  {completed && '✓'}
                </button>
                <div className="flex-1">
                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {habit.name}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    {habit.streak > 0 ? `🔥 ${habit.streak} day streak` : 'Start your streak!'}
                  </div>
                </div>
                <button
                  onClick={() => deleteHabit(habit.id)}
                  className="opacity-0 text-zinc-400 transition-opacity hover:text-red-500 group-hover:opacity-100"
                >
                  ✕
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

