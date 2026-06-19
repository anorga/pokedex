/** Capitalize the first letter of a Pokemon name. */
export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** Turn an api slug like "special-attack" into "Special Attack". */
export function titleCase(value: string): string {
  return value.split(/[-\s]/).map(capitalize).join(" ");
}

/** Zero-padded national dex number, e.g. 25 -> "#0025". */
export function formatDexId(id: number): string {
  return `#${id.toString().padStart(4, "0")}`;
}

/** Short display labels for the six base stats. */
export const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "Sp. ATK",
  "special-defense": "Sp. DEF",
  speed: "SPD",
};

export function statLabel(name: string): string {
  return STAT_LABELS[name] ?? titleCase(name);
}

/** Decimetres -> metres string. */
export function formatHeight(decimetres: number): string {
  return `${(decimetres / 10).toFixed(1)} m`;
}

/** Hectograms -> kilograms string. */
export function formatWeight(hectograms: number): string {
  return `${(hectograms / 10).toFixed(1)} kg`;
}
