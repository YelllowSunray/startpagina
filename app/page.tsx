'use client';

import { useState, useMemo, useEffect } from 'react';
import NewsCard from './components/NewsCard';
import QuickLinks from './components/QuickLinks';
import Greeting from './components/Greeting';
import SearchBar from './components/SearchBar';
import WeatherWidget from './components/WeatherWidget';
import TodoList from './components/TodoList';
import NotesWidget from './components/NotesWidget';
import QuoteWidget from './components/QuoteWidget';
import FocusTimer from './components/FocusTimer';
import HabitTracker from './components/HabitTracker';
import DailyIntentions from './components/DailyIntentions';
import CommandPalette from './components/CommandPalette';
import FocusStats from './components/FocusStats';
import PhotoOfTheDay from './components/PhotoOfTheDay';
import VisualMoodBoard from './components/VisualMoodBoard';
import PhotoMemories from './components/PhotoMemories';
import { useLocalStorage } from './hooks/useLocalStorage';
import {
  NewsArticle,
  detectDuplicates,
  filterByCategory,
  sortArticles,
  calculateReadingTime,
  generateSummary,
} from './utils/newsUtils';
import { generateMoreNews } from './utils/generateNews';

// Sample news data (in production, this would come from an API)
const sampleNews: NewsArticle[] = [
  {
    id: '1',
    title: 'New Breakthrough in Renewable Energy Technology',
    source: 'Tech News',
    url: '#',
    summary: generateSummary(
      'Scientists have developed a new solar panel technology that increases efficiency by 40%. This breakthrough could revolutionize the renewable energy sector and make solar power more accessible worldwide. The new panels use advanced materials that capture more sunlight throughout the day.'
    ),
    readingTime: calculateReadingTime(
      'Scientists have developed a new solar panel technology that increases efficiency by 40%. This breakthrough could revolutionize the renewable energy sector and make solar power more accessible worldwide. The new panels use advanced materials that capture more sunlight throughout the day.'
    ),
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    category: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400',
  },
  {
    id: '2',
    title: 'Major Breakthrough in Solar Energy Efficiency',
    source: 'Science Daily',
    url: '#',
    summary: generateSummary(
      'A team of researchers has created solar panels with 40% better efficiency. This innovation promises to transform how we generate clean energy.'
    ),
    readingTime: calculateReadingTime(
      'A team of researchers has created solar panels with 40% better efficiency. This innovation promises to transform how we generate clean energy.'
    ),
    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    category: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400',
  },
  {
    id: '3',
    title: 'The Future of Remote Work: Trends and Predictions',
    source: 'Business Weekly',
    url: '#',
    summary: generateSummary(
      'Remote work continues to evolve with new tools and practices. Companies are finding innovative ways to maintain team cohesion and productivity in distributed environments. The future looks bright for flexible work arrangements.'
    ),
    readingTime: calculateReadingTime(
      'Remote work continues to evolve with new tools and practices. Companies are finding innovative ways to maintain team cohesion and productivity in distributed environments. The future looks bright for flexible work arrangements.'
    ),
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    category: 'Business',
  },
  {
    id: '4',
    title: 'Local Art Festival Draws Record Crowds',
    source: 'City News',
    url: '#',
    summary: generateSummary(
      'This year\'s art festival attracted over 50,000 visitors, breaking previous records. The event featured works from over 200 local and international artists.'
    ),
    readingTime: calculateReadingTime(
      'This year\'s art festival attracted over 50,000 visitors, breaking previous records. The event featured works from over 200 local and international artists.'
    ),
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    category: 'Culture',
    imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
  },
  {
    id: '5',
    title: 'Quick Tips for Better Sleep',
    source: 'Health Today',
    url: '#',
    summary: generateSummary(
      'Sleep experts share five simple strategies to improve your sleep quality. These tips can help you wake up feeling more rested and energized.'
    ),
    readingTime: calculateReadingTime(
      'Sleep experts share five simple strategies to improve your sleep quality. These tips can help you wake up feeling more rested and energized.'
    ),
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    category: 'Health',
  },
];

const defaultQuickLinks = [
  { id: '1', title: 'Gmail', url: 'https://gmail.com', category: 'Productivity', icon: '📧' },
  { id: '2', title: 'GitHub', url: 'https://github.com', category: 'Development', icon: '💻' },
  { id: '3', title: 'YouTube', url: 'https://youtube.com', category: 'Entertainment', icon: '▶️' },
  { id: '4', title: 'Reddit', url: 'https://reddit.com', category: 'Social', icon: '🤖' },
  { id: '5', title: 'Twitter', url: 'https://twitter.com', category: 'Social', icon: '🐦' },
  { id: '6', title: 'Notion', url: 'https://notion.so', category: 'Productivity', icon: '📝' },
];

