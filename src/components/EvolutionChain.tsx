import { Link, useLocation } from "react-router-dom";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { useEvolution, usePokemonByIds } from "../hooks/usePokemon";
import { capitalize, formatDexId } from "../utils/format";
import PokemonImage from "./PokemonImage.tsx";

interface EvolutionChainProps {
  evolutionUrl: string | undefined;
  currentId: number;
}

function EvolutionChain({ evolutionUrl, currentId }: EvolutionChainProps) {
  const location = useLocation();
  // Carry the original list location forward (rather than this detail page) and
  // count each evolution hop, so "Back to Pokédex" returns to the list the user
  // came from instead of the previous evolution.
  const navState = location.state as { from?: string; depth?: number } | null;
  const { data: stages, isPending, isError } = useEvolution(evolutionUrl);
  const ids = stages?.map((s) => s.id) ?? [];
  // Warm the detail cache for each stage so clicking through is instant.
  usePokemonByIds(ids);

  if (isError) return null;

  if (isPending || !stages) {
    return (
      <div className="flex justify-center gap-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="skeleton h-20 w-20 rounded-full bg-slate-200 dark:bg-slate-700"
          />
        ))}
      </div>
    );
  }

  if (stages.length <= 1) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        This Pokémon does not evolve.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-3">
      {stages.map((stage, i) => {
        const isCurrent = stage.id === currentId;
        return (
          <div key={stage.id} className="flex items-center gap-1">
            {i > 0 && (
              <ChevronRightIcon
                className="h-5 w-5 shrink-0 text-slate-300 dark:text-slate-600"
                aria-hidden="true"
              />
            )}
            <Link
              to={`/${stage.id}`}
              state={{
                from: navState?.from,
                depth: (navState?.depth ?? 1) + 1,
              }}
              className={`flex w-24 flex-col items-center rounded-xl p-2 transition hover:bg-slate-100 dark:hover:bg-slate-700/50 ${
                isCurrent ? "bg-slate-100 dark:bg-slate-700/50" : ""
              }`}
            >
              <PokemonImage
                id={stage.id}
                name={stage.name}
                className="h-16 w-16 object-contain"
              />
              <span className="mt-1 text-xs font-bold text-slate-400 dark:text-slate-500">
                {formatDexId(stage.id)}
              </span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {capitalize(stage.name)}
              </span>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

export default EvolutionChain;
