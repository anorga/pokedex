import type { CSSProperties, MouseEvent } from "react";
import { Link } from "react-router-dom";
import type { Pokemon } from "../types/pokemon";
import { capitalize, formatDexId } from "../utils/format";
import { typeColor, typeGradient } from "../utils/pokemonTypes";
import FavoriteButton from "./FavoriteButton.tsx";
import PokemonImage from "./PokemonImage.tsx";
import TypeBadge from "./TypeBadge.tsx";

interface PokemonGridCardProps {
  pokemon: Pokemon;
  from: string;
  index: number;
}

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function PokemonGridCard({ pokemon, from, index }: PokemonGridCardProps) {
  const primaryType = pokemon.types[0]?.type.name ?? "normal";

  const handleMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (prefersReducedMotion()) return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(700px) rotateX(${(-py * 5).toFixed(2)}deg) rotateY(${(px * 5).toFixed(2)}deg) translateY(-4px)`;
  };

  const handleLeave = (e: MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.transform = "";
  };

  // Glow color lives on the Link; the entrance animation lives on an inner
  // wrapper so it does not own `transform` (a filling animation would override
  // the inline transform set by the tilt handlers).
  const linkStyle: CSSProperties & Record<"--glow", string> = {
    "--glow": typeColor(primaryType),
  };
  const innerStyle: CSSProperties = {
    animationDelay: `${Math.min(index, 11) * 0.04}s`,
  };

  return (
    <Link
      to={`/${pokemon.id}`}
      state={{ from }}
      viewTransition
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={linkStyle}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-[transform,box-shadow] duration-200 [transform-style:preserve-3d] hover:shadow-[0_16px_40px_-12px_var(--glow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="animate-fade-in flex flex-1 flex-col" style={innerStyle}>
        <FavoriteButton
          id={pokemon.id}
          className="absolute right-2 top-2 z-20"
          iconClass="h-5 w-5"
        />
        <span className="absolute left-3 top-3 z-20 text-xs font-bold text-slate-400 dark:text-slate-500">
          {formatDexId(pokemon.id)}
        </span>
        <div
          className="relative flex items-center justify-center overflow-hidden px-4 pb-2 pt-6"
          style={{ background: typeGradient(primaryType) }}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-4 right-1 select-none text-8xl font-black leading-none text-black/5 dark:text-white/5"
          >
            {pokemon.id}
          </span>
          <PokemonImage
            id={pokemon.id}
            name={pokemon.name}
            transitionName={`poke-${pokemon.id}`}
            className="relative z-10 h-28 w-28 object-contain drop-shadow-md transition-transform duration-200 group-hover:scale-110"
          />
        </div>
        <div className="flex flex-1 flex-col items-center gap-2 px-3 pb-4 pt-2">
          <p className="text-center text-base font-bold text-slate-800 dark:text-slate-100">
            {capitalize(pokemon.name)}
          </p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {pokemon.types.map((t) => (
              <TypeBadge key={t.type.name} type={t.type.name} />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PokemonGridCard;
