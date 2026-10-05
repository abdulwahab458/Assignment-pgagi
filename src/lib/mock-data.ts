import type { ContentCategory, ContentItem } from "@/types/content";

const categoryNews: Record<ContentCategory, ContentItem[]> = {
  technology: [
    {
      id: "mock-news-tech-1",
      source: "news",
      title: "AI Assistants Reshape Developer Workflows",
      description:
        "Teams report faster prototyping as coding agents integrate with CI pipelines.",
      category: "technology",
      imageUrl: "https://picsum.photos/seed/tech1/640/360",
      url: "https://example.com/news/ai-dev",
      publishedAt: new Date().toISOString(),
      trendingScore: 92,
    },
    {
      id: "mock-news-tech-2",
      source: "news",
      title: "Quantum Networking Milestone Announced",
      description: "Researchers demonstrate stable entanglement over metropolitan distances.",
      category: "technology",
      imageUrl: "https://picsum.photos/seed/tech2/640/360",
      url: "https://example.com/news/quantum",
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
      trendingScore: 78,
    },
  ],
  sports: [
    {
      id: "mock-news-sports-1",
      source: "news",
      title: "Championship Finals Set After Overtime Thriller",
      description: "Underdogs clinch a spot in the title game with a last-second three.",
      category: "sports",
      imageUrl: "https://picsum.photos/seed/sports1/640/360",
      url: "https://example.com/news/finals",
      publishedAt: new Date().toISOString(),
      trendingScore: 88,
    },
  ],
  finance: [
    {
      id: "mock-news-finance-1",
      source: "news",
      title: "Markets Rally on Strong Earnings Season",
      description: "Major indices hit new highs as tech and energy sectors lead gains.",
      category: "finance",
      imageUrl: "https://picsum.photos/seed/finance1/640/360",
      url: "https://example.com/news/markets",
      publishedAt: new Date().toISOString(),
      trendingScore: 85,
    },
  ],
  entertainment: [
    {
      id: "mock-news-ent-1",
      source: "news",
      title: "Streaming Giant Greenlights Sci-Fi Anthology",
      description: "Award-winning creators join an eight-episode limited series.",
      category: "entertainment",
      imageUrl: "https://picsum.photos/seed/ent1/640/360",
      url: "https://example.com/news/streaming",
      publishedAt: new Date().toISOString(),
      trendingScore: 74,
    },
  ],
  science: [
    {
      id: "mock-news-science-1",
      source: "news",
      title: "New Telescope Images Reveal Distant Galaxies",
      description: "Astronomers publish the deepest infrared survey to date.",
      category: "science",
      imageUrl: "https://picsum.photos/seed/science1/640/360",
      url: "https://example.com/news/space",
      publishedAt: new Date().toISOString(),
      trendingScore: 81,
    },
  ],
};

export function getMockNews(
  categories: ContentCategory[],
  page: number,
  pageSize: number,
): { items: ContentItem[]; hasMore: boolean } {
  const pool = categories.flatMap((c) => categoryNews[c] ?? []);
  const start = (page - 1) * pageSize;
  const slice = pool.slice(start, start + pageSize);
  return {
    items: slice,
    hasMore: start + pageSize < pool.length,
  };
}

export const mockMovies: ContentItem[] = [
  {
    id: "mock-movie-1",
    source: "movie",
    title: "Neon Horizon",
    description: "A pilot discovers a signal that could rewrite human history.",
    imageUrl: "https://picsum.photos/seed/movie1/640/360",
    url: "https://www.themoviedb.org/",
    category: "entertainment",
    trendingScore: 95,
  },
  {
    id: "mock-movie-2",
    source: "movie",
    title: "The Last Archive",
    description: "Librarians race to preserve culture before a global blackout.",
    imageUrl: "https://picsum.photos/seed/movie2/640/360",
    url: "https://www.themoviedb.org/",
    category: "entertainment",
    trendingScore: 87,
  },
  {
    id: "mock-movie-3",
    source: "movie",
    title: "Circuit Breaker",
    description: "Hackers and regulators collide in a near-future thriller.",
    imageUrl: "https://picsum.photos/seed/movie3/640/360",
    url: "https://www.themoviedb.org/",
    category: "technology",
    trendingScore: 82,
  },
];

export function getMockSocial(hashtag: string): ContentItem[] {
  return [
    {
      id: `mock-social-${hashtag}-1`,
      source: "social",
      title: `#${hashtag} — Community highlight`,
      description: "Developers share tips on building resilient dashboards at scale.",
      imageUrl: `https://picsum.photos/seed/social-${hashtag}/640/360`,
      url: "https://example.com/social/1",
      category: hashtag,
      publishedAt: new Date().toISOString(),
      trendingScore: 70,
    },
    {
      id: `mock-social-${hashtag}-2`,
      source: "social",
      title: `Trending on #${hashtag}`,
      description: "Live reactions from the keynote — thread 🧵",
      imageUrl: `https://picsum.photos/seed/social2-${hashtag}/640/360`,
      url: "https://example.com/social/2",
      category: hashtag,
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      trendingScore: 65,
    },
  ];
}

export function getAllMockForSearch(query: string): ContentItem[] {
  const q = query.toLowerCase();
  const all: ContentItem[] = [
    ...Object.values(categoryNews).flat(),
    ...mockMovies,
    ...getMockSocial("tech"),
    ...getMockSocial("movies"),
  ];
  return all.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      (item.category?.toLowerCase().includes(q) ?? false),
  );
}
