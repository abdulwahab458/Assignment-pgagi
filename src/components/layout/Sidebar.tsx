"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setActiveSection } from "@/store/slices/uiSlice";
import type { DashboardSection } from "@/types/content";

const nav: { id: DashboardSection; label: string; icon: string }[] = [
  { id: "feed", label: "Feed", icon: "◎" },
  { id: "trending", label: "Trending", icon: "↑" },
  { id: "favorites", label: "Favorites", icon: "★" },
  { id: "settings", label: "Settings", icon: "⚙" },
];

export function Sidebar() {
  const dispatch = useAppDispatch();
  const active = useAppSelector((s) => s.ui.activeSection);
  const favCount = useAppSelector((s) => s.favorites.items.length);

  return (
    <aside className="flex w-full shrink-0 flex-row gap-1 overflow-x-auto border-b border-[var(--border)] bg-[var(--surface)] p-2 md:w-56 md:flex-col md:border-b-0 md:border-r md:p-4">
      <p className="hidden px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)] md:block">
        Navigation
      </p>
      <nav className="flex flex-1 flex-row gap-1 md:flex-col" aria-label="Main">
        {nav.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => dispatch(setActiveSection(item.id))}
            className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
              active === item.id
                ? "bg-[var(--accent)] text-white"
                : "text-[var(--foreground)] hover:bg-[var(--surface-elevated)]"
            }`}
            aria-current={active === item.id ? "page" : undefined}
          >
            <span aria-hidden>{item.icon}</span>
            {item.label}
            {item.id === "favorites" && favCount > 0 ? (
              <span className="ml-auto rounded-full bg-black/10 px-2 text-xs dark:bg-white/20">
                {favCount}
              </span>
            ) : null}
          </button>
        ))}
      </nav>
    </aside>
  );
}
