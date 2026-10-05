"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleDarkMode } from "@/store/slices/uiSlice";
import { SearchBar } from "./SearchBar";

export function Header() {
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector((s) => s.ui.darkMode);
  const userName = useAppSelector((s) => s.preferences.userName);

  return (
    <header className="sticky top-0 z-20 flex flex-col gap-4 border-b border-[var(--border)] bg-[var(--background)]/90 px-4 py-4 backdrop-blur md:flex-row md:items-center md:justify-between md:px-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
          Personalized Dashboard
        </p>
        <h1 className="text-lg font-bold md:text-xl">Welcome, {userName}</h1>
      </div>
      <SearchBar />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => dispatch(toggleDarkMode())}
          className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm hover:bg-[var(--surface)]"
          aria-pressed={darkMode}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? "☀ Light" : "☾ Dark"}
        </button>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-bold text-white"
          aria-hidden
        >
          {userName.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
