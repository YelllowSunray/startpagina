export interface NewsArticle {
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

// Calculate reading time based on word count (average reading speed: 200 words/min)
export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  return wordCount / wordsPerMinute;
}

// Detect duplicate/similar articles based on title similarity
export function detectDuplicates(articles: NewsArticle[]): NewsArticle[] {
  const processed = articles.map((article) => ({ ...article }));
  
  for (let i = 0; i < processed.length; i++) {
    const related: string[] = [];
    
    for (let j = i + 1; j < processed.length; j++) {
      const similarity = calculateSimilarity(
        processed[i].title.toLowerCase(),
        processed[j].title.toLowerCase()
      );
      
      if (similarity > 0.6) {
        processed[j].isDuplicate = true;
        related.push(processed[j].id);
      }
    }
    
    if (related.length > 0) {
      processed[i].relatedCount = related.length + 1;
    }
  }
  
  return processed;
}

// Simple string similarity using Levenshtein distance
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

// Filter articles by category
export function filterByCategory(
  articles: NewsArticle[],
  category: string
): NewsArticle[] {
  if (!category || category === 'All') return articles;
  return articles.filter((article) => article.category === category);
}

// Sort articles by various criteria
export function sortArticles(
  articles: NewsArticle[],
  sortBy: 'newest' | 'oldest' | 'readingTime' | 'relevance'
): NewsArticle[] {
  const sorted = [...articles];
  
  switch (sortBy) {
    case 'newest':
      return sorted.sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    case 'oldest':
      return sorted.sort(
        (a, b) =>
          new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
      );
    case 'readingTime':
      return sorted.sort((a, b) => (a.readingTime || 0) - (b.readingTime || 0));
    case 'relevance':
      // Put non-duplicates first, then by date
      return sorted.sort((a, b) => {
        if (a.isDuplicate && !b.isDuplicate) return 1;
        if (!a.isDuplicate && b.isDuplicate) return -1;
        return (
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
      });
    default:
      return sorted;
  }
}

// Generate a summary from text (simple extractive summary)
export function generateSummary(text: string, maxLength: number = 150): string {
  if (text.length <= maxLength) return text;
  
  // Try to cut at sentence boundary
  const truncated = text.substring(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('.');
  const lastExclamation = truncated.lastIndexOf('!');
  const lastQuestion = truncated.lastIndexOf('?');
  
  const lastSentenceEnd = Math.max(lastPeriod, lastExclamation, lastQuestion);
  
  if (lastSentenceEnd > maxLength * 0.7) {
    return truncated.substring(0, lastSentenceEnd + 1) + '...';
  }
  
  return truncated + '...';
}

