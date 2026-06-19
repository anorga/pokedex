import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav.tsx";
import Pokedex from "./components/Pokedex.tsx";
import Pokemon from "./components/Pokemon.tsx";
import Footer from "./components/Footer.tsx";

function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route index path="/" element={<Pokedex />} />
        <Route path=":pokemonId" element={<Pokemon />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
