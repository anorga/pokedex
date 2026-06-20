import type { NamedApiResource } from "../types/pokemon";
import { pokemonId } from "../api/pokeapi";

export interface Generation {
  id: string;
  label: string;
  region: string;
  range: [number, number];
}

/** National-dex id ranges per generation. */
export const GENERATIONS: Generation[] = [
  { id: "1", label: "Gen I", region: "Kanto", range: [1, 151] },
  { id: "2", label: "Gen II", region: "Johto", range: [152, 251] },
  { id: "3", label: "Gen III", region: "Hoenn", range: [252, 386] },
  { id: "4", label: "Gen IV", region: "Sinnoh", range: [387, 493] },
  { id: "5", label: "Gen V", region: "Unova", range: [494, 649] },
  { id: "6", label: "Gen VI", region: "Kalos", range: [650, 721] },
  { id: "7", label: "Gen VII", region: "Alola", range: [722, 809] },
  { id: "8", label: "Gen VIII", region: "Galar", range: [810, 905] },
  { id: "9", label: "Gen IX", region: "Paldea", range: [906, 1025] },
];

export function generationById(id: string | null): Generation | undefined {
  return GENERATIONS.find((g) => g.id === id);
}

/** Keep only entries whose national-dex id falls in the generation's range. */
export function filterByGeneration(
  entries: NamedApiResource[],
  generationId: string | null,
): NamedApiResource[] {
  const gen = generationById(generationId);
  if (!gen) return entries;
  const [min, max] = gen.range;
  return entries.filter((e) => {
    const id = pokemonId(e);
    return id >= min && id <= max;
  });
}
