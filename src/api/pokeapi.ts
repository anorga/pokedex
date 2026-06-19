import type {
  NamedApiResource,
  Pokemon,
  PokemonListResponse,
} from "../types/pokemon";

const BASE_URL = "https://pokeapi.co/api/v2";

export const PAGE_SIZE = 20;

/** Official artwork sprite URL for a given Pokemon id. */
export function artworkUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`Request failed (${res.status}): ${url}`);
  }
  return res.json() as Promise<T>;
}

/** Fetch one page of Pokemon, resolving each entry to its full detail record. */
export async function fetchPokemonPage(
  page: number,
  signal?: AbortSignal,
): Promise<Pokemon[]> {
  const offset = (page - 1) * PAGE_SIZE;
  const list = await getJson<PokemonListResponse>(
    `${BASE_URL}/pokemon/?offset=${offset}&limit=${PAGE_SIZE}`,
    signal,
  );
  const details = await Promise.all(
    list.results.map((entry) => getJson<Pokemon>(entry.url, signal)),
  );
  return details.sort((a, b) => a.id - b.id);
}

/** Fetch the lightweight name+url index used to power client-side search. */
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

  const details = await Promise.all(
    matches.map((entry) => getJson<Pokemon>(entry.url, signal)),
  );
  return details.sort((a, b) => a.id - b.id);
}

/** Fetch a single Pokemon by numeric id or name. */
export async function fetchPokemon(
  idOrName: string | number,
  signal?: AbortSignal,
): Promise<Pokemon> {
  return getJson<Pokemon>(`${BASE_URL}/pokemon/${idOrName}`, signal);
}
