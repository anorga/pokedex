import { useState } from "react";
import { artworkUrl } from "../api/pokeapi";
import fallback from "../assets/surprisedPikachu.webp";

interface PokemonImageProps {
  id: number;
  name: string;
  className?: string;
}

const spriteUrl = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

/**
 * Renders a Pokémon's official artwork, gracefully degrading to the basic
 * sprite and finally a local placeholder when artwork is missing (common for
 * alternate forms with ids above 10000).
 */
function PokemonImage({ id, name, className }: PokemonImageProps) {
  const [step, setStep] = useState(0);
  const sources = [artworkUrl(id), spriteUrl(id), fallback];

  return (
    <img
      src={sources[step]}
      alt={name}
      loading="lazy"
      className={className}
      onError={() => setStep((s) => Math.min(s + 1, sources.length - 1))}
    />
  );
}

export default PokemonImage;
