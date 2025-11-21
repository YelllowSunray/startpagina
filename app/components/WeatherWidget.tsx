'use client';

import { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

export default function WeatherWidget() {
  const [location, setLocation] = useLocalStorage<string>('weatherLocation', '');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Mock weather data (in production, use a weather API)
  useEffect(() => {
    if (location) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockWeather: WeatherData = {
          location: location || 'Your Location',
          temperature: Math.floor(Math.random() * 30) + 10,
          condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
          icon: '☀️',
          humidity: Math.floor(Math.random() * 40) + 40,
          windSpeed: Math.floor(Math.random() * 20) + 5,
        };
        setWeather(mockWeather);
        setIsLoading(false);
      }, 500);
    }
  }, [location]);

  const getWeatherIcon = (condition: string) => {
    const icons: Record<string, string> = {
      Sunny: '☀️',
      Cloudy: '☁️',
      Rainy: '🌧️',
      'Partly Cloudy': '⛅',
      Snowy: '❄️',
      Stormy: '⛈️',
    };
    return icons[condition] || '🌤️';
  };

  if (!location) {
    return (
      <div className="rounded-2xl border border-zinc-200/80 bg-white/90 backdrop-blur-xl p-8 shadow-xl dark:border-zinc-800/80 dark:bg-zinc-900/90">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-light tracking-tight text-zinc-900 dark:text-zinc-100">Weather</h3>
          <button
            onClick={() => setShowSettings(true)}
            className="text-xs font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            Setup
          </button>
        </div>
        {showSettings && (
          <div className="mt-4">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onBlur={() => setShowSettings(false)}
              placeholder="Enter city name"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              autoFocus
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-gradient-to-br from-sky-50 via-blue-50/50 to-cyan-50/30 p-8 shadow-xl backdrop-blur-xl dark:border-zinc-800/80 dark:from-sky-950/50 dark:via-blue-950/50 dark:to-cyan-950/30">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-light tracking-tight text-zinc-900 dark:text-zinc-100">Weather</h3>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-xs font-medium text-zinc-600 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          ⚙️
        </button>
      </div>

      {showSettings && (
        <div className="mt-3">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onBlur={() => setShowSettings(false)}
            placeholder="Enter city name"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            autoFocus
          />
        </div>
      )}

      {isLoading ? (
        <div className="mt-4 text-center text-zinc-500 dark:text-zinc-400">Loading...</div>
      ) : weather ? (
        <div className="mt-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {weather.temperature}°C
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">{weather.location}</div>
            </div>
            <div className="text-5xl">{getWeatherIcon(weather.condition)}</div>
          </div>
          <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {weather.condition}
          </div>
          <div className="mt-3 flex gap-4 text-xs text-zinc-600 dark:text-zinc-400">
            <span>💧 {weather.humidity}%</span>
            <span>💨 {weather.windSpeed} km/h</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

