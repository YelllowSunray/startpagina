'use client';

import { useState } from 'react';

interface NewsArticle {
  id: string;
  title: string;
  source: string;
  url: string;
  summary?: string;
  readingTime?: number;
  publishedAt: string;
  imageUrl?: string;
  category?: string;
  isDuplicate?: boolean;
  relatedCount?: number;
}

interface NewsCardProps {
  article: NewsArticle;
  onDismiss?: (id: string) => void;
  onSave?: (id: string) => void;
}

export default function NewsCard({ article, onDismiss, onSave }: NewsCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(!saved);
    onSave?.(article.id);
  };

  const formatTime = (minutes?: number) => {
    if (!minutes) return '';
    if (minutes < 1) return 'Quick read';
    return `${Math.ceil(minutes)} min read`;
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <article
      className={`group relative rounded-2xl border border-zinc-200/80 bg-white/90 backdrop-blur-xl p-6 shadow-lg transition-all hover:border-zinc-300 hover:shadow-xl dark:border-zinc-800/80 dark:bg-zinc-900/90 ${
        article.isDuplicate ? 'opacity-70' : ''
      }`}
    >
      {article.isDuplicate && (
        <div className="absolute right-4 top-4 rounded-full border border-amber-200 bg-amber-50/80 backdrop-blur-sm px-3 py-1 text-xs font-medium text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
          {article.relatedCount} related
        </div>
      )}
      
      <div className="flex gap-4">
        {article.imageUrl && (
          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="mb-2 flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                <span className="font-medium">{article.source}</span>
                {article.category && (
                  <>
                    <span>•</span>
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 dark:bg-zinc-800">
                      {article.category}
                    </span>
                  </>
                )}
                {article.readingTime && (
                  <>
                    <span>•</span>
                    <span>{formatTime(article.readingTime)}</span>
                  </>
                )}
              </div>
              <h3 className="mb-2 text-base font-light leading-relaxed text-zinc-900 dark:text-zinc-100">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {article.title}
                </a>
              </h3>
            </div>
          </div>

          {article.summary && (
            <div className="mb-3">
              {expanded ? (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {article.summary}
                </p>
              ) : (
                <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {article.summary}
                </p>
              )}
              {article.summary.length > 100 && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="mt-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  {expanded ? 'Show less' : 'Read more'}
                </button>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {getTimeAgo(article.publishedAt)}
            </span>
            <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition-all ${
                    saved
                      ? 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'border-zinc-200 bg-white/50 text-zinc-600 hover:border-zinc-300 hover:bg-white dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:bg-zinc-800'
                  }`}
                >
                  {saved ? 'Saved' : 'Save'}
                </button>
                {onDismiss && (
                  <button
                    onClick={() => onDismiss(article.id)}
                    className="rounded-xl border border-zinc-200 bg-white/50 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-all hover:border-zinc-300 hover:bg-white dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
                  >
                    Dismiss
                  </button>
                )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