interface WidgetVisibility {
  search: boolean;
  greeting: boolean;
  weather: boolean;
  quickLinks: boolean;
  todo: boolean;
  notes: boolean;
  quote: boolean;
  news: boolean;
  focusTimer: boolean;
  habits: boolean;
  intentions: boolean;
  stats: boolean;
  photoOfTheDay: boolean;
  moodBoard: boolean;
  photoMemories: boolean;
}

const defaultWidgetVisibility: WidgetVisibility = {
  search: true,
  greeting: true,
  weather: true,
  quickLinks: true,
  todo: true,
  notes: true,
  quote: true,
  news: true,
  focusTimer: true,
  habits: true,
  intentions: true,
  stats: true,
  photoOfTheDay: true,
  moodBoard: true,
  photoMemories: true,
};

export default function Home() {
  const [userName, setUserName] = useLocalStorage<string>('userName', '');
  const [quickLinks, setQuickLinks] = useLocalStorage('quickLinks', defaultQuickLinks);
  const [savedArticles, setSavedArticles] = useLocalStorage<string[]>('savedArticles', []);
  const [dismissedArticles, setDismissedArticles] = useLocalStorage<string[]>('dismissedArticles', []);
  const [widgetVisibility, setWidgetVisibility] = useLocalStorage<WidgetVisibility>(
    'widgetVisibility',
    defaultWidgetVisibility
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'readingTime' | 'relevance'>('relevance');
  const [showSettings, setShowSettings] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [displayedArticlesCount, setDisplayedArticlesCount] = useState(5);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [allNewsArticles, setAllNewsArticles] = useState<NewsArticle[]>(sampleNews);
  const [pageBackgroundImage, setPageBackgroundImage] = useLocalStorage<string | null>('pageBackground', null);
  const [dailyPageBackground, setDailyPageBackground] = useState<string | null>(null);

  // Reset displayed count when filters change
  useEffect(() => {
    setDisplayedArticlesCount(5);
  }, [selectedCategory, sortBy]);

  // Generate more articles when needed
  useEffect(() => {
    if (allNewsArticles.length < displayedArticlesCount + 10) {
      const moreArticles = generateMoreNews(20, allNewsArticles.length + 1);
      setAllNewsArticles((prev) => [...prev, ...moreArticles]);
    }
  }, [displayedArticlesCount, allNewsArticles.length]);

  // Process news articles
  const processedNews = useMemo(() => {
    let articles = [...allNewsArticles];
    
    // Remove dismissed articles
    articles = articles.filter((article) => !dismissedArticles.includes(article.id));
    
    // Detect duplicates
    articles = detectDuplicates(articles);
    
    // Filter by category
    articles = filterByCategory(articles, selectedCategory);
    
    // Sort
    articles = sortArticles(articles, sortBy);
    
    return articles;
  }, [selectedCategory, sortBy, dismissedArticles, allNewsArticles]);

  // Get articles to display (limited by displayedArticlesCount)
  const displayedNews = useMemo(() => {
    return processedNews.slice(0, displayedArticlesCount);
  }, [processedNews, displayedArticlesCount]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (isLoadingMore) return;

      const scrollPosition = window.innerHeight + window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const threshold = 200; // Load more when 200px from bottom

      if (scrollPosition >= documentHeight - threshold) {
        setIsLoadingMore(true);
        
        // Simulate loading delay for smooth UX
        setTimeout(() => {
          setDisplayedArticlesCount((prev) => prev + 5);
          setIsLoadingMore(false);
        }, 500);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoadingMore]);

  const categories = useMemo(() => {
    const cats = new Set(allNewsArticles.map((article) => article.category).filter(Boolean));
    return ['All', ...Array.from(cats)].sort();
  }, [allNewsArticles]);

  const handleDismiss = (id: string) => {
    setDismissedArticles([...dismissedArticles, id]);
  };

  const handleSave = (id: string) => {
    if (savedArticles.includes(id)) {
      setSavedArticles(savedArticles.filter((articleId) => articleId !== id));
    } else {
      setSavedArticles([...savedArticles, id]);
    }
  };

  const toggleWidget = (widget: keyof WidgetVisibility) => {
    setWidgetVisibility({
      ...widgetVisibility,
      [widget]: !widgetVisibility[widget],
    });
  };

  // Command palette commands
  const commands = [
    {
      id: 'toggle-settings',
      label: 'Toggle Settings',
      action: () => setShowSettings(!showSettings),
      category: 'Navigation',
      shortcut: 'Ctrl+K',
    },
    {
      id: 'toggle-command-palette',
      label: 'Open Command Palette',
      action: () => setShowCommandPalette(true),
      category: 'Navigation',
      shortcut: 'Ctrl+K',
    },
    {
      id: 'focus-search',
      label: 'Focus Search Bar',
      action: () => {
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        searchInput?.focus();
      },
      category: 'Navigation',
    },
    {
      id: 'clear-completed-todos',
      label: 'Clear Completed Todos',
      action: () => {
        // This would need access to todos state - simplified for now
        alert('Feature coming soon!');
      },
      category: 'Actions',
    },
  ];

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K for command palette
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
      // Escape to close
      if (e.key === 'Escape') {
        setShowCommandPalette(false);
        setShowSettings(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Daily background image based on time of day
  useEffect(() => {
    if (pageBackgroundImage) return; // Don't override custom background

    const hour = new Date().getHours();
    let imageTopic = 'nature';
    
    if (hour >= 5 && hour < 12) {
      imageTopic = 'sunrise,morning,dawn';
    } else if (hour >= 12 && hour < 17) {
      imageTopic = 'daylight,landscape,outdoor';
    } else if (hour >= 17 && hour < 20) {
      imageTopic = 'sunset,evening,dusk';
    } else {
      imageTopic = 'night,stars,night sky';
    }

    const imageUrl = `https://source.unsplash.com/1920x1080/?${imageTopic}`;
    setDailyPageBackground(imageUrl);
  }, [pageBackgroundImage]);

  const currentPageBackground = pageBackgroundImage || dailyPageBackground;

  return (
    <div 
      className="min-h-screen relative"
      style={currentPageBackground ? {
        backgroundImage: `url(${currentPageBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      } : {
        background: 'linear-gradient(to bottom right, rgb(248 250 252), rgb(255 255 255), rgb(250 250 249))',
      }}
    >
      {/* Overlay for content readability */}
      <div 
        className="absolute inset-0 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-[2px]"
        style={currentPageBackground ? {} : { display: 'none' }}
      />
      
      <div className="relative z-10">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-4xl font-light tracking-tight text-zinc-900 dark:text-zinc-50 mb-1">
              Start Pagina
          </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-light">
              Your personal command center
          </p>
        </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="group rounded-xl border border-zinc-200 bg-white/80 backdrop-blur-sm px-4 py-2.5 text-sm font-medium text-zinc-700 transition-all hover:bg-white hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:border-zinc-700"
          >
            <span className="flex items-center gap-2">
              <span className="transition-transform group-hover:rotate-90">⚙️</span>
              Settings
            </span>
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mb-8 rounded-2xl border border-zinc-200/80 bg-white/90 backdrop-blur-xl p-8 shadow-xl dark:border-zinc-800/80 dark:bg-zinc-900/90 animate-slide-up">
            <h2 className="mb-6 text-2xl font-light tracking-tight text-zinc-900 dark:text-zinc-100">
              Customize Your Start Page
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-zinc-200 bg-white/50 px-4 py-3 text-sm text-zinc-900 transition-all focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100 dark:focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                  Widget Visibility
                </label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {Object.entries(widgetVisibility).map(([key, visible]) => (
                    <label
                      key={key}
                      className="group flex items-center gap-3 rounded-xl border border-zinc-200 bg-white/50 p-3 cursor-pointer transition-all hover:border-zinc-300 hover:bg-white hover:shadow-sm dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
                    >
                      <input
                        type="checkbox"
                        checked={visible}
                        onChange={() => toggleWidget(key as keyof WidgetVisibility)}
                        className="h-4 w-4 rounded border-zinc-300 text-blue-600 transition-all focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600"
                      />
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar - Prominent at top */}
        {widgetVisibility.search && (
          <div className="mb-12 animate-fade-in">
            <SearchBar />
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column - Widgets */}
          <div className="space-y-6 lg:col-span-4">
            {widgetVisibility.greeting && <Greeting userName={userName} />}
            
            {widgetVisibility.intentions && <DailyIntentions />}
            
            {widgetVisibility.stats && <FocusStats />}
            
            {widgetVisibility.focusTimer && <FocusTimer />}
            
            {widgetVisibility.habits && <HabitTracker />}
            
            {widgetVisibility.weather && <WeatherWidget />}
            
            {widgetVisibility.quote && <QuoteWidget />}
            
            {widgetVisibility.todo && <TodoList />}
            
            {widgetVisibility.notes && <NotesWidget />}
            
            {widgetVisibility.quickLinks && <QuickLinks links={quickLinks} />}
            
            {widgetVisibility.photoOfTheDay && <PhotoOfTheDay />}
            
            {widgetVisibility.moodBoard && <VisualMoodBoard />}
            
            {widgetVisibility.photoMemories && <PhotoMemories />}
          </div>

          {/* Right Column - News Feed */}
          {widgetVisibility.news && (
            <div className="lg:col-span-8">
              <div className="rounded-2xl border border-zinc-200/80 bg-white/90 backdrop-blur-xl p-8 shadow-xl dark:border-zinc-800/80 dark:bg-zinc-900/90 animate-slide-up">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <h2 className="text-2xl font-light tracking-tight text-zinc-900 dark:text-zinc-100">
                    News Feed
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="rounded-xl border border-zinc-200 bg-white/80 px-4 py-2 text-sm font-medium text-zinc-700 transition-all focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-300 dark:focus:border-blue-500"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <select
                      value={sortBy}
                      onChange={(e) =>
                        setSortBy(
                          e.target.value as
                            | 'newest'
                            | 'oldest'
                            | 'readingTime'
                            | 'relevance'
                        )
                      }
                      className="rounded-xl border border-zinc-200 bg-white/80 px-4 py-2 text-sm font-medium text-zinc-700 transition-all focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-300 dark:focus:border-blue-500"
                    >
                      <option value="relevance">Most Relevant</option>
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="readingTime">Quick Reads</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {displayedNews.length > 0 ? (
                    <>
                      {displayedNews.map((article) => (
                        <NewsCard
                          key={article.id}
                          article={article}
                          onDismiss={handleDismiss}
                          onSave={handleSave}
                        />
                      ))}
                      {isLoadingMore && (
                        <div className="flex items-center justify-center py-8">
                          <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-600 dark:border-zinc-600 dark:border-t-blue-400"></div>
                            <span className="text-sm font-light">Loading more articles...</span>
                          </div>
                        </div>
                      )}
                      {!isLoadingMore && displayedNews.length < processedNews.length && (
                        <div className="py-4 text-center text-xs text-zinc-400 dark:text-zinc-500">
                          Scroll down for more articles
                        </div>
                      )}
                      {displayedNews.length >= processedNews.length && processedNews.length > 0 && (
                        <div className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                          <p className="font-light">You've reached the end</p>
                          <p className="mt-1 text-xs">All articles loaded</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="py-12 text-center text-zinc-500 dark:text-zinc-400">
                      <p className="text-lg font-light">No articles to display</p>
                      <p className="mt-2 text-sm">
                        Try adjusting your filters or check back later
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Command Palette */}
      <CommandPalette
        commands={commands}
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
      />

      {/* Keyboard Shortcut Hint */}
      <div className="fixed bottom-6 right-6 rounded-xl border border-zinc-200/80 bg-white/90 backdrop-blur-xl px-4 py-2.5 text-xs font-medium text-zinc-600 shadow-xl transition-all hover:shadow-2xl dark:border-zinc-800/80 dark:bg-zinc-900/90 dark:text-zinc-400">
        Press <kbd className="rounded-lg border border-zinc-300 bg-zinc-100 px-2 py-0.5 font-mono text-xs dark:border-zinc-600 dark:bg-zinc-800">Ctrl+K</kbd> for commands
      </div>
      
      {/* Background Image Settings Button */}
      <button
        onClick={() => {
          const url = prompt('Enter background image URL (or leave empty for daily images):');
          if (url === null) return;
          setPageBackgroundImage(url || null);
        }}
        className="fixed bottom-6 left-6 rounded-xl border border-zinc-200/80 bg-white/90 backdrop-blur-xl p-3 text-xs font-medium text-zinc-600 shadow-xl transition-all hover:shadow-2xl dark:border-zinc-800/80 dark:bg-zinc-900/90 dark:text-zinc-400"
        title="Change page background"
      >
        🖼️
      </button>
      </div>
    </div>
  );
}
