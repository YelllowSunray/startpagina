'use client';

import { useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface GreetingProps {
  userName?: string;
}

export default function Greeting({ userName }: GreetingProps) {
  const [time, setTime] = useState(new Date());
  const [funFact, setFunFact] = useState('');
  const [backgroundImage, setBackgroundImage] = useLocalStorage<string | null>('greetingBackground', null);
  const [dailyImage, setDailyImage] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const facts = [
      'Did you know? Honey never spoils!',
      'Fun fact: Octopuses have three hearts!',
      'Random: Bananas are berries, but strawberries aren\'t!',
      'Cool: A day on Venus is longer than its year!',
      'Weird: Wombat poop is cube-shaped!',
    ];
    setFunFact(facts[Math.floor(Math.random() * facts.length)]);
  }, []);

  // Fetch daily background image based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    let imageTopic = 'nature';
    
    if (hour >= 5 && hour < 12) {
      imageTopic = 'sunrise,morning';
    } else if (hour >= 12 && hour < 17) {
      imageTopic = 'daylight,landscape';
    } else if (hour >= 17 && hour < 20) {
      imageTopic = 'sunset,evening';
    } else {
      imageTopic = 'night,stars';
    }

    // Only set daily image if user hasn't set a custom background
    if (!backgroundImage) {
      const imageUrl = `https://source.unsplash.com/800x600/?${imageTopic}`;
      setDailyImage(imageUrl);
    }
  }, [backgroundImage]);

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formatTime = () => {
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = () => {
    return time.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const currentImage = backgroundImage || dailyImage;

  return (
    <div 
      className="group relative overflow-hidden rounded-2xl border border-zinc-200/80 p-8 shadow-xl backdrop-blur-xl dark:border-zinc-800/80"
      style={currentImage ? {
        backgroundImage: `url(${currentImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } : {
        background: 'linear-gradient(to bottom right, rgb(248 250 252), rgb(239 246 255 / 0.5), rgb(238 242 255 / 0.3))',
      }}
    >
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/40 backdrop-blur-sm dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-zinc-900/70" />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="mb-6">
          <h1 className="text-3xl font-light tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">
            {getGreeting()}{userName ? `, ${userName}` : ''}
          </h1>
          <p className="text-sm font-light text-zinc-600 dark:text-zinc-400 tracking-wide">
            {formatDate()}
          </p>
        </div>
        
        <div className="flex items-end justify-between border-t border-zinc-200/50 pt-6 dark:border-zinc-800/50">
          <div className="text-4xl font-mono font-light tracking-tight text-zinc-900 dark:text-zinc-50">
            {formatTime()}
          </div>
          {funFact && (
            <div className="max-w-xs text-xs font-light italic text-zinc-500 dark:text-zinc-500 leading-relaxed">
              {funFact}
            </div>
          )}
        </div>
      </div>

      {/* Settings button (appears on hover) */}
      <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={() => {
            const url = prompt('Enter image URL (or leave empty to use daily images):');
            if (url === null) return; // User cancelled
            setBackgroundImage(url || null);
          }}
          className="rounded-full bg-white/80 p-2 backdrop-blur-sm shadow-lg transition-all hover:bg-white dark:bg-zinc-800/80 dark:hover:bg-zinc-700"
          title="Change background"
        >
          <span className="text-sm">🖼️</span>
        </button>
      </div>
    </div>
  );
}

