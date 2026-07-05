import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ScaleIcon,
  SparklesIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/outline";
import {
  artworkUrl,
  MAX_DEX_ID,
  pokemonId,
  shinyArtworkUrl,
} from "../api/pokeapi";
import {
  usePokemonByIds,
  usePokemonDetail,
  useSpecies,
} from "../hooks/usePokemon";
import { detailNavState } from "../utils/navState";
import { loadTeam, MAX_TEAM_SLOTS, saveTeam } from "../utils/team";
import { useToast } from "../hooks/useToast";
import { useCountUp } from "../hooks/useCountUp";
import {
  capitalize,
  cleanFlavorText,
  formatDexId,
  formatGender,
  formatHeight,
  formatWeight,
  statLabel,
  titleCase,
} from "../utils/format";
import { typeColor, typeGradient } from "../utils/pokemonTypes";
import type { Pokemon as PokemonModel } from "../types/pokemon";
import EvolutionChain from "./EvolutionChain.tsx";
import FavoriteButton from "./FavoriteButton.tsx";
import Moves from "./Moves.tsx";
import PokemonImage from "./PokemonImage.tsx";
import StatRadar from "./StatRadar.tsx";
import TypeBadge from "./TypeBadge.tsx";
import TypeEffectiveness from "./TypeEffectiveness.tsx";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-bold text-slate-800 dark:text-slate-100">
        {title}
      </h2>
      {children}
    </section>
  );
}

const MAX_STAT = 255;

function statBarColor(value: number): string {
  if (value < 50) return "#ef4444";
  if (value < 90) return "#f59e0b";
  return "#22c55e";
}

