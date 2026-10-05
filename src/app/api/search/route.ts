import { NextRequest, NextResponse } from "next/server";
import { searchNewsArticles } from "@/lib/api/news";
import { searchMovies } from "@/lib/api/movies";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) {
    return NextResponse.json([]);
  }

  const [newsResult, moviesResult] = await Promise.allSettled([
    searchNewsArticles(q),
    searchMovies(q),
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
      { error: "Live search providers are unavailable." },
      { status: 502 },
    );
  }

  return NextResponse.json([...news, ...movies].slice(0, 24));
}
