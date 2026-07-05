import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import type { PokemonMove } from "../types/pokemon";
import { titleCase } from "../utils/format";

const chipClass =
  "inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200";

/**
 * Learnset split into level-up moves (with their level, sorted) and a
 * collapsed cloud of everything else (TM/HM, egg, tutor). Each move's newest
 * version-group entry decides its method, so remakes win over old games.
 */
function Moves({ moves }: { moves: PokemonMove[] }) {
  const [showOthers, setShowOthers] = useState(false);

  const levelUp: { name: string; level: number }[] = [];
  const others: string[] = [];
  for (const m of moves) {
    // Details are listed oldest game first; the last entry is the newest.
    const detail = m.version_group_details[m.version_group_details.length - 1];
    if (!detail) continue;
    if (detail.move_learn_method.name === "level-up") {
      levelUp.push({ name: m.move.name, level: detail.level_learned_at });
    } else {
      others.push(m.move.name);
    }
  }
  levelUp.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
  others.sort();

  if (levelUp.length === 0 && others.length === 0) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        No move data available.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {levelUp.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {levelUp.map((m) => (
            <span key={m.name} className={chipClass}>
              <span className="text-xs font-bold text-slate-400">
                Lv {m.level}
              </span>
              {titleCase(m.name)}
            </span>
          ))}
        </div>
      )}
      {others.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setShowOthers((s) => !s)}
            aria-expanded={showOthers}
            className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
          >
            <ChevronDownIcon
              className={`h-4 w-4 transition-transform ${showOthers ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
            {showOthers ? "Hide" : "Show"} {others.length} TM / egg / tutor
            moves
          </button>
          {showOthers && (
            <div className="mt-3 flex flex-wrap gap-2">
              {others.map((name) => (
                <span key={name} className={chipClass}>
                  {titleCase(name)}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Moves;
