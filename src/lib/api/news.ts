import type { ContentCategory, ContentItem } from "@/types/content";
import { getMockNews } from "@/lib/mock-data";

const categoryToNewsQuery: Record<ContentCategory, string> = {
  technology: "technology",
  sports: "sports",
  finance: "business",
  entertainment: "entertainment",
  science: "science",
};

export async function fetchNewsArticles(
  categories: ContentCategory[],
  page: number,
  pageSize: number,
): Promise<{ items: ContentItem[]; hasMore: boolean }> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    return getMockNews(categories, page, pageSize);
  }

  const query = categories.map((c) => categoryToNewsQuery[c]).join(" OR ");
  const url = new URL("https://newsapi.org/v2/everything");
  url.searchParams.set("q", query);
  url.searchParams.set("pageSize", String(pageSize));
  url.searchParams.set("page", String(page));
  url.searchParams.set("sortBy", "publishedAt");
  url.searchParams.set("language", "en");

  const res = await fetch(url.toString(), {
    headers: { "X-Api-Key": apiKey },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    return getMockNews(categories, page, pageSize);
  }

  const data = (await res.json()) as {
    articles?: Array<{
      title?: string;
      description?: string;
      url?: string;
      urlToImage?: string;
      publishedAt?: string;
    }>;
    totalResults?: number;
  };

  const articles = data.articles ?? [];
  const items: ContentItem[] = articles.map((a, i) => ({
    id: `news-${page}-${i}-${a.url ?? i}`,
    source: "news",
    title: a.title ?? "Untitled",
    description: a.description ?? "",
    imageUrl: a.urlToImage ?? undefined,
    url: a.url,
    category: categories[0],
    publishedAt: a.publishedAt,
    trendingScore: 50 + Math.floor(Math.random() * 40),
  }));

  const total = data.totalResults ?? items.length;
  return {
    items,
    hasMore: page * pageSize < total,
  };
}
