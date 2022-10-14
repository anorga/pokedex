import React, { useState, useEffect } from "react";
import "./App.css";
import PokemonList from "./components/PokemonList";
import Nav from "./components/Nav";
import Pagination from "./components/Pagination";
import axios from "axios";

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [currentPageUrl, setCurrentPageUrl] = useState(
    "https://pokeapi.co/api/v2/pokemon/"
  );
  const [nextPageUrl, setNextPageUrl] = useState();
  const [prevPageUrl, setPrevPageUrl] = useState();

  useEffect(() => {
    axios.get(currentPageUrl).then((res) => {
      setNextPageUrl(res.data.next);
      setPrevPageUrl(res.data.previous);
      setPokemon(res.data.results.map((p) => p.name));
    });
  }, [currentPageUrl]);

  function nextPage() {
    setCurrentPageUrl(nextPageUrl);
  }

  function prevPage() {
    setCurrentPageUrl(prevPageUrl);
  }

  return (
    <>
      <Nav />
      <PokemonList pokemon={pokemon} />
      <Pagination nextPage={nextPage} prevPage={prevPage} />
    </>
  );
}

export default App;
