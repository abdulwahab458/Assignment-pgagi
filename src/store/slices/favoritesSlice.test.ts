import { describe, expect, it } from "vitest";
import favoritesReducer, { toggleFavorite } from "./favoritesSlice";
import type { ContentItem } from "@/types/content";

const sample: ContentItem = {
  id: "a1",
  source: "news",
  title: "Sample",
  description: "Desc",
};

describe("favoritesSlice", () => {
  it("adds and removes favorites", () => {
    let state = favoritesReducer(undefined, { type: "init" });
    state = favoritesReducer(state, toggleFavorite(sample));
    expect(state.items).toHaveLength(1);
    state = favoritesReducer(state, toggleFavorite(sample));
    expect(state.items).toHaveLength(0);
  });
});
