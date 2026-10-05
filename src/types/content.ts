export type ContentSource = "news" | "movie";

export type ContentCategory =
  | "technology"
  | "sports"
  | "finance"
  | "entertainment"
  | "science";

export const CONTENT_CATEGORIES: ContentCategory[] = [
  "technology",
  "sports",
  "finance",
  "entertainment",
  "science",
];

export interface ContentItem {
  id: string;
  source: ContentSource;
  title: string;
  description: string;
  imageUrl?: string;
  url?: string;
  category?: string;
  publishedAt?: string;
  trendingScore?: number;
}

export type DashboardSection = "feed" | "trending" | "favorites" | "settings";
