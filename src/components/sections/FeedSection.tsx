"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  useGetFeedPageQuery,
  useSearchContentQuery,
} from "@/store/api/contentApi";
import { setFeedOrder } from "@/store/slices/uiSlice";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { DraggableFeedGrid } from "@/components/feed/DraggableFeedGrid";
import { ContentCard } from "@/components/content/ContentCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";

export function FeedSection() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((s) => s.preferences.categories);
  const hashtag = useAppSelector((s) => s.preferences.socialHashtag);
  const feedOrder = useAppSelector((s) => s.ui.feedOrder);
  const searchQuery = useAppSelector((s) => s.ui.searchQuery);
  const debouncedSearch = useDebouncedValue(searchQuery, 400);
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError, refetch } = useGetFeedPageQuery({
    categories,
    page,
    hashtag,
  });

  const { data: searchResults, isFetching: searchLoading } =
    useSearchContentQuery(
      { q: debouncedSearch },
      { skip: debouncedSearch.trim().length < 2 },
    );

  useEffect(() => {
    setPage(1);
  }, [categories.join(","), hashtag]);

  const showSearch = debouncedSearch.trim().length >= 2;
  const items = showSearch ? (searchResults ?? []) : (data?.items ?? []);
  const hasMore = !showSearch && (data?.hasMore ?? false);

  const loadMore = useCallback(() => {
    if (!isFetching && hasMore) setPage((p) => p + 1);
  }, [hasMore, isFetching]);

  useEffect(() => {
    function onScroll() {
      if (showSearch) return;
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 400;
      if (nearBottom) loadMore();
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [loadMore, showSearch]);

  return (
    <motion.section
      key="feed"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
      aria-labelledby="feed-heading"
    >
      <div>
        <h2 id="feed-heading" className="text-2xl font-bold">
          {showSearch ? "Search results" : "Your feed"}
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          News, recommendations, and social posts tailored to your preferences.
          Drag cards by the handle to reorder.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {(isLoading || (showSearch && searchLoading)) && items.length === 0 ? (
          <LoadingSpinner key="loading" />
        ) : isError && !showSearch ? (
          <EmptyState
            key="error"
            title="Could not load feed"
            description="Check your connection or API keys in .env.local."
          />
        ) : items.length === 0 ? (
          <EmptyState
            key="empty"
            title={showSearch ? "No matches" : "Nothing to show yet"}
            description={
              showSearch
                ? "Try a different search term."
                : "Adjust categories in Settings."
            }
          />
        ) : showSearch ? (
          <ul
            key="search-grid"
            className="grid list-none gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            {items.map((item) => (
              <li key={item.id}>
                <ContentCard item={item} />
              </li>
            ))}
          </ul>
        ) : (
          <DraggableFeedGrid
            key="feed-grid"
            items={items}
            order={feedOrder}
            onOrderChange={(ids) => dispatch(setFeedOrder(ids))}
          />
        )}
      </AnimatePresence>

      {!showSearch && isFetching && page > 1 ? (
        <LoadingSpinner label="Loading more…" />
      ) : null}

      {!showSearch && !isLoading ? (
        <div className="flex justify-center">
          <button
            type="button"
            disabled={!hasMore || isFetching}
            onClick={() => {
              if (hasMore) setPage((p) => p + 1);
              else refetch();
            }}
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm disabled:opacity-40"
          >
            {hasMore ? "Load more" : "Refresh feed"}
          </button>
        </div>
      ) : null}
    </motion.section>
  );
}
