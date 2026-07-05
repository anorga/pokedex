/** The compare-page team, persisted so it survives navigation and reloads. */

export const MAX_TEAM_SLOTS = 6;

const STORAGE_KEY = "pokedex:team";

export function loadTeam(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed
          .filter((id): id is number => typeof id === "number" && id > 0)
          .slice(0, MAX_TEAM_SLOTS)
      : [];
  } catch {
    return [];
  }
}

export function saveTeam(ids: number[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}
