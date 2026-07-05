import { useTeamEffectiveness } from "../hooks/usePokemon";
import type { Pokemon } from "../types/pokemon";
import { capitalize } from "../utils/format";
import { TYPE_COLORS } from "../utils/pokemonTypes";
import TypeBadge from "./TypeBadge.tsx";

interface CoverageRow {
  type: string;
  weak: number;
  covered: number;
}

/**
 * Defensive coverage across the whole team: for each attacking type, how many
 * members take super-effective damage vs. how many resist (or are immune to)
 * it. Shared weaknesses two or more deep are called out as threats.
 */
function TeamCoverage({ pokemon }: { pokemon: Pokemon[] }) {
  const teamTypes = pokemon.map((p) => p.types.map((t) => t.type.name));
  const { data, isPending } = useTeamEffectiveness(teamTypes);

  if (pokemon.length < 2) return null;

  if (isPending) {
    return (
      <div className="mt-8 flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="skeleton h-10 w-28 rounded-lg bg-slate-200 dark:bg-slate-700"
          />
        ))}
      </div>
    );
  }

  const rows: CoverageRow[] = Object.keys(TYPE_COLORS).map((type) => {
    let weak = 0;
    let covered = 0;
    for (const record of data) {
      if (!record) continue;
      const multiplier = record[type] ?? 1;
      if (multiplier > 1) weak++;
      else if (multiplier < 1) covered++;
    }
    return { type, weak, covered };
  });

  const threats = rows
    .filter((r) => r.weak >= 2 && r.weak > r.covered)
    .sort((a, b) => b.weak - a.weak);

  const tone = (r: CoverageRow) => {
    if (r.weak > r.covered)
      return "border-red-300 bg-red-50/50 dark:border-red-900 dark:bg-red-950/20";
    if (r.covered > r.weak)
      return "border-green-300 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20";
    return "border-slate-200 dark:border-slate-700";
  };

  return (
    <section className="mt-10">
      <h2 className="mb-1 text-lg font-bold text-slate-800 dark:text-slate-100">
        Team Coverage
      </h2>
      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
        {threats.length > 0 ? (
          <>
            Watch out — shared weakness to{" "}
            <span className="font-semibold text-red-500">
              {threats
                .map((t) => `${capitalize(t.type)} (${t.weak})`)
                .join(", ")}
            </span>
          </>
        ) : (
          "No shared weaknesses — solid defensive spread."
        )}
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {rows.map((r) => (
          <div
            key={r.type}
            className={`flex items-center justify-between rounded-lg border px-2.5 py-1.5 ${tone(r)}`}
          >
            <TypeBadge type={r.type} />
            <span className="text-xs tabular-nums text-slate-500 dark:text-slate-400">
              <span
                className={
                  r.weak > 0 ? "font-bold text-red-500" : "text-slate-400"
                }
              >
                {r.weak}
              </span>{" "}
              weak ·{" "}
              <span
                className={
                  r.covered > 0
                    ? "font-bold text-green-600 dark:text-green-400"
                    : "text-slate-400"
                }
              >
                {r.covered}
              </span>{" "}
              resist
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TeamCoverage;
