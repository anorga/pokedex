import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

function Search({ toNextPage, toPrevPage, handleSearchChange, currentPage }) {
  return (
    <div className="bg-white flex justify-center py-5">
      {/* Left Button */}
      <button
        type="button"
        className={`rounded-2xl border border-gray-400 px-4 py-4 mx-5 text-sm font-medium text-gray-900 focus:z-10 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 ${
          currentPage === 1
            ? "bg-slate-600 cursor-not-allowed"
            : "bg-slate-400 hover:bg-slate-300"
        }`}
        onClick={toPrevPage}
        disabled={currentPage === 1}
      >
        <span className="sr-only">Previous</span>
        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
      </button>
      {/* Search Bar */}
      <form className="my-auto">
        <div className="relative">
          <input
            className="focus:ring-slate-500 h-12 md:h-14 w-48 md:w-80 rounded-lg bg-slate-400 border-gray-200 focus:border-slate-500 focus:outline-slate-500 focus:ring-1 pr-8 pl-3 text-xl placeholder-black focus:z-10"
            placeholder="Search"
            type="text"
            onChange={handleSearchChange}
          />

          <button
            type="submit"
            className="absolute inset-y-0 right-0 mr-px rounded-r-lg p-2 text-black"
          >
            <span className="sr-only">Submit Search</span>
            <svg
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                fillRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      </form>
      {/* Right Button */}
      <button
        type="button"
        className="rounded-2xl border border-gray-400 bg-slate-400 px-4 py-4  mx-5 text-sm font-medium text-gray-900 hover:bg-slate-300 focus:z-10 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        onClick={toNextPage}
      >
        <span className="sr-only">Next</span>
        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
}

export default Search;
