import React, { useState, useEffect } from "react";
import "./App.css";
import PokemonList from "./components/PokemonList";
import Nav from "./components/Nav";
import Pagination from "./components/Pagination";
import Sprites from "./components/Sprites";
import axios from "axios";

function App() {
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
      <Nav />
      <Sprites />
      <PokemonList pokemon={pokemon} pokemonNumber={pokemonNumber} />
      <Pagination nextPage={nextPage} prevPage={prevPage} />
    </>
  );
}

export default App;
