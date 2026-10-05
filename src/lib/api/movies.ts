import type { ContentCategory, ContentItem } from "@/types/content";
import { mockMovies } from "@/lib/mock-data";

const genreMap: Partial<Record<ContentCategory, number>> = {
  technology: 878,
  entertainment: 28,
  science: 878,
};

export async function fetchMovieRecommendations(
  categories: ContentCategory[],
): Promise<ContentItem[]> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    return mockMovies.filter(
      (m) =>
        !m.category ||
        categories.includes(m.category as ContentCategory) ||
        categories.includes("entertainment"),
    );
  }

  const genreId =
    categories.map((c) => genreMap[c]).find(Boolean) ?? 28;

  const url = new URL("https://api.themoviedb.org/3/discover/movie");
  url.searchParams.set("with_genres", String(genreId));
  url.searchParams.set("sort_by", "popularity.desc");
  url.searchParams.set("page", "1");
  url.searchParams.set("api_key", apiKey);

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return mockMovies;
  }

  const data = (await res.json()) as {
    results?: Array<{
      id: number;
      title: string;
      overview: string;
      poster_path?: string;
      popularity?: number;
    }>;
  };

  return (data.results ?? []).slice(0, 6).map((m) => ({
    id: `tmdb-${m.id}`,
    source: "movie" as const,
    title: m.title,
    description: m.overview,
    imageUrl: m.poster_path
      ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
      : undefined,
    url: `https://www.themoviedb.org/movie/${m.id}`,
    category: "entertainment",
    trendingScore: Math.round(m.popularity ?? 50),
  }));
}
