import React, { useState } from "react";
import "./App.css";
import PokemonList from "./components/PokemonList";
import Nav from "./components/Nav";
import axios from "axios";

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [pokemonURL, setPokemonURL] = useState(
    "https://pokeapi.co/api/v2/pokemon/"
  );

  axios.get(pokemonURL).then((res) => {
    setPokemon(res.data.results.map((p) => p.name));
  });

  return (
    <>
      <Nav />
      <PokemonList pokemon={pokemon} />
    </>
  );
}

export default App;
