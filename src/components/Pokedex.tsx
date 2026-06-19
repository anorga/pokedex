import { useState } from "react";
import Pagination from "./Pagination.tsx";
import PokemonCard from "./PokemonCard.tsx";
import Search from "./Search.tsx";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import {
  usePokemonIndex,
  usePokemonPage,
  usePokemonSearch,
} from "../hooks/usePokemon";

function Pokedex() {
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

  return (
    <>
      <Search
        filter={filter}
        page={page}
        isSearching={isSearching}
        onFilterChange={setFilter}
        onClear={clearSearch}
        onPrev={toPrevPage}
        onNext={toNextPage}
      />
      <PokemonCard
        pokemon={active.data ?? []}
        isLoading={active.isPending}
        isError={active.isError}
      />
      {!isSearching && <Pagination />}
    </>
  );
}

export default Pokedex;
