import { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "./Pagination";
import PokemonCard from "./PokemonCard";
import Search from "./Search";

function Pokedex() {
  const [pokeData, setPokeData] = useState([]);
  const [allPokemon, setAllPokemon] = useState([]); // To store all Pokemon names for search
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [nextPage, setNextPage] = useState();
  const [prevPage, setPrevPage] = useState();
  const [filter, setFilter] = useState("");
  const [searchResults, setSearchResults] = useState([]); // To store search results
  const [isSearching, setIsSearching] = useState(false);

  // Fetch paginated Pokemon data
  const pokeFunction = async () => {
    setLoading(true);
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/?offset=${(currentPage - 1) * 20}&limit=20`);
    setNextPage(res.data.next);
    setPrevPage(res.data.previous);
    getPokemon(res.data.results);
    setLoading(false);
  };

  // Fetch details for a list of Pokemon
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

  // Fetch all Pokemon names for search on initial load
  const fetchAllPokemonNames = async () => {
    try {
      const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1500');
      setAllPokemon(response.data.results);
    } catch (error) {
      console.error("Error fetching all Pokemon:", error);
    }
  };

  // Search the global Pokemon API
  const searchPokemon = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    setLoading(true);
    setSearchResults([]);
    
    // Filter matching Pokemon names
    const matchingPokemon = allPokemon.filter(pokemon => 
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Fetch details for matching Pokemon
    const results = [];
    const fetchPromises = matchingPokemon.slice(0, 20).map(async (pokemon) => {
      try {
        const result = await axios.get(pokemon.url);
        return result.data;
      } catch (error) {
        console.error(`Error fetching details for ${pokemon.name}:`, error);
        return null;
      }
    });
    
    const fetchedResults = await Promise.all(fetchPromises);
    const validResults = fetchedResults.filter(result => result !== null);
    validResults.sort((a, b) => (a.id > b.id ? 1 : -1));
    setSearchResults(validResults);
    setLoading(false);
  };

  // Handle search input
  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setFilter(searchTerm);
    
    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      searchPokemon(searchTerm);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchPokemon(filter);
  };

  useEffect(() => {
    // Reset search when changing pages
    if (!isSearching) {
      pokeFunction();
    }
  }, [currentPage, isSearching]);

  useEffect(() => {
    // Fetch all Pokemon names once on component mount
    fetchAllPokemonNames();
  }, []);

  // Pagination
  function toNextPage() {
    setPokeData([]);
    setIsSearching(false);
    setCurrentPage(prevPage => prevPage + 1);
  }

  function toPrevPage() {
    if (currentPage > 1) {
      setPokeData([]);
      setIsSearching(false);
      setCurrentPage(prevPage => prevPage - 1);
    }
  }

  // Clear search and return to paginated view
  const clearSearch = () => {
    setFilter("");
    setIsSearching(false);
    setSearchResults([]);
  };

  return (
    <>
      <Search 
        toNextPage={toNextPage} 
        toPrevPage={toPrevPage} 
        handleSearchChange={handleSearchChange} 
        handleSearchSubmit={handleSearchSubmit}
        currentPage={currentPage}
        filter={filter}
        isSearching={isSearching}
        clearSearch={clearSearch}
      />
      <PokemonCard 
        pokeData={isSearching ? searchResults : pokeData} 
        loading={loading} 
        filter=""  // No need for filter here as we're filtering at API level
      />
      {!isSearching && (
        <Pagination toNextPage={toNextPage} toPrevPage={toPrevPage} currentPage={currentPage} />
      )}
    </>
  );
}

export default Pokedex;