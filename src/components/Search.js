import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

function Search({ toNextPage, toPrevPage }) {
  return (
    <div className="bg-slate-400 flex justify-center py-5">
      {/* Left Button */}
      <button
        type="button"
        className="rounded-2xl border border-gray-300 bg-slate-200 px-4 py-4 mx-5 text-sm font-medium text-gray-900 hover:bg-slate-300 focus:z-10 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        onClick={toPrevPage}
      >
        <span className="sr-only">Previous</span>
        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
      </button>
      {/* Search Bar */}
      <form className="my-auto">
        <div className="relative">
          <input
            className="focus:ring-slate-500 h-10 w-96 rounded-lg border-gray-200 focus:border-slate-500 focus:outline-slate-500 focus:ring-1  pr-10 pl-3 text-sm placeholder-gray-500 focus:z-10 font-semibold"
            placeholder="Search by Pokemon name or number"
            type="text"
          />

          <button
            type="submit"
            className="absolute inset-y-0 right-0 mr-px rounded-r-lg p-2 text-gray-900"
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
        className="rounded-2xl border border-gray-300 bg-slate-200 px-4 py-4  mx-5 text-sm font-medium text-gray-900 hover:bg-slate-300 focus:z-10 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        onClick={toNextPage}
      >
        <span className="sr-only">Next</span>
        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
}

export default Search;
