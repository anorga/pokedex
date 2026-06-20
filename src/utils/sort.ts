import type { NamedApiResource } from "../types/pokemon";
import { pokemonId } from "../api/pokeapi";

export type SortKey = "id-asc" | "id-desc" | "name-asc" | "name-desc";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "id-asc", label: "Number ↑" },
  { value: "id-desc", label: "Number ↓" },
  { value: "name-asc", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
];

export function isSortKey(value: string | null): value is SortKey {
  return (
    value === "id-asc" ||
    value === "id-desc" ||
    value === "name-asc" ||
    value === "name-desc"
  );
}

/** Returns a new array of entries sorted by the given key. */
export function sortEntries(
  entries: NamedApiResource[],
  key: SortKey,
): NamedApiResource[] {
  const sorted = [...entries];
  switch (key) {
    case "id-desc":
      return sorted.sort((a, b) => pokemonId(b) - pokemonId(a));
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case "id-asc":
    default:
      return sorted.sort((a, b) => pokemonId(a) - pokemonId(b));
  }
}
