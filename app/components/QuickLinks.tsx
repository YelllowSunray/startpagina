'use client';

import { useState } from 'react';

interface QuickLink {
  id: string;
  title: string;
  url: string;
  icon?: string;
  imageUrl?: string;
  category?: string;
}

interface QuickLinksProps {
  links: QuickLink[];
  onEdit?: () => void;
}

export default function QuickLinks({ links, onEdit }: QuickLinksProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const groupedLinks = links.reduce((acc, link) => {
    const category = link.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(link);
    return acc;
  }, {} as Record<string, QuickLink[]>);

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white/90 backdrop-blur-xl p-8 shadow-xl dark:border-zinc-800/80 dark:bg-zinc-900/90">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-light tracking-tight text-zinc-900 dark:text-zinc-100">
          Quick Links
        </h2>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            Edit
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        {Object.entries(groupedLinks).map(([category, categoryLinks]) => (
          <div key={category}>
            <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              {category}
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {categoryLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setHoveredId(link.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="group relative flex flex-col items-center gap-3 rounded-xl border border-zinc-200/80 bg-white/50 p-4 transition-all hover:border-blue-300 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 hover:shadow-lg dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-blue-600 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20"
                >
                  {link.imageUrl ? (
                    <div className="h-12 w-12 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-700">
                      <img
                        src={link.imageUrl}
                        alt={link.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          // Fallback to icon or gradient if image fails
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent && link.icon) {
                            parent.innerHTML = `<div class="text-2xl">${link.icon}</div>`;
                          } else if (parent) {
                            parent.innerHTML = '<div class="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500"></div>';
                          }
                        }}
                      />
                    </div>
                  ) : link.icon ? (
                    <div className="text-2xl">{link.icon}</div>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
                  )}
                  <span className="text-center text-xs font-medium text-zinc-700 group-hover:text-blue-600 dark:text-zinc-300 dark:group-hover:text-blue-400">
                    {link.title}
                  </span>
                  {hoveredId === link.id && (
                    <div className="absolute -top-1 -right-1 h-3 w-3 animate-ping rounded-full bg-blue-500 opacity-75" />
                  )}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

