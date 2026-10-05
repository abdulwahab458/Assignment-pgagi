import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ContentItem } from "@/types/content";

export interface FavoritesState {
  items: ContentItem[];
}

const initialState: FavoritesState = {
  items: [],
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite(state, action: PayloadAction<ContentItem>) {
      const idx = state.items.findIndex((i) => i.id === action.payload.id);
      if (idx >= 0) {
        state.items.splice(idx, 1);
      } else {
        state.items.unshift(action.payload);
      }
    },
    removeFavorite(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
  },
});

export const { toggleFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
