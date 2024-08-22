import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function Pokemon() {
  const { pokemonId } = useParams();
  const [pokemonData, setPokemonData] = useState([]);

  useEffect(() => {
    axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`).then((res) => {
      setPokemonData((state) => {
        state = [...state, res.data];
        return state;
      });
    });
  }, []);

  return (
    <div className="bg-white">
      {pokemonData.map((p) => {
        return (
          <div key={p.id} className="h-screen">
            <h1 className="text-5xl text-center py-10">{`${p.id}. ${
              p.name.charAt(0).toUpperCase() + p.name.slice(1)
            }`}</h1>
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`}
              className="pokemonImg mx-auto my-10"
              alt="pokemon"
            />
            <div className="grid grid-cols-1">
              {p.types.map((t) => {
                return (
                  <div
                    key={Math.random()}
                    className="inline-flex items-center justify-center rounded-lg border border-gray-900 bgwhite text-base text-gray-900 w-24 h-10 mx-auto my-1"
                  >
                    {t.type.name}
                  </div>
                );
              })}
            </div>
            <div className="text-center my-10 text-lg">
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                {p.stats.map((s, index) => (
                  <div key={s.stat.name} className={`p-2 rounded-lg  ${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-100'}`}>
                    <span>{s.stat.name}:</span> {s.base_stat}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Pokemon;
