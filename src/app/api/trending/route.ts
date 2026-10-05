import { NextResponse } from "next/server";
import { fetchNewsArticles } from "@/lib/api/news";
import { fetchMovieRecommendations } from "@/lib/api/movies";

export async function GET() {
  const [newsResult, moviesResult] = await Promise.allSettled([
    fetchNewsArticles(
      ["technology", "sports", "finance", "entertainment", "science"],
      1,
      8,
    ),
    fetchMovieRecommendations(["entertainment", "technology"]),
  ]);

  const news = newsResult.status === "fulfilled" ? newsResult.value.items : [];
  const movies = moviesResult.status === "fulfilled" ? moviesResult.value : [];

  if (
    news.length === 0 &&
    movies.length === 0 &&
    newsResult.status === "rejected" &&
    moviesResult.status === "rejected"
  ) {
    return NextResponse.json(
      { error: "Live content providers are unavailable." },
      { status: 502 },
    );
  }

  const trending = [...news, ...movies].sort(
    (a, b) => (b.trendingScore ?? 0) - (a.trendingScore ?? 0),
  );

  return NextResponse.json(trending.slice(0, 12));
}
