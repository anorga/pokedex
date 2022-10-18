import "./App.css";
import Nav from "./components/Nav";
import Pokedex from "./components/Pokedex";
import Pokemon from "./components/Pokemon";
import { Routes, Route } from "react-router-dom";
import Example from "./components/Example";


function App() {
  return (
    <>
      <Nav />
      <Example />
      <Routes>
        <Route index path="/" element={<Pokedex />} />
        <Route path=":pokemonId" element={<Pokemon />} />
      </Routes>
    </>
  );
}

export default App;
