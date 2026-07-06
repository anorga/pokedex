import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Controls from "./Controls.tsx";
import InfinitePokemonGrid from "./InfinitePokemonGrid.tsx";
import PokemonCard from "./PokemonCard.tsx";
import Search from "./Search.tsx";
import TypeFilter from "./TypeFilter.tsx";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import {
  useInfinitePokemon,
  usePokemonIndex,
  usePokemonSearch,
  useTypeEntries,
} from "../hooks/usePokemon";
import { matchEntries } from "../api/pokeapi";
import { capitalize } from "../utils/format";
import { filterByGeneration, generationById } from "../utils/generations";
import { isSortKey, sortEntries, type SortKey } from "../utils/sort";

function Pokedex() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL is the source of truth so views are shareable and restored on return.
  const selectedType = searchParams.get("type");
  const selectedGen = searchParams.get("gen");
  const sortParam = searchParams.get("sort");
  const sort: SortKey = isSortKey(sortParam) ? sortParam : "id-asc";
  const urlQuery = searchParams.get("q") ?? "";

  const [filter, setFilter] = useState(urlQuery);
  const debouncedFilter = useDebouncedValue(filter, 500);
  const isSearching = debouncedFilter.trim().length > 0;

  const patchParams = useCallback(
    (patch: Record<string, string | null>) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const [key, value] of Object.entries(patch)) {
            if (value === null || value === "") {
              next.delete(key);
            } else {
              next.set(key, value);
            }
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  // Sync the debounced search term into the URL.
  useEffect(() => {
    const term = debouncedFilter.trim();
    if (term === urlQuery) return;
    patchParams({ q: term || null });
  }, [debouncedFilter, urlQuery, patchParams]);

  const { data: index } = usePokemonIndex();
  const searchQuery = usePokemonSearch(debouncedFilter, index);
  const typeEntries = useTypeEntries(selectedType);

  // The base entry list (everything, or a single type), then filtered + sorted.
  const base = selectedType ? typeEntries.data : index;
  const entries = useMemo(
    () =>
      base ? sortEntries(filterByGeneration(base, selectedGen), sort) : [],
    [base, selectedGen, sort],
  );
  const listReady = !!base;
  const keySuffix = `${selectedType ?? "all"}|${selectedGen ?? "all"}|${sort}`;
  const infinite = useInfinitePokemon(entries, keySuffix, listReady);
  const browseItems = useMemo(
    () => infinite.data?.pages.flatMap((p) => p.items) ?? [],
    [infinite.data],
  );

  const view = isSearching
    ? {
        items: searchQuery.data ?? [],
        isPending: searchQuery.isPending,
        isError: searchQuery.isError,
        totalCount: searchQuery.data?.length ?? 0,
      }
    : {
        items: browseItems,
        isPending: !listReady || infinite.isPending,
        isError: typeEntries.isError || infinite.isError,
        totalCount: infinite.data?.pages[0]?.totalCount ?? entries.length,
      };

  // Seed the per-Pokémon detail cache so opening a card is instant.
  useEffect(() => {
    for (const p of view.items) {
      queryClient.setQueryData(["pokemon", "detail", String(p.id)], p);
    }
  }, [view.items, queryClient]);

  const resetForFilter = (patch: Record<string, string | null>) => {
    setFilter("");
    patchParams({ q: null, ...patch });
    // Filter changes swap the whole list out; start it from the top.
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleSelectType = (type: string | null) => resetForFilter({ type });
  const handleSelectGen = (gen: string | null) => resetForFilter({ gen });
  const handleSort = (next: SortKey) => {
    patchParams({ sort: next });
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const term = debouncedFilter.trim();

  // Total index matches for the search term; results are capped at PAGE_SIZE,
  // so the status line should say "first 20 of N" rather than lie about N.
  const totalMatches = useMemo(
    () => (isSearching && index ? matchEntries(index, term).length : 0),
    [isSearching, index, term],
  );

  const genLabel = generationById(selectedGen)?.label;
  let statusLine: string | null = null;
  if (!view.isPending && !view.isError) {
    if (isSearching) {
      statusLine =
        view.items.length === 0
          ? `No results for "${term}"`
          : totalMatches > view.items.length
            ? `Showing first ${view.items.length} of ${totalMatches} matches for "${term}"`
            : `${view.items.length} result${view.items.length === 1 ? "" : "s"} for "${term}"`;
    } else if (selectedType || selectedGen) {
      const parts = [
        selectedType ? `${capitalize(selectedType)}-type` : null,
        genLabel,
      ].filter(Boolean);
      statusLine = `${view.totalCount} ${parts.join(" · ")} Pokémon`;
    }
  }

  return (
    <>
      <Search
        filter={filter}
        isSearching={isSearching}
        onFilterChange={setFilter}
        onClear={() => setFilter("")}
      />
      <Controls
        generation={selectedGen}
        sort={sort}
        onGenerationChange={handleSelectGen}
        onSortChange={handleSort}
      />
      <TypeFilter selected={selectedType} onSelect={handleSelectType} />
      {statusLine && (
        <p className="px-4 pb-1 pt-4 text-center text-sm text-slate-500 dark:text-slate-400">
          {statusLine}
        </p>
      )}
      {isSearching ? (
        <PokemonCard
          pokemon={view.items}
          isLoading={view.isPending}
          isError={view.isError}
        />
      ) : (
        <InfinitePokemonGrid
          items={browseItems}
          isLoading={view.isPending}
          isError={view.isError}
          hasNextPage={!!infinite.hasNextPage}
          isFetchingNextPage={infinite.isFetchingNextPage}
          fetchNextPage={() => void infinite.fetchNextPage()}
        />
      )}
    </>
  );
}

export default Pokedex;
