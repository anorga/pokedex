import { useQueries, useQuery } from "@tanstack/react-query";
import {
  fetchEntriesPage,
  fetchEvolutionStages,
  fetchPokemon,
  fetchPokemonIndex,
  fetchSpecies,
  fetchTypeEffectiveness,
  fetchTypeEntries,
  searchPokemon,
} from "../api/pokeapi";
import type { NamedApiResource, Pokemon } from "../types/pokemon";

/** The lightweight name index, fetched once and cached for the session. */
export function usePokemonIndex() {
  return useQuery({
    queryKey: ["pokemon", "index"],
    queryFn: ({ signal }) => fetchPokemonIndex(signal),
  });
}

/** One client-paginated page of a (filtered, sorted) entry list. */
export function usePagedPokemon(
  entries: NamedApiResource[],
  page: number,
  keySuffix: string,
  ready: boolean,
) {
  return useQuery({
    queryKey: ["paged", keySuffix, page],
    queryFn: ({ signal }) => fetchEntriesPage(entries, page, signal),
    enabled: ready,
    placeholderData: (prev) => prev,
  });
}

/** Search results for a (debounced) term, gated on the index being ready. */
export function usePokemonSearch(term: string, index?: NamedApiResource[]) {
  const enabled = term.trim().length > 0 && !!index;
  return useQuery({
    queryKey: ["pokemon", "search", term.trim().toLowerCase()],
    queryFn: ({ signal }) => searchPokemon(index!, term, signal),
    enabled,
  });
}

/** The sorted entry list for a type (used to drive type-filtered paging). */
export function useTypeEntries(type: string | null) {
  return useQuery({
    queryKey: ["type", type],
    queryFn: ({ signal }) => fetchTypeEntries(type!, signal),
    enabled: !!type,
  });
}

/** A single Pokemon by id or name, for the detail route. */
export function usePokemonDetail(idOrName: string | undefined) {
  return useQuery<Pokemon>({
    queryKey: ["pokemon", "detail", idOrName],
    queryFn: ({ signal }) => fetchPokemon(idOrName!, signal),
    enabled: !!idOrName,
  });
}

/** Species data (flavor text, genus, gender, evolution link). */
export function useSpecies(idOrName: string | number | undefined) {
  return useQuery({
    queryKey: ["species", String(idOrName)],
    queryFn: ({ signal }) => fetchSpecies(idOrName!, signal),
    enabled: idOrName !== undefined,
  });
}

/** Ordered evolution stages for a given evolution-chain url. */
export function useEvolution(url: string | undefined) {
  return useQuery({
    queryKey: ["evolution", url],
    queryFn: ({ signal }) => fetchEvolutionStages(url!, signal),
    enabled: !!url,
  });
}

/** Combined damage multipliers this Pokemon takes, keyed by attacking type. */
export function useTypeEffectiveness(types: string[]) {
  const key = [...types].sort().join(",");
  return useQuery({
    queryKey: ["effectiveness", key],
    queryFn: ({ signal }) => fetchTypeEffectiveness(types, signal),
    enabled: types.length > 0,
  });
}

/** Resolve a list of ids into full Pokemon detail records. */
export function usePokemonByIds(ids: number[]) {
  const queries = useQueries({
    queries: ids.map((id) => ({
      queryKey: ["pokemon", "detail", String(id)],
      queryFn: ({ signal }: { signal: AbortSignal }) =>
        fetchPokemon(id, signal),
    })),
  });

  return {
    data: queries.map((q) => q.data),
    isPending: ids.length > 0 && queries.some((q) => q.isPending),
    isError: queries.some((q) => q.isError),
  };
}

/** Resolve favorite ids into full detail records, sorted by id. */
export function useFavoritePokemon(ids: number[]) {
  const { data, isPending, isError } = usePokemonByIds(ids);
  return {
    data: data
      .filter((p): p is Pokemon => p !== undefined)
      .sort((a, b) => a.id - b.id),
    isPending,
    isError,
  };
}
