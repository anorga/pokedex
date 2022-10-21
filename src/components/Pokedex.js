import { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "./Pagination";
import PokemonCard from "./PokemonCard";
import Search from "./Search";

function Pokedex({ pullPokemonData }) {
  const [pokeData, setPokeData] = useState([]);
  const [currentPage, setCurrentPage] = useState(
    "https://pokeapi.co/api/v2/pokemon/"
  );
  const [loading, setLoading] = useState(true);
  const [nextPage, setNextPage] = useState();
  const [prevPage, setPrevPage] = useState();
  const [filter, setFilter] = useState("");

  const pokeFunction = async () => {
    setLoading(true);
    const res = await axios.get(currentPage);
    setNextPage(res.data.next);
    setPrevPage(res.data.previous);
    getPokemon(res.data.results);
    setLoading(false);
  };

  const getPokemon = async (res) => {
    res.map(async (item) => {
      const result = await axios.get(item.url);
      setPokeData((state) => {
        state = [...state, result.data];
        state.sort((a, b) => (a.id > b.id ? 1 : -1));
        return state;
      });
    });
  };

  useEffect(() => {
    pokeFunction();
  }, [currentPage]);

  // Pagination
  function toNextPage() {
    setPokeData([]);
    setCurrentPage(nextPage);
  }

  function toPrevPage() {
    setPokeData([]);
    setCurrentPage(prevPage);
  }

  // Search
  const handleSearchChange = (e) => {
    setFilter(e.target.value);
  }

  return (
    <>
      <Search toNextPage={toNextPage} toPrevPage={toPrevPage} handleSearchChange={handleSearchChange} />
      <PokemonCard pokeData={pokeData} loading={loading} />
      <Pagination toNextPage={toNextPage} toPrevPage={toPrevPage} />
    </>
  );
}

export default Pokedex;
