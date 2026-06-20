import { useTypeEffectiveness } from "../hooks/usePokemon";
import { typeColor } from "../utils/pokemonTypes";
import { capitalize } from "../utils/format";

function formatMultiplier(value: number): string {
  if (value === 0) return "0×";
  if (value === 0.25) return "¼×";
  if (value === 0.5) return "½×";
  return `${value}×`;
}

function Chip({ type, multiplier }: { type: string; multiplier: number }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-white shadow-sm"
      style={{ backgroundColor: typeColor(type) }}
    >
      {capitalize(type)}
      <span className="rounded bg-black/20 px-1 tabular-nums">
        {formatMultiplier(multiplier)}
      </span>
    </span>
  );
}

function Group({
  title,
  entries,
}: {
  title: string;
  entries: [string, number][];
}) {
  if (entries.length === 0) return null;
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
        {title}
      </h3>
      <div className="flex flex-wrap gap-1.5">
        {entries.map(([type, mult]) => (
          <Chip key={type} type={type} multiplier={mult} />
        ))}
      </div>
    </div>
  );
}

function TypeEffectiveness({ types }: { types: string[] }) {
  const { data, isPending, isError } = useTypeEffectiveness(types);

  if (isError) return null;

  if (isPending || !data) {
    return (
      <div className="flex gap-2">
        <div className="skeleton h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="skeleton h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="skeleton h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-700" />
      </div>
    );
  }

  const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const weakTo = sorted.filter(([, m]) => m > 1);
  const resists = sorted.filter(([, m]) => m < 1 && m > 0);
  const immune = sorted.filter(([, m]) => m === 0);

  return (
    <div className="space-y-4">
      <Group title="Weak to" entries={weakTo} />
      <Group title="Resistant to" entries={resists} />
      <Group title="Immune to" entries={immune} />
    </div>
  );
}

export default TypeEffectiveness;
