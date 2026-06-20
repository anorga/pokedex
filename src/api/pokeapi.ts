import type {
  DamageRelations,
  EvolutionChainResponse,
  EvolutionStage,
  NamedApiResource,
  Pokemon,
  PokemonListResponse,
  SpeciesResponse,
  TypeResponse,
} from "../types/pokemon";

const BASE_URL = "https://pokeapi.co/api/v2";

export const PAGE_SIZE = 20;

/** A page of resolved Pokemon plus the total available, for pagination. */
export interface PokemonPage {
  items: Pokemon[];
  totalCount: number;
}

/** Official artwork sprite URL for a given Pokemon id. */
export function artworkUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

/** Shiny official artwork sprite URL for a given Pokemon id. */
export function shinyArtworkUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${id}.png`;
}

/** Parse the numeric id out of a PokeAPI resource url. */
function idFromUrl(url: string): number {
  const match = url.match(/\/(\d+)\/?$/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`Request failed (${res.status}): ${url}`);
  }
  return res.json() as Promise<T>;
}

/**
 * Resolve a set of list entries to full detail records. Uses allSettled so a
 * single flaky request can't blank an entire page, and sorts by id.
 */
async function resolveDetails(
  entries: NamedApiResource[],
  signal?: AbortSignal,
): Promise<Pokemon[]> {
  const settled = await Promise.allSettled(
    entries.map((entry) => getJson<Pokemon>(entry.url, signal)),
  );
  return settled
    .filter(
      (r): r is PromiseFulfilledResult<Pokemon> => r.status === "fulfilled",
    )
    .map((r) => r.value)
    .sort((a, b) => a.id - b.id);
}

/** Parse the numeric id out of a PokeAPI resource url. */
export function pokemonId(entry: NamedApiResource): number {
  return idFromUrl(entry.url);
}

/** Resolve details for one client-paginated page of an entry list. */
export async function fetchEntriesPage(
  entries: NamedApiResource[],
  page: number,
  signal?: AbortSignal,
): Promise<PokemonPage> {
  const start = (page - 1) * PAGE_SIZE;
  const slice = entries.slice(start, start + PAGE_SIZE);
  const items = await resolveDetails(slice, signal);
  return { items, totalCount: entries.length };
}

/** Fetch the lightweight name+url index used to power browsing and search. */
export async function fetchPokemonIndex(
  signal?: AbortSignal,
): Promise<NamedApiResource[]> {
  const data = await getJson<PokemonListResponse>(
    `${BASE_URL}/pokemon?limit=100000`,
    signal,
  );
  return data.results;
}

/** Resolve full detail records for index entries matching a search term. */
export async function searchPokemon(
  index: NamedApiResource[],
  term: string,
  signal?: AbortSignal,
  limit = PAGE_SIZE,
): Promise<Pokemon[]> {
  const needle = term.trim().toLowerCase();
  if (!needle) return [];

  const matches = index
    .filter((entry) => entry.name.toLowerCase().includes(needle))
    .slice(0, limit);

  return resolveDetails(matches, signal);
}

/** The sorted list of Pokemon entries belonging to a given type. */
export async function fetchTypeEntries(
  type: string,
  signal?: AbortSignal,
): Promise<NamedApiResource[]> {
  const data = await getJson<TypeResponse>(`${BASE_URL}/type/${type}`, signal);
  return data.pokemon
    .map((p) => p.pokemon)
    .sort((a, b) => idFromUrl(a.url) - idFromUrl(b.url));
}

/** Fetch a single Pokemon by numeric id or name. */
export async function fetchPokemon(
  idOrName: string | number,
  signal?: AbortSignal,
): Promise<Pokemon> {
  return getJson<Pokemon>(`${BASE_URL}/pokemon/${idOrName}`, signal);
}

/** Fetch species-level data (flavor text, genus, gender, evolution link). */
export async function fetchSpecies(
  idOrName: string | number,
  signal?: AbortSignal,
): Promise<SpeciesResponse> {
  return getJson<SpeciesResponse>(
    `${BASE_URL}/pokemon-species/${idOrName}`,
    signal,
  );
}

/** Fetch and flatten an evolution chain into an ordered list of stages. */
export async function fetchEvolutionStages(
  url: string,
  signal?: AbortSignal,
): Promise<EvolutionStage[]> {
  const data = await getJson<EvolutionChainResponse>(url, signal);
  const stages: EvolutionStage[] = [];
  const walk = (link: EvolutionChainResponse["chain"]) => {
    stages.push({ id: idFromUrl(link.species.url), name: link.species.name });
    link.evolves_to.forEach(walk);
  };
  walk(data.chain);
  return stages;
}

/** Combined type-effectiveness multipliers a Pokemon takes, keyed by attacker. */
export async function fetchTypeEffectiveness(
  types: string[],
  signal?: AbortSignal,
): Promise<Record<string, number>> {
  const relations = await Promise.all(
    types.map((t) =>
      getJson<TypeResponse>(`${BASE_URL}/type/${t}`, signal).then(
        (r) => r.damage_relations,
      ),
    ),
  );

  const multipliers: Record<string, number> = {};
  const apply = (rel: DamageRelations) => {
    for (const t of rel.double_damage_from)
      multipliers[t.name] = (multipliers[t.name] ?? 1) * 2;
    for (const t of rel.half_damage_from)
      multipliers[t.name] = (multipliers[t.name] ?? 1) * 0.5;
    for (const t of rel.no_damage_from)
      multipliers[t.name] = (multipliers[t.name] ?? 1) * 0;
  };
  relations.forEach(apply);
  return multipliers;
}
