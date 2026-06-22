import { useLayoutEffect, useState } from "react";
import { flushSync } from "react-dom";

export type Theme = "light" | "dark";

const STORAGE_KEY = "pokedex:theme";

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** Theme state synced to <html class="dark"> and persisted to localStorage. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Layout effect so the class is applied synchronously inside the view
  // transition started by toggleTheme.
  useLayoutEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    const next = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

    if (document.startViewTransition) {
      document.startViewTransition(() => flushSync(next));
    } else {
      next();
    }
  };

  return { theme, toggleTheme };
}
