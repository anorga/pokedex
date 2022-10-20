import Nav from "./components/Nav";
import Pokedex from "./components/Pokedex";
import Pokemon from "./components/Pokemon";
import Search from "./components/Search";
import Footer from "./components/Footer";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Nav />
      {/* <Search /> */}
      <Routes>
        <Route index path="/" element={<Pokedex />} />
        <Route path=":pokemonId" element={<Pokemon />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
