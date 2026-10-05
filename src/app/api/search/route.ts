import { NextRequest, NextResponse } from "next/server";
import { getAllMockForSearch } from "@/lib/mock-data";
import { fetchNewsArticles } from "@/lib/api/news";
import { fetchMovieRecommendations } from "@/lib/api/movies";
import { fetchSocialPosts } from "@/lib/api/social";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) {
    return NextResponse.json([]);
  }

  try {
    const [news, movies, social] = await Promise.all([
      fetchNewsArticles(
        ["technology", "sports", "finance", "entertainment", "science"],
        1,
        20,
      ),
      fetchMovieRecommendations(["entertainment", "technology", "science"]),
      fetchSocialPosts(q.replace(/\s+/g, "")),
    ]);

    const pool = [...news.items, ...movies, ...social];
    const lower = q.toLowerCase();
    let results = pool.filter(
      (item) =>
        item.title.toLowerCase().includes(lower) ||
        item.description.toLowerCase().includes(lower),
    );

    if (results.length === 0) {
      results = getAllMockForSearch(q);
    }

    return NextResponse.json(results.slice(0, 24));
  } catch {
    return NextResponse.json(getAllMockForSearch(q).slice(0, 24));
  }
}
