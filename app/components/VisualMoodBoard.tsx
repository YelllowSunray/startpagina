'use client';

import { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface MoodImage {
  id: string;
  url: string;
  title: string;
  category: string;
  addedAt: string;
}

const defaultMoodImages: MoodImage[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    title: 'Mountain Landscape',
    category: 'Nature',
    addedAt: new Date().toISOString(),
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400',
    title: 'Starry Night',
    category: 'Space',
    addedAt: new Date().toISOString(),
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400',
    title: 'Ocean Waves',
    category: 'Nature',
    addedAt: new Date().toISOString(),
  },
];

export default function VisualMoodBoard() {
  const [images, setImages] = useLocalStorage<MoodImage[]>('moodBoardImages', defaultMoodImages);
  const [isAdding, setIsAdding] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageTitle, setNewImageTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Nature');
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');

  const categories = ['Nature', 'Space', 'Architecture', 'Art', 'Travel', 'Abstract', 'Other'];

  const addImage = () => {
    if (!newImageUrl.trim()) return;

    const newImage: MoodImage = {
      id: Date.now().toString(),
      url: newImageUrl,
      title: newImageTitle || 'Untitled',
      category: selectedCategory,
      addedAt: new Date().toISOString(),
    };

    setImages([...images, newImage]);
    setNewImageUrl('');
    setNewImageTitle('');
    setIsAdding(false);
  };

  const removeImage = (id: string) => {
    setImages(images.filter((img) => img.id !== id));
  };

  const getImagesByCategory = (category: string) => {
    return images.filter((img) => img.category === category);
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          🎨 Visual Mood Board
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'masonry' : 'grid')}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-700 transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            {viewMode === 'grid' ? '📐 Grid' : '🧱 Masonry'}
          </button>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-700 transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            {isAdding ? '✕ Cancel' : '+ Add'}
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="mb-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
          <div className="space-y-3">
            <input
              type="text"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Image URL"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
            />
            <input
              type="text"
              value={newImageTitle}
              onChange={(e) => setNewImageTitle(e.target.value)}
              placeholder="Title (optional)"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <button
              onClick={addImage}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700"
            >
              Add Image
            </button>
          </div>
        </div>
      )}

      {images.length === 0 ? (
        <div className="py-8 text-center text-zinc-500 dark:text-zinc-400">
          <p className="text-sm">No images yet. Add some inspiration!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((category) => {
            const categoryImages = getImagesByCategory(category);
            if (categoryImages.length === 0) return null;

            return (
              <div key={category}>
                <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  {category}
                </h4>
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-2 gap-2 sm:grid-cols-3'
                      : 'columns-2 gap-2 sm:columns-3'
                  }
                >
                  {categoryImages.map((image) => (
                    <div
                      key={image.id}
                      className="group relative overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800"
                    >
                      <img
                        src={image.url}
                        alt={image.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://via.placeholder.com/400x300?text=Image+Not+Found';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="absolute bottom-0 left-0 right-0 p-2">
                          <p className="text-xs font-medium text-white">{image.title}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeImage(image.id)}
                        className="absolute right-2 top-2 rounded-full bg-red-500/80 p-1.5 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
                        title="Remove image"
                      >
                        <span className="text-xs text-white">✕</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

