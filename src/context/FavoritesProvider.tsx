import { useCallback, useEffect, useMemo, useState } from "react";
import { FavoritesContext } from "./favorites-context";

const STORAGE_KEY = "pokedex:favorites";

function loadFavorites(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((id): id is number => typeof id === "number")
      : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<number[]>(loadFavorites);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback((id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  }, []);

  const value = useMemo(
    () => ({
      favorites,
      isFavorite: (id: number) => favorites.includes(id),
      toggleFavorite,
    }),
    [favorites, toggleFavorite],
  );

  return <FavoritesContext value={value}>{children}</FavoritesContext>;
}
