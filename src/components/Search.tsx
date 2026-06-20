import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";

interface SearchProps {
  filter: string;
  isSearching: boolean;
  onFilterChange: (value: string) => void;
  onClear: () => void;
}

function Search({ filter, isSearching, onFilterChange, onClear }: SearchProps) {
  return (
    <header className="px-4 pb-2 pt-8 text-center sm:pt-10">
      <h1 className="font-display text-5xl tracking-wide text-slate-800 sm:text-6xl dark:text-slate-50">
        Pokédex
      </h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">
        Search and explore every Pokémon
      </p>

      <form
        onSubmit={(e) => e.preventDefault()}
        role="search"
        className="mx-auto mt-6 flex max-w-md items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 shadow-sm transition focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:focus-within:ring-slate-700"
      >
        <MagnifyingGlassIcon className="h-5 w-5 shrink-0 text-slate-400" />
        <input
          className="w-full bg-transparent text-base text-slate-800 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
          placeholder="Search by name…"
          type="text"
          aria-label="Search Pokémon by name"
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
        />
        {isSearching && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search"
            className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}
      </form>
    </header>
  );
}

export default Search;
