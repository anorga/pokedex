import { GENERATIONS } from "../utils/generations";
import { SORT_OPTIONS, type SortKey } from "../utils/sort";

interface ControlsProps {
  generation: string | null;
  sort: SortKey;
  onGenerationChange: (gen: string | null) => void;
  onSortChange: (sort: SortKey) => void;
}

const selectClass =
  "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-slate-700";

function Controls({
  generation,
  sort,
  onGenerationChange,
  onSortChange,
}: ControlsProps) {
  return (
    <div className="mx-auto mt-4 flex max-w-3xl flex-wrap items-center justify-center gap-3 px-4">
      <label className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <span className="sr-only sm:not-sr-only">Generation</span>
        <select
          className={selectClass}
          value={generation ?? ""}
          onChange={(e) => onGenerationChange(e.target.value || null)}
        >
          <option value="">All Generations</option>
          {GENERATIONS.map((g) => (
            <option key={g.id} value={g.id}>
              {g.label} · {g.region}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <span className="sr-only sm:not-sr-only">Sort</span>
        <select
          className={selectClass}
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortKey)}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default Controls;
