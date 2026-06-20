import { Link, useLocation } from "react-router-dom";
import type { Pokemon } from "../types/pokemon";
import { capitalize, formatDexId } from "../utils/format";
import { typeGradient } from "../utils/pokemonTypes";
import FavoriteButton from "./FavoriteButton.tsx";
import PokemonCardSkeleton from "./PokemonCardSkeleton.tsx";
import PokemonImage from "./PokemonImage.tsx";
import TypeBadge from "./TypeBadge.tsx";

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
          pokemon.map((p) => {
            const primaryType = p.types[0]?.type.name ?? "normal";
            return (
              <Link
                key={p.id}
                to={`/${p.id}`}
                state={{ from }}
                viewTransition
                className="group animate-fade-in relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:border-slate-700 dark:bg-slate-800"
              >
                <FavoriteButton
                  id={p.id}
                  className="absolute right-2 top-2 z-10"
                  iconClass="h-5 w-5"
                />
                <span className="absolute left-3 top-3 z-10 text-xs font-bold text-slate-400 dark:text-slate-500">
                  {formatDexId(p.id)}
                </span>
                <div
                  className="flex items-center justify-center px-4 pt-6 pb-2"
                  style={{ background: typeGradient(primaryType) }}
                >
                  <PokemonImage
                    id={p.id}
                    name={p.name}
                    transitionName={`poke-${p.id}`}
                    className="h-28 w-28 object-contain drop-shadow-md transition-transform duration-200 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-1 flex-col items-center gap-2 px-3 pb-4 pt-2">
                  <p className="text-center text-base font-bold text-slate-800 dark:text-slate-100">
                    {capitalize(p.name)}
                  </p>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {p.types.map((t) => (
                      <TypeBadge key={t.type.name} type={t.type.name} />
                    ))}
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}

export default PokemonCard;
