import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  XMarkIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  LinkIcon,
} from "@heroicons/react/20/solid";
import { matchEntries, pokemonId } from "../api/pokeapi";
import { usePokemonByIds, usePokemonIndex } from "../hooks/usePokemon";
import { useToast } from "../hooks/useToast";
import type { Pokemon } from "../types/pokemon";
import { capitalize, statLabel } from "../utils/format";
import { typeColor } from "../utils/pokemonTypes";
import { loadTeam, MAX_TEAM_SLOTS, saveTeam } from "../utils/team";
import PokemonImage from "./PokemonImage.tsx";
import TeamCoverage from "./TeamCoverage.tsx";
import TypeBadge from "./TypeBadge.tsx";

const MAX_SLOTS = MAX_TEAM_SLOTS;
const STAT_ORDER = [
  "hp",
  "attack",
  "defense",
  "special-attack",
  "special-defense",
  "speed",
];
const MAX_STAT = 255;

function AddColumn({
  onAdd,
  disabledIds,
}: {
  onAdd: (id: number) => void;
  disabledIds: number[];
}) {
  const [query, setQuery] = useState("");
  const { data: index } = usePokemonIndex();

  const matches = useMemo(() => {
    if (!index) return [];
    return matchEntries(index, query)
      .filter((e) => !disabledIds.includes(pokemonId(e)))
      .slice(0, 6);
  }, [query, index, disabledIds]);

  return (
    <div className="flex min-h-[16rem] w-44 shrink-0 flex-col items-center justify-start rounded-2xl border-2 border-dashed border-slate-300 p-3 dark:border-slate-600">
      <div className="mb-2 flex w-full items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 dark:border-slate-700 dark:bg-slate-800">
        <MagnifyingGlassIcon className="h-4 w-4 shrink-0 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Add Pokémon"
          aria-label="Add a Pokémon to compare"
          className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
        />
      </div>
      {matches.length > 0 ? (
        <ul className="w-full overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
          {matches.map((m) => (
            <li key={m.name}>
              <button
                type="button"
                onClick={() => {
                  onAdd(pokemonId(m));
                  setQuery("");
                }}
                className="flex w-full items-center gap-1.5 px-2.5 py-1.5 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <PlusIcon className="h-3.5 w-3.5 text-slate-400" />
                {capitalize(m.name)}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-1 items-center text-center text-sm text-slate-400">
          Search to add a Pokémon
        </div>
      )}
    </div>
  );
}

function CompareColumn({
  pokemon,
  onRemove,
}: {
  pokemon: Pokemon;
  onRemove: () => void;
}) {
  const primaryType = pokemon.types[0]?.type.name ?? "normal";
  return (
    <div className="w-44 shrink-0 rounded-2xl border border-slate-200 bg-white p-3 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${capitalize(pokemon.name)}`}
          className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
      <PokemonImage
        id={pokemon.id}
        name={pokemon.name}
        className="mx-auto h-24 w-24 object-contain"
      />
      <p className="mt-1 font-bold text-slate-800 dark:text-slate-100">
        {capitalize(pokemon.name)}
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-1">
        {pokemon.types.map((t) => (
          <TypeBadge key={t.type.name} type={t.type.name} />
        ))}
      </div>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Total
      </p>
      <p
        className="text-lg font-bold"
        style={{ color: typeColor(primaryType) }}
      >
        {pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0)}
      </p>
    </div>
  );
}

function StatRows({ pokemon }: { pokemon: Pokemon[] }) {
  return (
    <div className="mt-6 space-y-4">
      {STAT_ORDER.map((statName) => {
        const values = pokemon.map(
          (p) => p.stats.find((s) => s.stat.name === statName)?.base_stat ?? 0,
        );
        const best = Math.max(...values);
        return (
          <div key={statName}>
            <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {statLabel(statName)}
            </p>
            <div className="flex gap-3">
              {pokemon.map((p, i) => {
                const value = values[i];
                const isBest = value === best && pokemon.length > 1;
                return (
                  <div
                    key={p.id}
                    className="flex w-44 shrink-0 items-center gap-2"
                  >
                    <span
                      className={`w-8 text-right text-sm tabular-nums ${
                        isBest
                          ? "font-bold text-green-600 dark:text-green-400"
                          : "text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {value}
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(100, (value / MAX_STAT) * 100)}%`,
                          backgroundColor: isBest ? "#22c55e" : "#94a3b8",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Compare() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToast } = useToast();
  const hasIdsParam = searchParams.has("ids");
  const ids = (searchParams.get("ids") ?? "")
    .split(",")
    .map(Number)
    .filter((n) => Number.isFinite(n) && n > 0)
    // Dedupe: repeated ids in a hand-edited URL would render duplicate columns.
    .filter((n, i, arr) => arr.indexOf(n) === i);

  const { data, isPending } = usePokemonByIds(ids);
  const pokemon = data.filter((p): p is Pokemon => p !== undefined);

  const setIds = (next: number[]) => {
    // Persist alongside the URL so the team survives navigating away and
    // feeds "Add to team" on detail pages.
    saveTeam(next);
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        if (next.length) params.set("ids", next.join(","));
        else params.delete("ids");
        return params;
      },
      { replace: true },
    );
  };

  // Visiting bare /compare rehydrates the saved team; a shared ids link
  // takes precedence (and becomes the saved team on first edit).
  useEffect(() => {
    if (hasIdsParam) return;
    const stored = loadTeam();
    if (stored.length) setIds(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount only
  }, []);

  const addId = (id: number) => {
    if (!ids.includes(id)) setIds([...ids, id]);
  };
  const removeId = (id: number) => setIds(ids.filter((x) => x !== id));

  const copyLink = async () => {
    const url = `${window.location.origin}/compare?ids=${ids.join(",")}`;
    try {
      await navigator.clipboard.writeText(url);
      addToast("Team link copied");
    } catch {
      addToast("Couldn't copy — copy the address bar URL instead");
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <header className="mb-6 text-center">
        <h1 className="font-display text-5xl tracking-wide text-slate-800 dark:text-slate-50">
          Compare
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Build a team of up to {MAX_SLOTS} and see how their stats and type
          coverage stack up
        </p>
        {ids.length > 0 && (
          <button
            type="button"
            onClick={copyLink}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:shadow dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <LinkIcon className="h-4 w-4" aria-hidden="true" />
            Copy team link
          </button>
        )}
      </header>

      <div className="overflow-x-auto pb-2">
        <div className="flex gap-3">
          {ids.map((id) => {
            const p = pokemon.find((x) => x.id === id);
            if (!p) {
              return (
                <div
                  key={id}
                  className="flex h-64 w-44 shrink-0 items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-700"
                >
                  <div className="skeleton h-24 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
                </div>
              );
            }
            return (
              <CompareColumn
                key={id}
                pokemon={p}
                onRemove={() => removeId(id)}
              />
            );
          })}
          {ids.length < MAX_SLOTS && (
            <AddColumn onAdd={addId} disabledIds={ids} />
          )}
        </div>

        {pokemon.length > 0 && !isPending && (
          <StatRows
            pokemon={ids
              .map((id) => pokemon.find((p) => p.id === id))
              .filter((p): p is Pokemon => p !== undefined)}
          />
        )}
      </div>

      {pokemon.length >= 2 && !isPending && <TeamCoverage pokemon={pokemon} />}

      {ids.length === 0 && (
        <p className="mt-10 text-center text-slate-400">
          Add Pokémon above to start comparing their stats.
        </p>
      )}
    </div>
  );
}

export default Compare;
