import { Link, useParams } from "react-router-dom";
import { usePokemonDetail } from "../hooks/usePokemon";
import { artworkUrl } from "../api/pokeapi";
import { capitalize } from "../utils/format";

function Pokemon() {
  const { pokemonId } = useParams<{ pokemonId: string }>();
  const { data: pokemon, isPending, isError } = usePokemonDetail(pokemonId);

  if (isPending) {
    return (
      <div className="bg-white h-screen flex items-center justify-center">
        <h1 className="text-3xl">Loading...</h1>
      </div>
    );
  }

  if (isError || !pokemon) {
    return (
      <div className="bg-white h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl">Pokémon not found</h1>
        <Link to="/" className="text-xl underline">
          Back to Pokédex
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="min-h-screen">
        <h1 className="text-5xl text-center py-10">
          {`${pokemon.id}. ${capitalize(pokemon.name)}`}
        </h1>
        <img
          src={artworkUrl(pokemon.id)}
          className="pokemonImg mx-auto my-10"
          alt={pokemon.name}
        />
        <div className="grid grid-cols-1">
          {pokemon.types.map((t) => (
            <div
              key={t.type.name}
              className="inline-flex items-center justify-center rounded-lg border border-gray-900 bg-white text-base text-gray-900 w-24 h-10 mx-auto my-1"
            >
              {t.type.name}
            </div>
          ))}
        </div>
        <div className="text-center my-10 text-lg">
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {pokemon.stats.map((s) => (
              <div key={s.stat.name} className="p-2 rounded-lg bg-gray-100">
                <span>{s.stat.name}:</span> {s.base_stat}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pokemon;
