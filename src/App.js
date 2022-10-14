import React, { useState, useEffect } from "react";
import "./App.css";
import PokemonList from "./components/PokemonList";
import Nav from "./components/Nav";
import axios from "axios";

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [pokemonUrl, setPokemonUrl] = useState(
    "https://pokeapi.co/api/v2/pokemon/"
  );
  const [nextPageUrl, setNextPageUrl] = useState();
  const [prevPageUrl, prevNextPageUrl] = useState();


  useEffect(() => {
    axios.get(pokemonUrl).then((res) => {
      setPokemon(res.data.results.map((p) => p.name));
    });
  }, [pokemonUrl]);

  return (
    <>
      <Nav />
      <PokemonList pokemon={pokemon} />
    </>
  );
}

export default App;
