"use client";

import { useEffect } from "react";
import { useAppSelector } from "@/store/hooks";

export function ThemeSync() {
  const darkMode = useAppSelector((s) => s.ui.darkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return null;
}
