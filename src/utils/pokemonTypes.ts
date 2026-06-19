/** Canonical Pokémon type colors, used for badges and accent gradients. */
export const TYPE_COLORS: Record<string, string> = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

const FALLBACK_COLOR = "#777777";

export function typeColor(type: string): string {
  return TYPE_COLORS[type] ?? FALLBACK_COLOR;
}

/** A soft accent gradient derived from a Pokémon's primary type. */
export function typeGradient(type: string): string {
  const color = typeColor(type);
  return `linear-gradient(140deg, ${color}33 0%, ${color}14 60%, transparent 100%)`;
}
