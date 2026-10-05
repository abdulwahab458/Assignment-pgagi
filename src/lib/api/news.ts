import type { ContentCategory, ContentItem } from "@/types/content";

const NEWS_API_URL = "https://newsapi.org/v2/everything";

const categoryToNewsQuery: Record<ContentCategory, string> = {
  technology: "technology",
  sports: "sports",
  finance: "business",
  entertainment: "entertainment",
  science: "science",
};

type NewsApiArticle = {
  title?: string;
  description?: string;
  content?: string;
  url?: string;
  urlToImage?: string;
  publishedAt?: string;
};

type NewsApiResponse = {
  status?: "ok" | "error";
  totalResults?: number;
  articles?: NewsApiArticle[];
};

export class NewsApiError extends Error {
  constructor(message = "NewsAPI could not be reached.") {
    super(message);
    this.name = "NewsApiError";
  }
}

function getApiKey() {
  const apiKey = process.env.NEWS_API_KEY?.trim();
  if (!apiKey) {
    throw new NewsApiError("NEWS_API_KEY is not configured.");
  }
  return apiKey;
}

function stableId(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function toContentItem(
  article: NewsApiArticle,
  index: number,
  category?: ContentCategory,
): ContentItem | null {
  const title = article.title?.trim();
  const url = article.url?.trim();

  if (!title || title === "[Removed]" || !url) {
    return null;
  }

  return {
    id: `news-${stableId(url)}`,
    source: "news",
    title,
    description: article.description?.trim() || article.content?.trim() || "",
    imageUrl: article.urlToImage?.trim() || undefined,
    url,
    ...(category ? { category } : {}),
    publishedAt: article.publishedAt,
    // NewsAPI returns the response ordered by the requested sort. Keep that
    // provider order deterministic when news is combined with movie results.
    trendingScore: Math.max(1, 100 - index * 4),
  };
}

function categoryQuery(categories: ContentCategory[]) {
  const terms = [
    ...new Set(categories.map((category) => categoryToNewsQuery[category])),
  ];
  return terms.length > 1 ? `(${terms.join(" OR ")})` : terms[0] ?? "technology";
}

async function requestNews(
  query: string,
  page: number,
  pageSize: number,
  sortBy: "publishedAt" | "relevancy",
  category?: ContentCategory,
): Promise<{ items: ContentItem[]; hasMore: boolean }> {
  const url = new URL(NEWS_API_URL);
  url.searchParams.set("q", query);
  url.searchParams.set("pageSize", String(pageSize));
  url.searchParams.set("page", String(page));
  url.searchParams.set("sortBy", sortBy);
  url.searchParams.set("language", "en");

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { "X-Api-Key": getApiKey() },
      next: { revalidate: 300 },
    });
  } catch {
    throw new NewsApiError();
  }

  const data = (await response.json().catch(() => null)) as NewsApiResponse | null;
  if (!response.ok || data?.status === "error" || !data) {
    throw new NewsApiError();
  }

  const articles = data.articles ?? [];
  const items = articles
    .map((article, index) => toContentItem(article, index, category))
    .filter((item): item is ContentItem => item !== null);
  const totalResults = data.totalResults ?? items.length;

  return {
    items,
    hasMore: page * pageSize < totalResults,
  };
}

export function fetchNewsArticles(
  categories: ContentCategory[],
  page: number,
  pageSize: number,
) {
  return requestNews(
    categoryQuery(categories),
    page,
    pageSize,
    "publishedAt",
    categories[0],
  );
}

export function searchNewsArticles(query: string, pageSize = 12) {
  return requestNews(query, 1, pageSize, "relevancy");
}
