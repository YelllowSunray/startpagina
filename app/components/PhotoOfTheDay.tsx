'use client';

import { useEffect, useState } from 'react';

interface PhotoData {
  url: string;
  author: string;
  authorUrl: string;
  description: string;
  location?: string;
}

export default function PhotoOfTheDay() {
  const [photo, setPhoto] = useState<PhotoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetchPhotoOfTheDay();
  }, []);

  const fetchPhotoOfTheDay = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use Unsplash Source API (no key required for basic usage)
      // This fetches a random beautiful photo
      const response = await fetch('https://source.unsplash.com/800x600/?nature,landscape,photography');
      
      // For better experience, we'll use a curated approach
      // Using Unsplash's random endpoint with specific topics
      const topics = ['nature', 'landscape', 'travel', 'architecture', 'art', 'city'];
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      
      // Since we can't get metadata without API key, we'll use a placeholder approach
      // In production, you'd want to use Unsplash API with a key for full metadata
      const imageUrl = `https://source.unsplash.com/800x600/?${randomTopic}`;
      
      setPhoto({
        url: imageUrl,
        author: 'Unsplash Community',
        authorUrl: 'https://unsplash.com',
        description: `Beautiful ${randomTopic} photography`,
        location: randomTopic,
      });
    } catch (err) {
      setError('Failed to load photo');
      console.error('Error fetching photo:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-gradient-to-br from-slate-50 to-zinc-50 p-6 shadow-sm dark:border-zinc-800 dark:from-slate-900 dark:to-zinc-800">
        <div className="flex items-center justify-center h-48">
          <div className="text-zinc-500 dark:text-zinc-400">Loading beautiful photo...</div>
        </div>
      </div>
    );
  }

  if (error || !photo) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-gradient-to-br from-slate-50 to-zinc-50 p-6 shadow-sm dark:border-zinc-800 dark:from-slate-900 dark:to-zinc-800">
        <div className="flex items-center justify-center h-48">
          <div className="text-zinc-500 dark:text-zinc-400">{error || 'No photo available'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="relative h-64 overflow-hidden">
        <img
          src={photo.url}
          alt={photo.description}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setError('Failed to load image')}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
        
        {/* Overlay info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg font-semibold">📸 Photo of the Day</h3>
            <button
              onClick={fetchPhotoOfTheDay}
              className="rounded-full bg-white/20 p-2 backdrop-blur-sm transition-all hover:bg-white/30"
              title="Refresh photo"
            >
              <span className="text-sm">↻</span>
            </button>
          </div>
          {expanded && (
            <div className="mt-2 space-y-1 text-sm">
              <p className="text-white/90">{photo.description}</p>
              {photo.location && (
                <p className="text-xs text-white/70">📍 {photo.location}</p>
              )}
              <a
                href={photo.authorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/80 hover:text-white underline"
              >
                Photo by {photo.author}
              </a>
            </div>
          )}
        </div>
        
        {/* Expand button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="absolute top-4 right-4 rounded-full bg-white/20 p-2 backdrop-blur-sm transition-all hover:bg-white/30"
          title={expanded ? 'Collapse' : 'Expand'}
        >
          <span className="text-sm text-white">{expanded ? '−' : '+'}</span>
        </button>
      </div>
    </div>
  );
}

