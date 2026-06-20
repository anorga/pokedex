/** Minimal slices of the PokeAPI response shapes this app consumes. */

export interface NamedApiResource {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedApiResource[];
}

export interface PokemonType {
  slot: number;
  type: NamedApiResource;
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: NamedApiResource;
}

export interface PokemonAbility {
  ability: NamedApiResource;
  is_hidden: boolean;
  slot: number;
}

export interface DamageRelations {
  double_damage_from: NamedApiResource[];
  half_damage_from: NamedApiResource[];
  no_damage_from: NamedApiResource[];
}

export interface TypeResponse {
  pokemon: { pokemon: NamedApiResource; slot: number }[];
  damage_relations: DamageRelations;
}

export interface SpeciesResponse {
  flavor_text_entries: {
    flavor_text: string;
    language: NamedApiResource;
    version: NamedApiResource;
  }[];
  genera: { genus: string; language: NamedApiResource }[];
  gender_rate: number;
  evolution_chain: { url: string };
}

export interface ChainLink {
  species: NamedApiResource;
  evolves_to: ChainLink[];
}

export interface EvolutionChainResponse {
  chain: ChainLink;
}

/** A single resolved evolution stage. */
export interface EvolutionStage {
  id: number;
  name: string;
}

export interface Pokemon {
  id: number;
  name: string;
  /** Decimetres (PokeAPI unit). */
  height: number;
  /** Hectograms (PokeAPI unit). */
  weight: number;
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
}
