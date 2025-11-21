'use client';

import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function NotesWidget() {
  const [notes, setNotes] = useLocalStorage<string>('notes', '');
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-gradient-to-br from-amber-50 via-yellow-50/50 to-orange-50/30 p-8 shadow-xl backdrop-blur-xl dark:border-zinc-800/80 dark:from-amber-950/30 dark:via-yellow-950/20 dark:to-orange-950/20">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-2xl font-light tracking-tight text-zinc-900 dark:text-zinc-100">
          📝 Quick Notes
        </h3>
        {!isEditing && notes && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs text-zinc-600 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => setIsEditing(false)}
          placeholder="Write your notes here..."
          className="min-h-[140px] w-full rounded-xl border border-zinc-200/80 bg-white/50 p-4 text-sm font-light text-zinc-900 transition-all focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100 dark:focus:border-blue-500"
          autoFocus
        />
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className="min-h-[120px] cursor-text rounded-lg border border-transparent p-3 text-sm text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-white/50 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/50"
        >
          {notes || (
            <span className="text-zinc-400 dark:text-zinc-500">
              Click to add notes...
            </span>
          )}
        </div>
      )}
    </div>
  );
}

