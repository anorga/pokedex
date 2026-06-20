import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Controls from "./Controls.tsx";
import Pagination from "./Pagination.tsx";
import PokemonCard from "./PokemonCard.tsx";
import Search from "./Search.tsx";
import TypeFilter from "./TypeFilter.tsx";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import {
  usePagedPokemon,
  usePokemonIndex,
  usePokemonSearch,
  useTypeEntries,
} from "../hooks/usePokemon";
import { fetchEntriesPage, PAGE_SIZE } from "../api/pokeapi";
import { capitalize } from "../utils/format";
import { filterByGeneration, generationById } from "../utils/generations";
import { isSortKey, sortEntries, type SortKey } from "../utils/sort";

function Pokedex() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL is the source of truth so views are shareable and restored on return.
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const selectedType = searchParams.get("type");
  const selectedGen = searchParams.get("gen");
  const sortParam = searchParams.get("sort");
  const sort: SortKey = isSortKey(sortParam) ? sortParam : "id-asc";
  const urlQuery = searchParams.get("q") ?? "";

  const [filter, setFilter] = useState(urlQuery);
  const debouncedFilter = useDebouncedValue(filter, 500);
  const isSearching = debouncedFilter.trim().length > 0;

  const patchParams = useCallback(
    (patch: Record<string, string | number | null>) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const [key, value] of Object.entries(patch)) {
            if (value === null || value === "" || value === 1) {
              next.delete(key);
            } else {
              next.set(key, String(value));
            }
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  // Sync the debounced search term into the URL (resetting the page).
  useEffect(() => {
    const term = debouncedFilter.trim();
    if (term === urlQuery) return;
    patchParams({ q: term || null, page: 1 });
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
  const pagedQuery = usePagedPokemon(entries, page, keySuffix, listReady);

  const view = isSearching
    ? {
        items: searchQuery.data ?? [],
        isPending: searchQuery.isPending,
        isError: searchQuery.isError,
        totalCount: searchQuery.data?.length ?? 0,
        paginated: false,
      }
    : {
        items: pagedQuery.data?.items ?? [],
        isPending: !listReady || pagedQuery.isPending,
        isError: typeEntries.isError || pagedQuery.isError,
        totalCount: pagedQuery.data?.totalCount ?? entries.length,
        paginated: true,
      };

  const totalPages = Math.max(1, Math.ceil(view.totalCount / PAGE_SIZE));

  // Seed the per-Pokémon detail cache so opening a card is instant.
  useEffect(() => {
    for (const p of view.items) {
      queryClient.setQueryData(["pokemon", "detail", String(p.id)], p);
    }
  }, [view.items, queryClient]);

  const resetForFilter = (patch: Record<string, string | number | null>) => {
    setFilter("");
    patchParams({ q: null, page: 1, ...patch });
  };

  const handleSelectType = (type: string | null) => resetForFilter({ type });
  const handleSelectGen = (gen: string | null) => resetForFilter({ gen });
  const handleSort = (next: SortKey) => patchParams({ sort: next, page: 1 });

  const toNextPage = () =>
    patchParams({ page: Math.min(totalPages, page + 1) });
  const toPrevPage = () => patchParams({ page: Math.max(1, page - 1) });

  // Warm the next page's detail records so paging feels instant.
  const prefetchNextPage = useCallback(() => {
    if (isSearching || page >= totalPages) return;
    const next = page + 1;
    queryClient.prefetchQuery({
      queryKey: ["paged", keySuffix, next],
      queryFn: ({ signal }) => fetchEntriesPage(entries, next, signal),
    });
  }, [isSearching, page, totalPages, keySuffix, entries, queryClient]);

  const term = debouncedFilter.trim();
  const genLabel = generationById(selectedGen)?.label;
  let statusLine: string | null = null;
  if (!view.isPending && !view.isError) {
    if (isSearching) {
      statusLine =
        view.items.length === 0
          ? `No results for "${term}"`
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
      <PokemonCard
        pokemon={view.items}
        isLoading={view.isPending}
        isError={view.isError}
      />
      {view.paginated && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPrev={toPrevPage}
          onNext={toNextPage}
          onNextHover={prefetchNextPage}
        />
      )}
    </>
  );
}

export default Pokedex;
