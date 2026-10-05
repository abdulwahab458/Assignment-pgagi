"use client";

import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  toggleCategory,
  setSocialHashtag,
  setUserName,
} from "@/store/slices/preferencesSlice";
import { CONTENT_CATEGORIES, type ContentCategory } from "@/types/content";

export function SettingsPanel() {
  const dispatch = useAppDispatch();
  const { categories, socialHashtag, userName } = useAppSelector(
    (s) => s.preferences,
  );

  return (
    <motion.section
      key="settings"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      className="mx-auto max-w-lg space-y-8"
      aria-labelledby="settings-heading"
    >
      <div>
        <h2 id="settings-heading" className="text-2xl font-bold">
          Settings
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Preferences are saved automatically in your browser.
        </p>
      </div>

      <fieldset className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <legend className="px-1 text-sm font-semibold">Display name</legend>
        <input
          type="text"
          value={userName}
          onChange={(e) => dispatch(setUserName(e.target.value))}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
        />
      </fieldset>

      <fieldset className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <legend className="px-1 text-sm font-semibold">Favorite categories</legend>
        <div className="flex flex-wrap gap-2">
          {CONTENT_CATEGORIES.map((cat) => {
            const active = categories.includes(cat);
            return (
              <button
                key={cat}
                type="button"
                onClick={() =>
                  dispatch(toggleCategory(cat as ContentCategory))
                }
                className={`rounded-full px-3 py-1.5 text-sm capitalize transition ${
                  active
                    ? "bg-[var(--accent)] text-white"
                    : "border border-[var(--border)] hover:bg-[var(--surface-elevated)]"
                }`}
                aria-pressed={active}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <legend className="px-1 text-sm font-semibold">Social hashtag</legend>
        <input
          type="text"
          value={socialHashtag}
          onChange={(e) => dispatch(setSocialHashtag(e.target.value))}
          placeholder="tech"
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
        />
        <p className="text-xs text-[var(--muted)]">
          Mock social API loads posts for this hashtag (no Twitter key required).
        </p>
      </fieldset>
    </motion.section>
  );
}
