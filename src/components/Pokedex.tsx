import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Pagination from "./Pagination.tsx";
import PokemonCard from "./PokemonCard.tsx";
import Search from "./Search.tsx";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import {
  usePokemonIndex,
  usePokemonPage,
  usePokemonSearch,
} from "../hooks/usePokemon";
import { fetchPokemonPage } from "../api/pokeapi";

function Pokedex() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");

  const debouncedFilter = useDebouncedValue(filter, 500);
  const isSearching = debouncedFilter.trim().length > 0;

  const { data: index } = usePokemonIndex();
  const pageQuery = usePokemonPage(page);
  const searchQuery = usePokemonSearch(debouncedFilter, index);

  const active = isSearching ? searchQuery : pageQuery;

  const toNextPage = () => setPage((p) => p + 1);
  const toPrevPage = () => setPage((p) => Math.max(1, p - 1));
  const clearSearch = () => setFilter("");

  // Warm the cache for the next page so navigation feels instant.
  const prefetchNextPage = useCallback(() => {
    const next = page + 1;
    queryClient.prefetchQuery({
      queryKey: ["pokemon", "page", next],
      queryFn: ({ signal }) => fetchPokemonPage(next, signal),
    });
  }, [page, queryClient]);

  return (
    <>
      <Search
        filter={filter}
        isSearching={isSearching}
        onFilterChange={setFilter}
        onClear={clearSearch}
      />
      {isSearching && !active.isPending && !active.isError && (
        <p className="px-4 pb-1 pt-2 text-center text-sm text-slate-500 dark:text-slate-400">
          {active.data?.length === 0
            ? `No results for "${debouncedFilter.trim()}"`
            : `${active.data?.length} result${
                active.data?.length === 1 ? "" : "s"
              } for "${debouncedFilter.trim()}"`}
        </p>
      )}
      <PokemonCard
        pokemon={active.data ?? []}
        isLoading={active.isPending}
        isError={active.isError}
      />
      {!isSearching && (
        <Pagination
          page={page}
          onPrev={toPrevPage}
          onNext={toNextPage}
          onNextHover={prefetchNextPage}
        />
      )}
    </>
  );
}

export default Pokedex;
