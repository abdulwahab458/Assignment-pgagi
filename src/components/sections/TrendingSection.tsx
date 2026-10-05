"use client";

import { motion } from "framer-motion";
import { useGetTrendingQuery } from "@/store/api/contentApi";
import { ContentCard } from "@/components/content/ContentCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";

export function TrendingSection() {
  const { data, isLoading, isError } = useGetTrendingQuery();

  return (
    <motion.section
      key="trending"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
      aria-labelledby="trending-heading"
    >
      <div>
        <h2 id="trending-heading" className="text-2xl font-bold">
          Trending now
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Top stories, films, and posts across your categories.
        </p>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : isError || !data?.length ? (
        <EmptyState title="No trending items" description="Try again later." />
      ) : (
        <ul className="grid list-none gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.map((item, index) => (
            <li key={item.id} className="relative">
              <span className="absolute -left-1 -top-1 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-white">
                {index + 1}
              </span>
              <ContentCard item={item} />
            </li>
          ))}
        </ul>
      )}
    </motion.section>
  );
}
