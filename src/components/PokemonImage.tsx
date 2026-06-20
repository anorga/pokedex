import { useState } from "react";
import { artworkUrl, shinyArtworkUrl } from "../api/pokeapi";
import fallback from "../assets/surprisedPikachu.webp";

interface PokemonImageProps {
  id: number;
  name: string;
  className?: string;
  shiny?: boolean;
  /** Sets view-transition-name so the image morphs across navigation. */
  transitionName?: string;
}

const spriteUrl = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

/**
 * Renders a Pokémon's official artwork, gracefully degrading to the basic
 * sprite and finally a local placeholder when artwork is missing (common for
 * alternate forms with ids above 10000).
 */
function PokemonImage({
  id,
  name,
  className,
  shiny = false,
  transitionName,
}: PokemonImageProps) {
  const [step, setStep] = useState(0);
  const sources = shiny
    ? [shinyArtworkUrl(id), artworkUrl(id), fallback]
    : [artworkUrl(id), spriteUrl(id), fallback];

  // Restart the fallback chain when the source set changes, adjusting state
  // during render rather than in an effect.
  const sourceKey = `${id}-${shiny}`;
  const [prevKey, setPrevKey] = useState(sourceKey);
  if (sourceKey !== prevKey) {
    setPrevKey(sourceKey);
    setStep(0);
  }

  return (
    <img
      src={sources[step]}
      alt={name}
      loading="lazy"
      className={className}
      style={
        transitionName ? { viewTransitionName: transitionName } : undefined
      }
      onError={() => setStep((s) => Math.min(s + 1, sources.length - 1))}
    />
  );
}

export default PokemonImage;
