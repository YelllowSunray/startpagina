'use client';

import { useState, FormEvent, KeyboardEvent } from 'react';

interface SearchBarProps {
  onSearch?: (query: string, engine: string) => void;
}

const searchEngines = [
  { id: 'google', name: 'Google', url: 'https://www.google.com/search?q=' },
  { id: 'duckduckgo', name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=' },
  { id: 'bing', name: 'Bing', url: 'https://www.bing.com/search?q=' },
];

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [selectedEngine, setSelectedEngine] = useState('google');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const engine = searchEngines.find((e) => e.id === selectedEngine);
    if (engine) {
      if (onSearch) {
        onSearch(query, selectedEngine);
      }
      window.open(`${engine.url}${encodeURIComponent(query)}`, '_blank');
      setQuery('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsFocused(false);
      e.currentTarget.blur();
    }
  };

  const quickSearches = [
    { label: 'Weather', query: 'weather' },
    { label: 'News', query: 'latest news' },
    { label: 'Maps', query: 'maps' },
    { label: 'Translate', query: 'translate' },
  ];

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-4 z-10">
            <svg
              className="h-5 w-5 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            onKeyDown={handleKeyDown}
            placeholder="Search the web..."
            className="w-full rounded-2xl border-2 border-zinc-200/80 bg-white/90 backdrop-blur-xl py-5 pl-14 pr-36 text-base font-light text-zinc-900 shadow-xl transition-all focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:shadow-2xl dark:border-zinc-800/80 dark:bg-zinc-900/90 dark:text-zinc-100 dark:focus:border-blue-500"
          />
          <div className="absolute right-2 flex items-center gap-2">
            <select
              value={selectedEngine}
              onChange={(e) => setSelectedEngine(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="rounded-xl border border-zinc-200/80 bg-white/80 backdrop-blur-sm px-3 py-2 text-xs font-medium text-zinc-700 transition-all focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-200 dark:focus:border-blue-500"
            >
              {searchEngines.map((engine) => (
                <option key={engine.id} value={engine.id}>
                  {engine.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600"
            >
              Search
            </button>
          </div>
        </div>
      </form>

      {isFocused && (
        <div className="mt-4 rounded-2xl border border-zinc-200/80 bg-white/90 backdrop-blur-xl p-4 shadow-2xl animate-slide-up dark:border-zinc-800/80 dark:bg-zinc-900/90">
          <div className="mb-3 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Quick searches
          </div>
          <div className="flex flex-wrap gap-2">
            {quickSearches.map((quick) => (
              <button
                key={quick.label}
                onClick={() => {
                  setQuery(quick.query);
                  const engine = searchEngines.find((e) => e.id === selectedEngine);
                  if (engine) {
                    window.open(`${engine.url}${encodeURIComponent(quick.query)}`, '_blank');
                  }
                }}
                className="rounded-xl border border-zinc-200 bg-white/50 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-all hover:border-zinc-300 hover:bg-white hover:shadow-sm dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
              >
                {quick.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

