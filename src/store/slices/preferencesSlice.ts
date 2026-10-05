import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  CONTENT_CATEGORIES,
  type ContentCategory,
} from "@/types/content";

export interface PreferencesState {
  categories: ContentCategory[];
  userName: string;
}

const defaultCategories: ContentCategory[] = ["technology", "entertainment"];

const initialState: PreferencesState = {
  categories: defaultCategories,
  userName: "Guest User",
};

const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    toggleCategory(state, action: PayloadAction<ContentCategory>) {
      const cat = action.payload;
      if (state.categories.includes(cat)) {
        state.categories = state.categories.filter((c) => c !== cat);
      } else {
        state.categories = [...state.categories, cat];
      }
      if (state.categories.length === 0) {
        state.categories = [cat];
      }
    },
    setCategories(state, action: PayloadAction<ContentCategory[]>) {
      const valid = action.payload.filter((c) =>
        CONTENT_CATEGORIES.includes(c),
      );
      state.categories = valid.length > 0 ? valid : defaultCategories;
    },
    setUserName(state, action: PayloadAction<string>) {
      state.userName = action.payload.trim() || "Guest User";
    },
  },
});

export const {
  toggleCategory,
  setCategories,
  setUserName,
} = preferencesSlice.actions;
export default preferencesSlice.reducer;
