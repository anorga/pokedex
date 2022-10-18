import { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "./Pagination";
import PokemonCard from "./PokemonCard";

function Pokedex() {
  const [pokeData, setPokeData] = useState([]);
  const [currentPage, setCurrentPage] = useState(
    "https://pokeapi.co/api/v2/pokemon/"
  );
  const [nextPage, setNextPage] = useState();
  const [prevPage, setPrevPage] = useState();

  const pokeFunction = async () => {
    const res = await axios.get(currentPage);
    setNextPage(res.data.next);
    setPrevPage(res.data.previous);
    getPokemon(res.data.results);
  };

  const getPokemon = async (res) => {
    res.map(async (item) => {
      const result = await axios.get(item.url);
      setPokeData((state) => {
        state = [...state, result.data];
        return state;
      });
    });
  };

  useEffect(() => {
    pokeFunction();
  },[currentPage]);

  // PAGINATION FX
  function toNextPage() {
    setPokeData([])
    setCurrentPage(nextPage);
  }

  function toPrevPage() {
    setPokeData([])
    setCurrentPage(prevPage);
  }
  return (
    <>
      <Pagination toNextPage={toNextPage} toPrevPage={toPrevPage} />
      <PokemonCard pokeData={pokeData} />
      <Pagination toNextPage={toNextPage} toPrevPage={toPrevPage} />
    </>
  );
}

export default Pokedex;
