import PokemonCard from "./PokemonCard.tsx";
import { useFavorites } from "../hooks/useFavorites";
import { useFavoritePokemon } from "../hooks/usePokemon";

function Favorites() {
  const { favorites } = useFavorites();
  const { data, isPending, isError } = useFavoritePokemon(favorites);

  return (
    <div className="pt-8">
      <header className="px-4 pb-4 text-center">
        <h1 className="font-display text-5xl tracking-wide text-slate-800 dark:text-slate-50">
          Favorites
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          {favorites.length > 0
            ? `${favorites.length} Pokémon saved`
            : "Your saved Pokémon live here"}
        </p>
      </header>
      <PokemonCard
        pokemon={data}
        isLoading={isPending}
        isError={isError}
        emptyTitle="No favorites yet"
        emptyHint="Tap the heart on a Pokémon to save it here"
      />
    </div>
  );
}

export default Favorites;
