import { NextRequest, NextResponse } from "next/server";
import { CONTENT_CATEGORIES, type ContentCategory } from "@/types/content";
import { fetchNewsArticles } from "@/lib/api/news";
import { fetchMovieRecommendations } from "@/lib/api/movies";

function parseCategories(raw: string | null): ContentCategory[] {
  if (!raw) return ["technology", "entertainment"];
  const parts = raw.split(",").map((s) => s.trim().toLowerCase());
  const valid = parts.filter((p): p is ContentCategory =>
    CONTENT_CATEGORIES.includes(p as ContentCategory),
  );
  return valid.length ? valid : ["technology", "entertainment"];
}

function parsePage(raw: string | null) {
  const page = Number.parseInt(raw ?? "1", 10);
  return Number.isFinite(page) ? Math.max(1, page) : 1;
}

function parsePageSize(raw: string | null) {
  const pageSize = Number.parseInt(raw ?? "6", 10);
  return Number.isFinite(pageSize) ? Math.min(20, Math.max(1, pageSize)) : 6;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const categories = parseCategories(searchParams.get("categories"));
  const page = parsePage(searchParams.get("page"));
  const pageSize = parsePageSize(searchParams.get("pageSize"));

  const [newsResult, moviesResult] = await Promise.allSettled([
    fetchNewsArticles(categories, page, Math.ceil(pageSize / 2)),
    page === 1 ? fetchMovieRecommendations(categories) : Promise.resolve([]),
  ]);

  const news =
    newsResult.status === "fulfilled"
      ? newsResult.value
      : { items: [], hasMore: false };
  const movies = moviesResult.status === "fulfilled" ? moviesResult.value : [];
  const items = [...news.items, ...movies].slice(0, pageSize);

  if (
    newsResult.status === "rejected" &&
    (page > 1 || moviesResult.status === "rejected")
  ) {
    return NextResponse.json(
      {
        items: [],
        hasMore: false,
        page,
        error: "Live content providers are unavailable.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    items,
    hasMore: news.hasMore,
    page,
  });
}
