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
      console.log(res.data);
    });
  }, []);

  return (
    <>
      {pokemonData.map((p) => {
        return (
          <div key={p.id}>
            <h1 className="text-2xl">This is pokemon {`#${p.id} ${
                          p.name.charAt(0).toUpperCase() + p.name.slice(1)
                        }`}</h1>
            <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`} alt="pokemon" />
            <p>Pokemon information goes here</p>
          </div>
        );
      })}
    </>
  );
}

export default Pokemon;
