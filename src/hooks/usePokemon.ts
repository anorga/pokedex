import { useQuery } from "@tanstack/react-query";
import {
  fetchPokemon,
  fetchPokemonIndex,
  fetchPokemonPage,
  searchPokemon,
} from "../api/pokeapi";
import type { NamedApiResource, Pokemon } from "../types/pokemon";

/** One page of fully-resolved Pokemon, cached per page. */
export function usePokemonPage(page: number) {
  return useQuery({
    queryKey: ["pokemon", "page", page],
    queryFn: ({ signal }) => fetchPokemonPage(page, signal),
    placeholderData: (prev) => prev,
  });
}

/** The lightweight name index, fetched once and cached for the session. */
export function usePokemonIndex() {
  return useQuery({
    queryKey: ["pokemon", "index"],
    queryFn: ({ signal }) => fetchPokemonIndex(signal),
    staleTime: Infinity,
    gcTime: Infinity,
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

/** A single Pokemon by id or name, for the detail route. */
export function usePokemonDetail(idOrName: string | undefined) {
  return useQuery<Pokemon>({
    queryKey: ["pokemon", "detail", idOrName],
    queryFn: ({ signal }) => fetchPokemon(idOrName!, signal),
    enabled: !!idOrName,
  });
}
