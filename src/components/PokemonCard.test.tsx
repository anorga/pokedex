import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import PokemonCard from "./PokemonCard";
import { FavoritesProvider } from "../context/FavoritesProvider";
import { ToastProvider } from "../context/ToastProvider";
import type { Pokemon } from "../types/pokemon";

const bulbasaur: Pokemon = {
  id: 1,
  name: "bulbasaur",
  height: 7,
  weight: 69,
  types: [{ slot: 1, type: { name: "grass", url: "" } }],
  stats: [{ base_stat: 45, effort: 0, stat: { name: "hp", url: "" } }],
  abilities: [
    { ability: { name: "overgrow", url: "" }, is_hidden: false, slot: 1 },
  ],
};

function renderCard(props: Partial<Parameters<typeof PokemonCard>[0]> = {}) {
  return render(
    <MemoryRouter>
      <FavoritesProvider>
        <ToastProvider>
          <PokemonCard pokemon={[]} isLoading={false} {...props} />
        </ToastProvider>
      </FavoritesProvider>
    </MemoryRouter>,
  );
}

describe("PokemonCard", () => {
  it("shows skeleton placeholders while loading", () => {
    const { container } = renderCard({ isLoading: true });
    expect(container.querySelectorAll(".skeleton").length).toBeGreaterThan(0);
  });

  it("shows an empty state when there are no results", () => {
    renderCard({ pokemon: [] });
    expect(screen.getByText("No Pokémon found")).toBeInTheDocument();
  });

  it("renders a card per Pokemon with a link and type badge", () => {
    renderCard({ pokemon: [bulbasaur] });
    expect(screen.getByText("Bulbasaur")).toBeInTheDocument();
    expect(screen.getByText("#0001")).toBeInTheDocument();
    expect(screen.getByText("Grass")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/1");
  });
});
