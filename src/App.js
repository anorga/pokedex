import "./App.css";
import Nav from "./components/Nav";
import Pokedex from "./components/Pokedex";
import Pokemon from "./components/Pokemon";
import { Routes, Route } from "react-router-dom";


function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route index path="/" element={<Pokedex />} />
        <Route path=":pokemonId" element={<Pokemon />} />
      </Routes>
    </>
  );
}

export default App;
