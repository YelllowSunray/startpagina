import { NewsArticle, calculateReadingTime, generateSummary } from './newsUtils';

const newsTemplates = [
  {
    titles: [
      'Revolutionary AI Model Breaks Language Barriers',
      'Quantum Computing Reaches New Milestone',
      'Breakthrough in Battery Technology Extends Life by 300%',
      'Scientists Discover New Method for Carbon Capture',
      'Space Exploration Enters New Era with Private Missions',
      'Biotech Firm Develops Revolutionary Cancer Treatment',
      'Renewable Energy Surpasses Fossil Fuels in Key Markets',
      'Neural Interface Technology Shows Promise for Paralysis',
    ],
    sources: ['Tech News', 'Science Daily', 'Innovation Weekly', 'Future Tech'],
    categories: ['Technology', 'Science'],
    summaries: [
      'A new artificial intelligence system has been developed that can translate between over 100 languages in real-time, potentially revolutionizing global communication.',
      'Researchers have achieved a significant breakthrough in quantum computing, bringing us closer to solving complex problems that were previously impossible.',
      'A team of engineers has created a new battery technology that could extend device battery life by up to 300%, addressing one of the biggest challenges in modern electronics.',
      'Scientists have developed an innovative method for capturing carbon dioxide from the atmosphere, offering new hope in the fight against climate change.',
      'Private space companies are making unprecedented progress, with multiple successful missions marking a new chapter in space exploration.',
      'A biotechnology company has announced promising results from clinical trials of a new cancer treatment that targets tumors with unprecedented precision.',
      'For the first time in history, renewable energy sources have surpassed fossil fuels in several major markets, signaling a major shift in global energy production.',
      'Breakthrough research in neural interface technology has shown remarkable results in helping paralyzed patients regain movement.',
    ],
  },
  {
    titles: [
      'Global Markets React to Economic Policy Changes',
      'Remote Work Revolution Transforms Corporate Culture',
      'Sustainable Business Practices Gain Mainstream Adoption',
      'Startup Ecosystem Sees Record Investment Year',
      'Supply Chain Innovation Reduces Costs by 40%',
      'Corporate Social Responsibility Becomes Competitive Advantage',
    ],
    sources: ['Business Weekly', 'Financial Times', 'Forbes', 'Wall Street Journal'],
    categories: ['Business', 'Finance'],
    summaries: [
      'Financial markets worldwide are responding to new economic policies, with analysts predicting significant long-term impacts on global trade.',
      'The shift to remote work has fundamentally changed how companies operate, with many reporting increased productivity and employee satisfaction.',
      'Major corporations are increasingly adopting sustainable practices, recognizing both environmental and financial benefits.',
      'The startup ecosystem has experienced unprecedented growth, with venture capital investments reaching record highs this year.',
      'Innovative supply chain management techniques have helped companies reduce operational costs while improving efficiency.',
      'Companies are discovering that strong social responsibility programs not only benefit communities but also drive business success.',
    ],
  },
  {
    titles: [
      'New Study Reveals Benefits of Mediterranean Diet',
      'Mental Health Awareness Campaign Reaches Millions',
      'Breakthrough in Alzheimer\'s Research Shows Promise',
      'Fitness Trends Focus on Holistic Wellness',
      'Telemedicine Transforms Healthcare Access',
      'Preventive Medicine Gains Traction Worldwide',
    ],
    sources: ['Health Today', 'Medical Journal', 'Wellness Weekly', 'Health & Science'],
    categories: ['Health', 'Wellness'],
    summaries: [
      'A comprehensive new study confirms the long-term health benefits of the Mediterranean diet, showing significant improvements in heart health and longevity.',
      'A nationwide mental health awareness campaign has successfully reached millions of people, reducing stigma and encouraging more to seek help.',
      'Researchers have made significant progress in understanding Alzheimer\'s disease, with new treatments showing promise in early clinical trials.',
      'The fitness industry is shifting toward holistic approaches that combine physical exercise with mental wellness and nutrition.',
      'Telemedicine services have dramatically improved healthcare access, especially in rural and underserved communities.',
      'Healthcare systems worldwide are increasingly focusing on preventive medicine, recognizing that prevention is more effective than treatment.',
    ],
  },
  {
    titles: [
      'International Film Festival Celebrates Diverse Voices',
      'Virtual Reality Art Exhibition Breaks Attendance Records',
      'Music Streaming Services Transform Industry Landscape',
      'Literary Festival Highlights Emerging Authors',
      'Cultural Exchange Programs Foster Global Understanding',
      'Digital Art Market Sees Unprecedented Growth',
    ],
    sources: ['Culture Today', 'Arts & Entertainment', 'Cultural Weekly', 'Entertainment News'],
    categories: ['Culture', 'Arts'],
    summaries: [
      'This year\'s international film festival showcased an unprecedented diversity of voices and stories from around the world.',
      'A groundbreaking virtual reality art exhibition has attracted record numbers of visitors, demonstrating the potential of immersive art experiences.',
      'Music streaming platforms continue to reshape the music industry, creating new opportunities for artists while challenging traditional business models.',
      'A major literary festival has brought attention to emerging authors, highlighting the importance of supporting new voices in literature.',
      'Cultural exchange programs are playing a crucial role in fostering understanding and cooperation between nations.',
      'The digital art market has experienced explosive growth, with NFT sales and digital galleries becoming mainstream.',
    ],
  },
];

const imageUrls = [
  'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400',
  'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400',
  'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400',
];

export function generateMoreNews(count: number, startId: number = 1): NewsArticle[] {
  const articles: NewsArticle[] = [];
  const now = Date.now();
  
  for (let i = 0; i < count; i++) {
    const templateIndex = Math.floor(Math.random() * newsTemplates.length);
    const template = newsTemplates[templateIndex];
    const titleIndex = Math.floor(Math.random() * template.titles.length);
    const sourceIndex = Math.floor(Math.random() * template.sources.length);
    const categoryIndex = Math.floor(Math.random() * template.categories.length);
    const summaryIndex = Math.floor(Math.random() * template.summaries.length);
    
    const hoursAgo = Math.floor(Math.random() * 72); // Random time in last 3 days
    const publishedAt = new Date(now - hoursAgo * 60 * 60 * 1000).toISOString();
    
    const summary = template.summaries[summaryIndex];
    const hasImage = Math.random() > 0.3; // 70% chance of having an image
    
    articles.push({
      id: `news-${startId + i}`,
      title: template.titles[titleIndex],
      source: template.sources[sourceIndex],
      url: `#article-${startId + i}`,
      summary: generateSummary(summary),
      readingTime: calculateReadingTime(summary),
      publishedAt,
      category: template.categories[categoryIndex],
      imageUrl: hasImage ? imageUrls[Math.floor(Math.random() * imageUrls.length)] : undefined,
    });
  }
  
  return articles;
}

