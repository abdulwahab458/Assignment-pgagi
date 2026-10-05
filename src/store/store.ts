import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import preferencesReducer from "./slices/preferencesSlice";
import favoritesReducer from "./slices/favoritesSlice";
import uiReducer from "./slices/uiSlice";
import { contentApi } from "./api/contentApi";

const persistConfig = {
  key: "dashboard-root",
  storage,
  whitelist: ["preferences", "favorites", "ui"],
};

const rootReducer = combineReducers({
  preferences: preferencesReducer,
  favorites: favoritesReducer,
  ui: uiReducer,
  [contentApi.reducerPath]: contentApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export function makeStore() {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(contentApi.middleware),
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
