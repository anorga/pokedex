import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

function Pagination({ toPrevPage, toNextPage }) {
  return (
    <>
      <div className="bg-black flex justify-center py-4">
        {/* Removed bottom buttons */}
        <button
          type="button"
          className="relative inline-flex items-center rounded-2xl border border-gray-300 bg-slate-200 px-4 py-4 mx-5 text-sm font-medium text-gray-900 hover:bg-slate-300 focus:z-10 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          onClick={toPrevPage}
       >
          <span className="sr-only">Previous</span>
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="relative -ml-px inline-flex items-center rounded-2xl border border-gray-300 bg-slate-200 px-4 py-4  mx-5 text-sm font-medium text-gray-900 hover:bg-slate-300 focus:z-10 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
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
