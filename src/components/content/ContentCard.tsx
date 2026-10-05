"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { ContentItem } from "@/types/content";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleFavorite } from "@/store/slices/favoritesSlice";

const sourceLabels: Record<ContentItem["source"], string> = {
  news: "News",
  movie: "Movies",
};

const ctaLabels: Record<ContentItem["source"], string> = {
  news: "Read More",
  movie: "View Details",
};

export function ContentCard({
  item,
  dragHandleProps,
}: {
  item: ContentItem;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
}) {
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector((s) =>
    s.favorites.items.some((f) => f.id === item.id),
  );

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group flex flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm"
    >
      <div className="relative aspect-video w-full bg-[var(--surface-elevated)]">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt=""
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[var(--muted)]">
            No preview
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-[var(--accent)] px-2 py-0.5 text-xs font-medium text-white">
          {sourceLabels[item.source]}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug">
            {item.title}
          </h3>
          {dragHandleProps ? (
            <button
              type="button"
              className="shrink-0 cursor-grab rounded p-1 text-[var(--muted)] hover:bg-[var(--surface-elevated)] active:cursor-grabbing"
              aria-label="Drag to reorder"
              {...dragHandleProps}
            >
              ⋮⋮
            </button>
          ) : null}
        </div>
        <p className="line-clamp-3 flex-1 text-sm text-[var(--muted)]">
          {item.description}
        </p>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <a
            href={item.url ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-lg bg-[var(--accent)] px-3 py-1.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            {ctaLabels[item.source]}
          </a>
          <button
            type="button"
            onClick={() => dispatch(toggleFavorite(item))}
            className={`rounded-lg border px-3 py-1.5 text-sm transition ${
              isFavorite
                ? "border-amber-400/50 bg-amber-400/10 text-amber-600 dark:text-amber-300"
                : "border-[var(--border)] hover:bg-[var(--surface-elevated)]"
            }`}
            aria-pressed={isFavorite}
          >
            {isFavorite ? "★ Favorited" : "☆ Favorite"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
