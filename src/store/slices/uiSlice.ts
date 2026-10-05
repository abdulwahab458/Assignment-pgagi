import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DashboardSection } from "@/types/content";

export interface UiState {
  darkMode: boolean;
  activeSection: DashboardSection;
  feedOrder: string[];
  searchQuery: string;
}

const initialState: UiState = {
  darkMode: false,
  activeSection: "feed",
  feedOrder: [],
  searchQuery: "",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setDarkMode(state, action: PayloadAction<boolean>) {
      state.darkMode = action.payload;
    },
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
    },
    setActiveSection(state, action: PayloadAction<DashboardSection>) {
      state.activeSection = action.payload;
    },
    setFeedOrder(state, action: PayloadAction<string[]>) {
      state.feedOrder = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
  },
});

export const {
  setDarkMode,
  toggleDarkMode,
  setActiveSection,
  setFeedOrder,
  setSearchQuery,
} = uiSlice.actions;
export default uiSlice.reducer;
