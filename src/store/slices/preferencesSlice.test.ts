import { describe, expect, it } from "vitest";
import preferencesReducer, {
  toggleCategory,
  setCategories,
} from "./preferencesSlice";

describe("preferencesSlice", () => {
  it("toggles categories and keeps at least one selected", () => {
    let state = preferencesReducer(undefined, { type: "init" });
    state = preferencesReducer(state, toggleCategory("sports"));
    expect(state.categories).toContain("sports");
    state.categories.forEach((c) => {
      state = preferencesReducer(state, toggleCategory(c));
    });
    expect(state.categories.length).toBeGreaterThanOrEqual(1);
  });

  it("falls back to defaults when setCategories is empty", () => {
    const state = preferencesReducer(undefined, setCategories([]));
    expect(state.categories).toEqual(["technology", "entertainment"]);
  });
});
