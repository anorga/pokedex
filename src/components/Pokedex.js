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
      <div className="ml-5 my-5">
        <table className="border-collapse border border-slate-500">
          <thead>
            <tr>
              <th className="border-collapse border border-slate-500 px-4 py-2">
                Pokemon Name
              </th>
              <th className="border-collapse border border-slate-500 px-4 py-2">
                Pokemon Sprite
              </th>
            </tr>
          </thead>
          <tbody>
            {pokemon.map((p) => {
              pokemonNumber = pokemonNumber + 1;
              return (
                <tr key={p}>
                  <td className="border-collapse border border-slate-500 px-4 py-2">
                    {p}
                  </td>
                  <td>
                    <img
                      src={pokemonNumberUrl + pokemonNumber + ".png"}
                      alt="pokemon"
                      className="border border-slate-500 w-full h-full"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Pagination nextPage={nextPage} prevPage={prevPage} />
    </>
  );
}

export default Pokedex;
