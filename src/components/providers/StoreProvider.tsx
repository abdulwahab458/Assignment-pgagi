"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { makeStore, type AppStore } from "@/store/store";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  const persistorRef = useRef<ReturnType<typeof persistStore> | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
    persistorRef.current = persistStore(storeRef.current);
  }

  return (
    <Provider store={storeRef.current}>
      <PersistGate
        loading={
          <div className="flex min-h-screen items-center justify-center text-sm text-[var(--muted)]">
            Loading dashboard…
          </div>
        }
        persistor={persistorRef.current!}
      >
        {children}
      </PersistGate>
    </Provider>
  );
}
