"use client";

import { motion } from "framer-motion";
import { useAppSelector } from "@/store/hooks";
import { ContentCard } from "@/components/content/ContentCard";
import { EmptyState } from "@/components/ui/EmptyState";

export function FavoritesSection() {
  const items = useAppSelector((s) => s.favorites.items);

  return (
    <motion.section
      key="favorites"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
      aria-labelledby="favorites-heading"
    >
      <div>
        <h2 id="favorites-heading" className="text-2xl font-bold">
          Favorites
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Content you saved for quick access.
        </p>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="No favorites yet"
          description='Use the "Favorite" button on any card to save it here.'
        />
      ) : (
        <ul className="grid list-none gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <li key={item.id}>
              <ContentCard item={item} />
            </li>
          ))}
        </ul>
      )}
    </motion.section>
  );
}
