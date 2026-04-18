"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="
        flex items-center justify-center w-9 h-9 rounded-xl
        text-forest/60 dark:text-parchment/60
        hover:text-forest dark:hover:text-parchment
        hover:bg-moss-50 dark:hover:bg-charcoal-800
        border border-transparent hover:border-moss-200 dark:hover:border-charcoal-700
        transition-all duration-150
      "
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  );
}
