import { NextResponse } from "next/server";
import { fetchNewsArticles } from "@/lib/api/news";
import { fetchMovieRecommendations } from "@/lib/api/movies";
import { fetchSocialPosts } from "@/lib/api/social";

export async function GET() {
  try {
    const [news, movies, social] = await Promise.all([
      fetchNewsArticles(
        ["technology", "sports", "finance", "entertainment", "science"],
        1,
        8,
      ),
      fetchMovieRecommendations(["entertainment", "technology"]),
      fetchSocialPosts("tech"),
    ]);

    const combined = [...news.items, ...movies, ...social];
    const trending = [...combined].sort(
      (a, b) => (b.trendingScore ?? 0) - (a.trendingScore ?? 0),
    );

    return NextResponse.json(trending.slice(0, 12));
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
