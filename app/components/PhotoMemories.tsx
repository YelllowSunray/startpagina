'use client';

import { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface Memory {
  id: string;
  url: string;
  title: string;
  date: string; // ISO date string
  description?: string;
}

const defaultMemories: Memory[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    title: 'Mountain Adventure',
    date: new Date(new Date().getFullYear() - 1, new Date().getMonth(), new Date().getDate()).toISOString(),
    description: 'Beautiful hike last year',
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400',
    title: 'Starry Night',
    date: new Date(new Date().getFullYear() - 2, new Date().getMonth(), new Date().getDate()).toISOString(),
    description: 'Camping under the stars',
  },
];

export default function PhotoMemories() {
  const [memories, setMemories] = useLocalStorage<Memory[]>('photoMemories', defaultMemories);
  const [todayMemories, setTodayMemories] = useState<Memory[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newMemoryUrl, setNewMemoryUrl] = useState('');
  const [newMemoryTitle, setNewMemoryTitle] = useState('');
  const [newMemoryDate, setNewMemoryDate] = useState('');
  const [newMemoryDescription, setNewMemoryDescription] = useState('');

  useEffect(() => {
    // Find memories from this date in previous years
    const today = new Date();
    const month = today.getMonth();
    const day = today.getDate();

    const memoriesOnThisDate = memories.filter((memory) => {
      const memoryDate = new Date(memory.date);
      return memoryDate.getMonth() === month && memoryDate.getDate() === day;
    });

    setTodayMemories(memoriesOnThisDate);
  }, [memories]);

  const addMemory = () => {
    if (!newMemoryUrl.trim() || !newMemoryTitle.trim() || !newMemoryDate) return;

    const newMemory: Memory = {
      id: Date.now().toString(),
      url: newMemoryUrl,
      title: newMemoryTitle,
      date: new Date(newMemoryDate).toISOString(),
      description: newMemoryDescription,
    };

    setMemories([...memories, newMemory]);
    setNewMemoryUrl('');
    setNewMemoryTitle('');
    setNewMemoryDate('');
    setNewMemoryDescription('');
    setIsAdding(false);
  };

  const removeMemory = (id: string) => {
    setMemories(memories.filter((mem) => mem.id !== id));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yearsAgo = today.getFullYear() - date.getFullYear();
    return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} (${yearsAgo} year${yearsAgo !== 1 ? 's' : ''} ago)`;
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          📅 Photo Memories
        </h3>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-700 transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
        >
          {isAdding ? '✕ Cancel' : '+ Add Memory'}
        </button>
      </div>

      {isAdding && (
        <div className="mb-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
          <div className="space-y-3">
            <input
              type="text"
              value={newMemoryUrl}
              onChange={(e) => setNewMemoryUrl(e.target.value)}
              placeholder="Photo URL"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
            />
            <input
              type="text"
              value={newMemoryTitle}
              onChange={(e) => setNewMemoryTitle(e.target.value)}
              placeholder="Title"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
            />
            <input
              type="date"
              value={newMemoryDate}
              onChange={(e) => setNewMemoryDate(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
            />
            <textarea
              value={newMemoryDescription}
              onChange={(e) => setNewMemoryDescription(e.target.value)}
              placeholder="Description (optional)"
              rows={2}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
            />
            <button
              onClick={addMemory}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700"
            >
              Add Memory
            </button>
          </div>
        </div>
      )}

      {todayMemories.length > 0 && (
        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <h4 className="mb-2 text-sm font-semibold text-blue-900 dark:text-blue-100">
            📍 On This Day
          </h4>
          <div className="space-y-3">
            {todayMemories.map((memory) => (
              <div key={memory.id} className="flex gap-3">
                <img
                  src={memory.url}
                  alt={memory.title}
                  className="h-16 w-16 flex-shrink-0 rounded-lg object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://via.placeholder.com/64?text=Image+Not+Found';
                  }}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {memory.title}
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    {formatDate(memory.date)}
                  </p>
                  {memory.description && (
                    <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                      {memory.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {memories.length === 0 ? (
        <div className="py-8 text-center text-zinc-500 dark:text-zinc-400">
          <p className="text-sm">No memories yet. Add your first photo memory!</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h4 className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            All Memories
          </h4>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {memories
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((memory) => (
                <div
                  key={memory.id}
                  className="group relative overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800"
                >
                  <img
                    src={memory.url}
                    alt={memory.title}
                    className="h-32 w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://via.placeholder.com/400x300?text=Image+Not+Found';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <p className="text-xs font-medium text-white">{memory.title}</p>
                      <p className="text-xs text-white/80">{formatDate(memory.date)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeMemory(memory.id)}
                    className="absolute right-2 top-2 rounded-full bg-red-500/80 p-1.5 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
                    title="Remove memory"
                  >
                    <span className="text-xs text-white">✕</span>
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

