import { TYPE_COLORS, typeColor } from "../utils/pokemonTypes";
import { capitalize } from "../utils/format";

const TYPES = Object.keys(TYPE_COLORS);

interface TypeFilterProps {
  selected: string | null;
  onSelect: (type: string | null) => void;
}

function TypeFilter({ selected, onSelect }: TypeFilterProps) {
  return (
    <div className="mx-auto mt-5 flex max-w-3xl flex-wrap justify-center gap-2 px-4">
      <button
        type="button"
        onClick={() => onSelect(null)}
        aria-pressed={selected === null}
        className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition ${
          selected === null
            ? "border-slate-800 bg-slate-800 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
            : "border-slate-300 text-slate-600 hover:border-slate-400 dark:border-slate-600 dark:text-slate-300"
        }`}
      >
        All
      </button>
      {TYPES.map((type) => {
        const active = selected === type;
        return (
          <button
            key={type}
            type="button"
            onClick={() => onSelect(active ? null : type)}
            aria-pressed={active}
            className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition hover:brightness-110"
            style={{
              backgroundColor: typeColor(type),
              opacity: active || selected === null ? 1 : 0.45,
              outline: active ? "2px solid currentColor" : "none",
              outlineOffset: 2,
            }}
          >
            {capitalize(type)}
          </button>
        );
      })}
    </div>
  );
}

export default TypeFilter;
