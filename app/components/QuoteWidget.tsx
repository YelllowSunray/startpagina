'use client';

import { useState, useEffect } from 'react';

const quotes = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs",
  },
  {
    text: "Life is what happens to you while you're busy making other plans.",
    author: "John Lennon",
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
  },
  {
    text: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle",
  },
  {
    text: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins",
  },
  {
    text: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
  },
  {
    text: "Don't let yesterday take up too much of today.",
    author: "Will Rogers",
  },
];

const funFacts = [
  "Octopuses have three hearts! 🐙",
  "Bananas are berries, but strawberries aren't! 🍌",
  "A day on Venus is longer than its year! 🪐",
  "Wombat poop is cube-shaped! 💩",
  "Honey never spoils! 🍯",
  "Sharks have been around longer than trees! 🦈",
  "A group of flamingos is called a 'flamboyance'! 🦩",
  "Dolphins have names for each other! 🐬",
];

export default function QuoteWidget() {
  const [quote, setQuote] = useState(quotes[0]);
  const [funFact, setFunFact] = useState('');

  useEffect(() => {
    // Set initial quote based on day of year for consistency
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    setQuote(quotes[dayOfYear % quotes.length]);
    setFunFact(funFacts[dayOfYear % funFacts.length]);
  }, []);

  const refreshQuote = () => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    setFunFact(funFacts[Math.floor(Math.random() * funFacts.length)]);
  };

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-gradient-to-br from-violet-50 via-purple-50/50 to-fuchsia-50/30 p-8 shadow-xl backdrop-blur-xl dark:border-zinc-800/80 dark:from-violet-950/30 dark:via-purple-950/30 dark:to-fuchsia-950/20">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-2xl font-light tracking-tight text-zinc-900 dark:text-zinc-100">
          💭 Daily Inspiration
        </h3>
        <button
          onClick={refreshQuote}
          className="text-xs text-zinc-600 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          ↻ Refresh
        </button>
      </div>
      <blockquote className="mb-4 text-base font-light italic leading-relaxed text-zinc-700 dark:text-zinc-300">
        "{quote.text}"
      </blockquote>
      <div className="text-sm font-light text-zinc-600 dark:text-zinc-400">
        — {quote.author}
      </div>
      {funFact && (
        <div className="mt-6 rounded-xl border border-zinc-200/50 bg-white/60 p-4 text-xs font-light text-zinc-600 dark:border-zinc-800/50 dark:bg-zinc-800/60 dark:text-zinc-400">
          <span className="font-medium">Fun fact:</span> {funFact}
        </div>
      )}
    </div>
  );
}

