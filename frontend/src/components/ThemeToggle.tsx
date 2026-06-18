"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "theme";

function getPreferredTheme(): "light" | "dark" {
  if (typeof window === "undefined") {
    return "light";
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: "light" | "dark") {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const preferred = getPreferredTheme();
    applyTheme(preferred);
    const timeoutId = window.setTimeout(() => setTheme(preferred), 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="rounded-lg border border-emerald-300 bg-white/70 px-3 py-2.5 text-base shadow-sm transition hover:bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-900/40 dark:hover:bg-emerald-800/60"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
