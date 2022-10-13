import React, { useState } from "react";
import "./App.css";
import PokemonList from "./components/PokemonList";
import Nav from "./components/Nav";

function App() {
  const [pokemon, setPokemon] = useState([
    "charmander",
    "pikachu",
    "charizard",
    "chansey",
  ]);

  return (
    <>
      <Nav />
      <PokemonList pokemon={pokemon} />
    </>
  );
}

export default App;
