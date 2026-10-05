import type { ContentCategory, ContentItem } from "@/types/content";

const TMDB_API_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const genreMap: Partial<Record<ContentCategory, number>> = {
  technology: 878,
  entertainment: 28,
  science: 878,
};

type TmdbMovie = {
  id?: number;
  title?: string;
  overview?: string;
  poster_path?: string | null;
  popularity?: number;
  release_date?: string;
};

type TmdbResponse = {
  results?: TmdbMovie[];
  success?: boolean;
};

export class TmdbApiError extends Error {
  constructor(message = "TMDB could not be reached.") {
    super(message);
    this.name = "TmdbApiError";
  }
}

function getApiKey() {
  const apiKey = process.env.TMDB_API_KEY?.trim();
  if (!apiKey) {
    throw new TmdbApiError("TMDB_API_KEY is not configured.");
  }
  return apiKey;
}

function toContentItem(movie: TmdbMovie): ContentItem | null {
  const title = movie.title?.trim();
  if (!title || typeof movie.id !== "number") {
    return null;
  }

  return {
    id: `tmdb-${movie.id}`,
    source: "movie",
    title,
    description:
      movie.overview?.trim() || "No overview is available for this movie.",
    imageUrl: movie.poster_path ? `${TMDB_IMAGE_URL}${movie.poster_path}` : undefined,
    url: `https://www.themoviedb.org/movie/${movie.id}`,
    category: "entertainment",
    publishedAt: movie.release_date,
    trendingScore: Math.round(movie.popularity ?? 0),
  };
}

async function requestTmdb(
  path: string,
  searchParams: Record<string, string>,
): Promise<ContentItem[]> {
  const url = new URL(`${TMDB_API_URL}${path}`);
  Object.entries(searchParams).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  url.searchParams.set("api_key", getApiKey());

  let response: Response;
  try {
    response = await fetch(url, { next: { revalidate: 3600 } });
  } catch {
    throw new TmdbApiError();
  }

  const data = (await response.json().catch(() => null)) as TmdbResponse | null;
  if (!response.ok || data?.success === false || !data) {
    throw new TmdbApiError();
  }

  return (data.results ?? [])
    .map(toContentItem)
    .filter((item): item is ContentItem => item !== null);
}

export async function fetchMovieRecommendations(
  categories: ContentCategory[],
  limit = 6,
): Promise<ContentItem[]> {
  const genreId = categories
    .map((category) => genreMap[category])
    .find((genre): genre is number => genre !== undefined);
  const params: Record<string, string> = {
    sort_by: "popularity.desc",
    include_adult: "false",
    language: "en-US",
    page: "1",
  };

  if (genreId) {
    params.with_genres = String(genreId);
  }

  const movies = await requestTmdb("/discover/movie", params);
  return movies.slice(0, limit);
}

export async function searchMovies(query: string, limit = 12) {
  const movies = await requestTmdb("/search/movie", {
    query,
    include_adult: "false",
    language: "en-US",
    page: "1",
  });
  return movies.slice(0, limit);
}
