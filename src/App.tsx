import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav.tsx";
import Pokedex from "./components/Pokedex.tsx";
import Pokemon from "./components/Pokemon.tsx";
import Favorites from "./components/Favorites.tsx";
import Compare from "./components/Compare.tsx";
import Footer from "./components/Footer.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";
import CommandPalette from "./components/CommandPalette.tsx";
import ProgressBar from "./components/ProgressBar.tsx";
import BackToTop from "./components/BackToTop.tsx";
import OfflineBanner from "./components/OfflineBanner.tsx";
import UpdatePrompt from "./components/UpdatePrompt.tsx";

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
      <ScrollToTop />
      <ProgressBar />
      <CommandPalette />
      <Nav />
      <OfflineBanner />
      <main className="flex-1">
        <ErrorBoundary>
          <Routes>
            <Route index path="/" element={<Pokedex />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/compare" element={<Compare />} />
            <Route path=":pokemonId" element={<Pokemon />} />
          </Routes>
        </ErrorBoundary>
      </main>
      <Footer />
      <BackToTop />
      <UpdatePrompt />
    </div>
  );
}

export default App;
