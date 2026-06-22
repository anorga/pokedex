import { useLocation } from "react-router-dom";
import type { Pokemon } from "../types/pokemon";
import PokemonCardSkeleton from "./PokemonCardSkeleton.tsx";
import PokemonGridCard from "./PokemonGridCard.tsx";

interface PokemonCardProps {
  pokemon: Pokemon[];
  isLoading: boolean;
  isError?: boolean;
  emptyTitle?: string;
  emptyHint?: string;
}

function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center gap-2 py-24 text-center">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        {title}
      </h2>
      <p className="text-slate-500 dark:text-slate-400">{hint}</p>
    </div>
  );
}

function PokemonCard({
  pokemon,
  isLoading,
  isError,
  emptyTitle = "No Pokémon found",
  emptyHint = "Try another search term",
}: PokemonCardProps) {
  const location = useLocation();
  const from = `${location.pathname}${location.search}`;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="grid min-h-[60vh] auto-rows-min grid-cols-2 gap-4 py-2 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
        {isLoading ? (
          <PokemonCardSkeleton />
        ) : isError ? (
          <EmptyState
            title="Something went wrong"
            hint="Please try again in a moment"
          />
        ) : pokemon.length === 0 ? (
          <EmptyState title={emptyTitle} hint={emptyHint} />
        ) : (
          pokemon.map((p, i) => (
            <PokemonGridCard key={p.id} pokemon={p} from={from} index={i} />
          ))
        )}
      </div>
    </div>
  );
}

export default PokemonCard;
