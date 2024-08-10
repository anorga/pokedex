import { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "./Pagination";
import PokemonCard from "./PokemonCard";
import Search from "./Search";

function Pokedex() {
  const [pokeData, setPokeData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [nextPage, setNextPage] = useState();
  const [prevPage, setPrevPage] = useState();
  const [filter, setFilter] = useState("");

  const pokeFunction = async () => {
    setLoading(true);
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/?offset=${(currentPage - 1) * 20}&limit=20`);
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
    setCurrentPage(prevPage => prevPage + 1);
  }

  function toPrevPage() {
    if (currentPage > 1) {
      setPokeData([]);
      setCurrentPage(prevPage => prevPage - 1);
    }
  }

  // Search
  const handleSearchChange = (e) => {
    setFilter(e.target.value);
  }

  return (
    <>
      <Search 
        toNextPage={toNextPage} 
        toPrevPage={toPrevPage} 
        handleSearchChange={handleSearchChange} 
        currentPage={currentPage} 
      />
      <PokemonCard pokeData={pokeData} loading={loading} filter={filter} />
      <Pagination toNextPage={toNextPage} toPrevPage={toPrevPage} currentPage={currentPage} />
    </>
  );
}

export default Pokedex;