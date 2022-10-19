import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

function Pagination({ toPrevPage, toNextPage }) {
  return (
    <>
      <div className="rounded-md shadow-sm bg-gray-700 flex justify-center py-6">
        <button
          type="button"
          className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-4 py-4 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          onClick={toPrevPage}
       >
          <span className="sr-only">Previous</span>
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="relative -ml-px inline-flex items-center rounded-r-md border border-gray-300 bg-white px-4 py-4 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          onClick={toNextPage}
        >
          <span className="sr-only">Next</span>
          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </>
  );
}

export default Pagination;
