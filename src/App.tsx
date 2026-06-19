import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav.tsx";
import Pokedex from "./components/Pokedex.tsx";
import Pokemon from "./components/Pokemon.tsx";
import Favorites from "./components/Favorites.tsx";
import Footer from "./components/Footer.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
      <ScrollToTop />
      <Nav />
      <main className="flex-1">
        <ErrorBoundary>
          <Routes>
            <Route index path="/" element={<Pokedex />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path=":pokemonId" element={<Pokemon />} />
          </Routes>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}

export default App;
