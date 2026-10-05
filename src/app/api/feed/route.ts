import { NextRequest, NextResponse } from "next/server";
import { CONTENT_CATEGORIES, type ContentCategory } from "@/types/content";
import { fetchNewsArticles } from "@/lib/api/news";
import { fetchMovieRecommendations } from "@/lib/api/movies";
import { fetchSocialPosts } from "@/lib/api/social";

function parseCategories(raw: string | null): ContentCategory[] {
  if (!raw) return ["technology", "entertainment"];
  const parts = raw.split(",").map((s) => s.trim().toLowerCase());
  const valid = parts.filter((p): p is ContentCategory =>
    CONTENT_CATEGORIES.includes(p as ContentCategory),
  );
  return valid.length ? valid : ["technology", "entertainment"];
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const categories = parseCategories(searchParams.get("categories"));
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const pageSize = Math.min(20, Math.max(1, Number(searchParams.get("pageSize") ?? "6")));
  const hashtag = searchParams.get("hashtag") ?? "tech";

  try {
    const [news, movies, social] = await Promise.all([
      fetchNewsArticles(categories, page, Math.ceil(pageSize / 2)),
      page === 1 ? fetchMovieRecommendations(categories) : Promise.resolve([]),
      page === 1 ? fetchSocialPosts(hashtag) : Promise.resolve([]),
    ]);

    const merged = [...news.items, ...movies, ...social].slice(0, pageSize);
    const hasMore = news.hasMore || page === 1;

    return NextResponse.json({
      items: merged,
      hasMore,
      page,
    });
  } catch {
    return NextResponse.json(
      { items: [], hasMore: false, page, error: "Failed to load feed" },
      { status: 500 },
    );
  }
}
