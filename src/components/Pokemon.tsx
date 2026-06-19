import { Link, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { usePokemonDetail } from "../hooks/usePokemon";
import {
  capitalize,
  formatDexId,
  formatHeight,
  formatWeight,
  statLabel,
  titleCase,
} from "../utils/format";
import { typeColor, typeGradient } from "../utils/pokemonTypes";
import type { Pokemon as PokemonModel } from "../types/pokemon";
import FavoriteButton from "./FavoriteButton.tsx";
import PokemonImage from "./PokemonImage.tsx";
import TypeBadge from "./TypeBadge.tsx";

const MAX_STAT = 255;

function statBarColor(value: number): string {
  if (value < 50) return "#ef4444";
  if (value < 90) return "#f59e0b";
  return "#22c55e";
}

function StatBar({ name, value }: { name: string; value: number }) {
  return (
    <div className="grid grid-cols-[5rem_2.5rem_1fr] items-center gap-3">
      <span className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {statLabel(name)}
      </span>
      <span className="text-right text-sm font-bold tabular-nums text-slate-800 dark:text-slate-100">
        {value}
      </span>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{
            width: `${Math.min(100, (value / MAX_STAT) * 100)}%`,
            backgroundColor: statBarColor(value),
          }}
        />
      </div>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-100 px-4 py-3 text-center dark:bg-slate-800">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-lg font-bold text-slate-800 dark:text-slate-100">
        {value}
      </p>
    </div>
  );
}

function DetailView({ pokemon }: { pokemon: PokemonModel }) {
  const primaryType = pokemon.types[0]?.type.name ?? "normal";
  const total = pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0);

  return (
    <div className="animate-fade-in mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Pokédex
      </Link>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
        {/* Hero */}
        <div
          className="relative flex flex-col items-center px-6 pb-4 pt-8"
          style={{ background: typeGradient(primaryType) }}
        >
          <FavoriteButton
            id={pokemon.id}
            className="absolute right-4 top-4"
            iconClass="h-6 w-6"
          />
          <span className="text-sm font-bold tracking-widest text-slate-400 dark:text-slate-500">
            {formatDexId(pokemon.id)}
          </span>
          <PokemonImage
            id={pokemon.id}
            name={pokemon.name}
            className="my-2 h-48 w-48 object-contain drop-shadow-xl"
          />
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-50">
            {capitalize(pokemon.name)}
          </h1>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {pokemon.types.map((t) => (
              <TypeBadge key={t.type.name} type={t.type.name} size="md" />
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="space-y-8 px-6 py-8 sm:px-8">
          <div className="grid grid-cols-3 gap-3">
            <InfoTile label="Height" value={formatHeight(pokemon.height)} />
            <InfoTile label="Weight" value={formatWeight(pokemon.weight)} />
            <InfoTile
              label="Abilities"
              value={String(pokemon.abilities.length)}
            />
          </div>

          <section>
            <h2 className="mb-3 text-lg font-bold text-slate-800 dark:text-slate-100">
              Abilities
            </h2>
            <div className="flex flex-wrap gap-2">
              {pokemon.abilities.map((a) => (
                <span
                  key={a.ability.name}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  {titleCase(a.ability.name)}
                  {a.is_hidden && (
                    <span className="text-xs text-slate-400">(hidden)</span>
                  )}
                </span>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Base Stats
              </h2>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                Total{" "}
                <span
                  className="font-bold"
                  style={{ color: typeColor(primaryType) }}
                >
                  {total}
                </span>
              </span>
            </div>
            <div className="space-y-3">
              {pokemon.stats.map((s) => (
                <StatBar
                  key={s.stat.name}
                  name={s.stat.name}
                  value={s.base_stat}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
        <div className="flex flex-col items-center gap-3 px-6 pb-4 pt-8">
          <div className="skeleton h-48 w-48 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="skeleton h-7 w-40 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="space-y-3 px-8 py-8">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="skeleton h-3 w-full rounded bg-slate-200 dark:bg-slate-700"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Pokemon() {
  const { pokemonId } = useParams<{ pokemonId: string }>();
  const { data: pokemon, isPending, isError } = usePokemonDetail(pokemonId);

  if (isPending) {
    return <DetailSkeleton />;
  }

  if (isError || !pokemon) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-slate-800 dark:text-slate-100">
        <h1 className="text-3xl font-bold">Pokémon not found</h1>
        <Link to="/" className="text-lg font-semibold underline">
          Back to Pokédex
        </Link>
      </div>
    );
  }

  return <DetailView pokemon={pokemon} />;
}

export default Pokemon;