function StatBar({ name, value }: { name: string; value: number }) {
  const display = useCountUp(value);
  return (
    <div className="grid grid-cols-[5rem_2.5rem_1fr] items-center gap-3">
      <span className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {statLabel(name)}
      </span>
      <span className="text-right text-sm font-bold tabular-nums text-slate-800 dark:text-slate-100">
        {display}
      </span>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className="h-full rounded-full"
          style={{
            width: `${Math.min(100, (display / MAX_STAT) * 100)}%`,
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
  const navigate = useNavigate();
  const location = useLocation();
  const [shiny, setShiny] = useState(false);
  const navState = location.state as { from?: string; depth?: number } | null;
  const from = navState?.from;
  const backDepth = navState?.depth ?? 1;
  const primaryType = pokemon.types[0]?.type.name ?? "normal";
  const typeNames = pokemon.types.map((t) => t.type.name);
  const total = pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0);
  const totalDisplay = useCountUp(total);

  // Look species up by name, not pokemon id: alternate forms (mega, gmax,
  // regional) have ids above 10000 with no species record of their own.
  const { data: species } = useSpecies(pokemon.species?.name ?? pokemon.id);
  const flavor = species?.flavor_text_entries.find(
    (e) => e.language.name === "en",
  )?.flavor_text;
  const genus = species?.genera.find((g) => g.language.name === "en")?.genus;

  useEffect(() => {
    document.title = `${capitalize(pokemon.name)} · Pokédex`;
    return () => {
      document.title = "Pokédex";
    };
  }, [pokemon.name]);

  // Warm the shiny artwork into the browser cache so toggling shiny is instant
  // instead of waiting on a network fetch.
  useEffect(() => {
    const img = new Image();
    img.src = shinyArtworkUrl(pokemon.id);
  }, [pokemon.id]);

  // Prev/next walk the national dex by species id, so alternate-form pages
  // (id > 10000) step from their base species instead of dead-ending.
  const dexId = pokemon.species ? pokemonId(pokemon.species) : pokemon.id;
  const prevId = dexId > 1 ? dexId - 1 : null;
  const nextId = dexId < MAX_DEX_ID ? dexId + 1 : null;
  const neighborIds = [prevId, nextId].filter((n): n is number => n !== null);
  // Warm the neighbor detail cache so stepping is instant.
  const { data: neighbors } = usePokemonByIds(neighborIds);
  const neighborName = (id: number | null) => {
    const p = id === null ? undefined : neighbors.find((n) => n?.id === id);
    return p ? capitalize(p.name) : undefined;
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target.isContentEditable
      ) {
        return;
      }
      if (e.key === "ArrowLeft" && prevId) {
        navigate(`/${prevId}`, { state: detailNavState(location) });
      } else if (e.key === "ArrowRight" && nextId) {
        navigate(`/${nextId}`, { state: detailNavState(location) });
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [prevId, nextId, navigate, location]);

  const { addToast } = useToast();
  const addToTeam = () => {
    const team = loadTeam();
    if (team.includes(pokemon.id)) {
      addToast("Already on your team");
      return;
    }
    if (team.length >= MAX_TEAM_SLOTS) {
      addToast("Team is full (6)", {
        label: "View",
        onAction: () => navigate("/compare"),
      });
      return;
    }
    saveTeam([...team, pokemon.id]);
    addToast(`${capitalize(pokemon.name)} added to team`, {
      label: "View",
      onAction: () => navigate("/compare"),
    });
  };

  const cryUrl = pokemon.cries?.latest ?? pokemon.cries?.legacy ?? null;
  const playCry = () => {
    if (!cryUrl) return;
    const audio = new Audio(cryUrl);
    audio.volume = 0.4;
    void audio.play().catch(() => {
      // Autoplay restrictions or a missing file; nothing useful to surface.
    });
  };

  // If we arrived from a list, step back through history so its exact
  // page/filter and scroll position are restored. Clicking through an
  // evolution chain pushes extra entries, so `depth` tracks how many to pop to
  // reach the original list; otherwise fall back to the root.
  const goBack = () => {
    if (from) navigate(-backDepth);
    else navigate("/");
  };

  return (
    <div className="animate-fade-in mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <button
        type="button"
        onClick={goBack}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Pokédex
      </button>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
        {/* Hero */}
        <div
          className="relative flex flex-col items-center overflow-hidden px-6 pb-4 pt-8"
          style={{ background: typeGradient(primaryType) }}
        >
          {/* The radial mask lives on this wrapper, not on the blurred <img>.
              Safari/iPadOS drops the mask when `filter: blur()` and
              `mask-image` share an element, leaving the full blurred square
              (visible vertical bands) behind the artwork. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-10 left-1/2 z-0 h-72 w-72 -translate-x-1/2 overflow-hidden"
            style={{
              maskImage:
                "radial-gradient(circle at center, #000 25%, transparent 70%)",
              WebkitMaskImage:
                "radial-gradient(circle at center, #000 25%, transparent 70%)",
            }}
          >
            <img
              src={shiny ? shinyArtworkUrl(pokemon.id) : artworkUrl(pokemon.id)}
              alt=""
              className="h-full w-full select-none object-contain opacity-30 blur-3xl"
            />
          </div>
          {prevId && (
            <Link
              to={`/${prevId}`}
              state={detailNavState(location)}
              aria-label={`Previous: ${neighborName(prevId) ?? formatDexId(prevId)}`}
              title={neighborName(prevId) ?? formatDexId(prevId)}
              className="absolute left-3 top-1/2 z-20 grid -translate-y-1/2 place-items-center rounded-full bg-white/80 p-1.5 text-slate-500 shadow-sm backdrop-blur-sm transition hover:scale-110 dark:bg-slate-900/70 dark:text-slate-300"
            >
              <ChevronLeftIcon className="h-6 w-6" aria-hidden="true" />
            </Link>
          )}
          {nextId && (
            <Link
              to={`/${nextId}`}
              state={detailNavState(location)}
              aria-label={`Next: ${neighborName(nextId) ?? formatDexId(nextId)}`}
              title={neighborName(nextId) ?? formatDexId(nextId)}
              className="absolute right-3 top-1/2 z-20 grid -translate-y-1/2 place-items-center rounded-full bg-white/80 p-1.5 text-slate-500 shadow-sm backdrop-blur-sm transition hover:scale-110 dark:bg-slate-900/70 dark:text-slate-300"
            >
              <ChevronRightIcon className="h-6 w-6" aria-hidden="true" />
            </Link>
          )}
          <div className="absolute right-4 top-4 z-20 flex items-center gap-1.5">
            <button
              type="button"
              onClick={addToTeam}
              aria-label="Add to compare team"
              title="Add to team"
              className="grid place-items-center rounded-full bg-white/80 p-1.5 text-slate-400 shadow-sm backdrop-blur-sm transition hover:scale-110 dark:bg-slate-900/70 dark:text-slate-300"
            >
              <ScaleIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            {cryUrl && (
              <button
                type="button"
                onClick={playCry}
                aria-label="Play cry"
                title="Play cry"
                className="grid place-items-center rounded-full bg-white/80 p-1.5 text-slate-400 shadow-sm backdrop-blur-sm transition hover:scale-110 dark:bg-slate-900/70 dark:text-slate-300"
              >
                <SpeakerWaveIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setShiny((s) => !s)}
              aria-pressed={shiny}
              aria-label="Toggle shiny artwork"
              title="Toggle shiny"
              className={`grid place-items-center rounded-full bg-white/80 p-1.5 shadow-sm backdrop-blur-sm transition hover:scale-110 dark:bg-slate-900/70 ${
                shiny ? "text-amber-400" : "text-slate-400 dark:text-slate-300"
              }`}
            >
              <SparklesIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <FavoriteButton id={pokemon.id} iconClass="h-6 w-6" />
          </div>
          <div className="relative z-10 flex w-full flex-col items-center">
            <span className="text-sm font-bold tracking-widest text-slate-400 dark:text-slate-500">
              {formatDexId(pokemon.id)}
            </span>
            <PokemonImage
              id={pokemon.id}
              name={pokemon.name}
              shiny={shiny}
              transitionName={shiny ? undefined : `poke-${pokemon.id}`}
              className="my-2 h-48 w-48 object-contain drop-shadow-xl"
            />
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-50">
              {capitalize(pokemon.name)}
            </h1>
            {genus && (
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {genus}
              </p>
            )}
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {pokemon.types.map((t) => (
                <TypeBadge key={t.type.name} type={t.type.name} size="md" />
              ))}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-8 px-6 py-8 sm:px-8">
          {flavor && (
            <p className="text-center text-base leading-relaxed text-slate-600 dark:text-slate-300">
              {cleanFlavorText(flavor)}
            </p>
          )}

          <div className="grid grid-cols-3 gap-3">
            <InfoTile label="Height" value={formatHeight(pokemon.height)} />
            <InfoTile label="Weight" value={formatWeight(pokemon.weight)} />
            <InfoTile
              label="Gender"
              value={species ? formatGender(species.gender_rate) : "—"}
            />
          </div>

          <Section title="Abilities">
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
          </Section>

          <Section title="Type Defenses">
            <TypeEffectiveness types={typeNames} />
          </Section>

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
                  {totalDisplay}
                </span>
              </span>
            </div>
            <div className="md:flex md:items-center md:gap-8">
              <StatRadar
                stats={pokemon.stats.map((s) => ({
                  name: s.stat.name,
                  value: s.base_stat,
                }))}
                color={typeColor(primaryType)}
                className="mx-auto h-56 w-56 shrink-0"
              />
              <div className="flex-1 space-y-3">
                {pokemon.stats.map((s) => (
                  <StatBar
                    key={s.stat.name}
                    name={s.stat.name}
                    value={s.base_stat}
                  />
                ))}
              </div>
            </div>
          </section>

          <Section title="Evolution">
            <EvolutionChain
              evolutionUrl={species?.evolution_chain.url}
              // Evolution stages are species; use the species id so the
              // current stage still highlights on alternate-form pages.
              currentId={
                pokemon.species ? pokemonId(pokemon.species) : pokemon.id
              }
            />
          </Section>

          <Section title="Moves">
            <Moves moves={pokemon.moves ?? []} />
          </Section>
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
