import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import App from "./App.tsx";
import { FavoritesProvider } from "./context/FavoritesProvider.tsx";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Pokémon data is immutable, so never refetch within the persisted
      // window — served from memory, then localStorage, before the network.
      staleTime: Infinity,
      gcTime: 24 * 60 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
  key: "pokedex:query-cache",
});

// Injected by Vite — unique per build, so every deploy automatically discards
// stale persisted caches instead of serving mis-shaped data.
const CACHE_VERSION = __CACHE_BUSTER__;

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element #root not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 24 * 60 * 60 * 1000,
        buster: CACHE_VERSION,
      }}
    >
      <FavoritesProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </FavoritesProvider>
    </PersistQueryClientProvider>
  </StrictMode>,
);
