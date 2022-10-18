import { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "./Pagination";

function Pokedex() {
  const pokemonNumberUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/`;

  // POKEMON NAME STATE
  const [pokemon, setPokemon] = useState([]);
  const [currentPageUrl, setCurrentPageUrl] = useState(
    "https://pokeapi.co/api/v2/pokemon/"
  );
  // PAGINATION STATE
  const [nextPageUrl, setNextPageUrl] = useState();
  const [prevPageUrl, setPrevPageUrl] = useState();

  // SPRITES STATE
  let [pokemonNumber, setPokemonNumber] = useState(0);

  useEffect(() => {
    axios.get(currentPageUrl).then((res) => {
      setNextPageUrl(res.data.next);
      setPrevPageUrl(res.data.previous);
      setPokemon(res.data.results.map((p) => p.name));
    });
  }, [currentPageUrl, pokemonNumber]);

  // PAGINATION FX
  function nextPage() {
    setCurrentPageUrl(nextPageUrl);
    setPokemonNumber(+20);
  }

  function prevPage() {
    setCurrentPageUrl(prevPageUrl);
    setPokemonNumber(-20);
  }
  return (
    <>
    <Pagination nextPage={nextPage} prevPage={prevPage} />
      <div className="relative px-4 pt-16 pb-20 bg-gray-50 sm:px-6 lg:pt-2 lg:pb-2 lg:px-8">
        <div className="absolute inset-0">
          <div className="bg-gray-50 h-full" />
        </div>
        <div className="relative mx-auto max-w-6xl">
          <div className="grid max-w-lg gap-5 mx-auto lg:grid-cols-5 lg:max-w-none">
            {pokemon.map((p) => {
              pokemonNumber = pokemonNumber + 1;
              return (
                <div
                  key={p}
                  className="flex flex-col overflow-hidden rounded-lg shadow-lg"
                >
                  <div className="flex-shrink-0 bg-white hover:bg-blue-50">
                    <img
                      className="object-cover w-full h-full"
                      src={`${pokemonNumberUrl}${pokemonNumber}.png`}
                      alt="project"
                    />
                  </div>
                  <div className="flex flex-col justify-between flex-1 pb-6 pt-3 bg-white">
                    <div className="flex-1">
                      <a href=".." className="block">
                        <p className="text-xl font-semibold text-center text-gray-900 hover:text-red-800">
                          {`${pokemonNumber}.  ${p}`}
                        </p>
                        {/* <p className="mt-3 text-base text-gray-500">{p.description}</p> */}
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Pagination nextPage={nextPage} prevPage={prevPage} />
    </>
  );
}

export default Pokedex;
