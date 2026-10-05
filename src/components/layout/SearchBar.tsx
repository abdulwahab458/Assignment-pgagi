"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSearchQuery } from "@/store/slices/uiSlice";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useSearchContentQuery } from "@/store/api/contentApi";

export function SearchBar() {
  const dispatch = useAppDispatch();
  const query = useAppSelector((s) => s.ui.searchQuery);
  const debounced = useDebouncedValue(query, 400);
  const { data, isFetching, isError } = useSearchContentQuery(
    { q: debounced },
    { skip: debounced.trim().length < 2 },
  );

  return (
    <div className="relative w-full max-w-xl">
      <label htmlFor="global-search" className="sr-only">
        Search content
      </label>
      <input
        id="global-search"
        type="search"
        placeholder="Search news, movies, posts…"
        value={query}
        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] py-2.5 pl-4 pr-10 text-sm outline-none ring-[var(--accent)] focus:ring-2"
        autoComplete="off"
      />
      {isFetching && debounced.length >= 2 ? (
        <span
          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted)]"
          aria-live="polite"
        >
          …
        </span>
      ) : null}
      {debounced.length >= 2 && data && data.length > 0 ? (
        <p className="sr-only" aria-live="polite">
          {data.length} results found
        </p>
      ) : null}
      {isError && debounced.length >= 2 ? (
        <p className="mt-1 text-xs text-red-500">Search failed. Try again.</p>
      ) : null}
    </div>
  );
}
