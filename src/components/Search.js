function Search(toNextPage, toPrevPage) {
  return (
    <div className="bg-slate-400">
      <form className="flex justify-center py-5">
        <div className="relative">
          <input
            className="search focus:ring-slate-500 h-10 w-96 rounded-lg border-gray-200 focus:border-slate-500 focus:outline-slate-500 focus:ring-1  pr-10 pl-3 text-sm placeholder-gray-500 focus:z-10 font-semibold"
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
    </div>
  );
}

export default Search;
