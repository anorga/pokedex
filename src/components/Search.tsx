import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import type { FormEvent } from "react";
import magnify from "../assets/magnifying_glass.png";

interface SearchProps {
  filter: string;
  page: number;
  isSearching: boolean;
  onFilterChange: (value: string) => void;
  onClear: () => void;
  onPrev: () => void;
  onNext: () => void;
}

function Search({
  filter,
  page,
  isSearching,
  onFilterChange,
  onClear,
  onPrev,
  onNext,
}: SearchProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const prevDisabled = page === 1 || isSearching;

  return (
    <div className="bg-white flex justify-center py-5">
      {/* Left Button */}
      <button
        type="button"
        className={`px-4 py-4 mx-5 md:mx-20 ${
          prevDisabled ? "cursor-not-allowed" : "bg-white"
        }`}
        onClick={onPrev}
        disabled={prevDisabled}
      >
        <span className="sr-only">Previous</span>
        <ChevronLeftIcon className="h-12 w-12" aria-hidden="true" />
      </button>
      {/* Search Bar */}
      <form onSubmit={handleSubmit} className="my-auto relative">
        <div className="relative flex items-center">
          <input
            className="h-12 md:h-14 w-48 text-3xl placeholder-black focus:outline-none text-center pr-10 placeholder-shown:text-center focus:placeholder-opacity-0"
            placeholder="Search"
            type="text"
            value={filter}
            onChange={(e) => onFilterChange(e.target.value)}
          />
          {/* Search Icon */}
          <button
            type="submit"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            <span className="sr-only">Submit Search</span>
            <img src={magnify} alt="Search" className="w-8 h-8" />
          </button>
        </div>
        {isSearching && (
          <button
            type="button"
            onClick={onClear}
            className="absolute -bottom-6 left-0 right-0 text-sm text-center underline"
          >
            Clear search
          </button>
        )}
      </form>
      {/* Right Button */}
      <button
        type="button"
        className={`px-4 py-4 mx-5 md:mx-20 ${
          isSearching ? "cursor-not-allowed" : "bg-white"
        }`}
        onClick={onNext}
        disabled={isSearching}
      >
        <span className="sr-only">Next</span>
        <ChevronRightIcon className="h-12 w-12" aria-hidden="true" />
      </button>
    </div>
  );
}

export default Search;
