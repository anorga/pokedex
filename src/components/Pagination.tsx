import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

interface PaginationProps {
  page: number;
  onPrev: () => void;
  onNext: () => void;
  onNextHover?: () => void;
}

function Pagination({ page, onPrev, onNext, onNextHover }: PaginationProps) {
  const btn =
    "inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700";

  return (
    <div className="flex items-center justify-center gap-4 py-10">
      <button
        type="button"
        className={btn}
        onClick={onPrev}
        disabled={page === 1}
      >
        <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
        Prev
      </button>
      <span className="min-w-[5rem] text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
        Page {page}
      </span>
      <button
        type="button"
        className={btn}
        onClick={onNext}
        onMouseEnter={onNextHover}
        onFocus={onNextHover}
      >
        Next
        <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export default Pagination;
