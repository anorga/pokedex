import React, { useState, useEffect } from "react";
import "./App.css";
import PokemonList from "./components/PokemonList";
import Nav from "./components/Nav";
import axios from "axios";

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [pokemonURL, setPokemonURL] = useState(
    "https://pokeapi.co/api/v2/pokemon/"
  );

  useEffect(() => {
    axios.get(pokemonURL).then((res) => {
      setPokemon(res.data.results.map((p) => p.name));
    });
  }, [pokemonURL]);

  return (
    <>
      <Nav />
      <PokemonList pokemon={pokemon} />
    </>
  );
}

export default App;
