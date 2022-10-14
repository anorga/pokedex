function Pagination({ prevPage, nextPage }) {
  return (
    <div className="ml-10 my-5">
      <button
        type="button"
        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-8 py-4 mr-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        onClick={prevPage}
      >
        Previous
      </button>
      <button
        type="button"
        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-12 py-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        onClick={nextPage}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
