"use client";

import { AnimatePresence } from "framer-motion";
import { useAppSelector } from "@/store/hooks";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { FeedSection } from "@/components/sections/FeedSection";
import { TrendingSection } from "@/components/sections/TrendingSection";
import { FavoritesSection } from "@/components/sections/FavoritesSection";
import { SettingsPanel } from "@/components/sections/SettingsPanel";
import { ThemeSync } from "@/components/providers/ThemeSync";

export function DashboardShell() {
  const section = useAppSelector((s) => s.ui.activeSection);

  return (
    <>
      <ThemeSync />
      <div className="flex min-h-screen flex-col md:flex-row">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header />
          <main className="flex-1 p-4 md:p-6">
            <AnimatePresence mode="wait">
              {section === "feed" && <FeedSection />}
              {section === "trending" && <TrendingSection />}
              {section === "favorites" && <FavoritesSection />}
              {section === "settings" && <SettingsPanel />}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </>
  );
}
