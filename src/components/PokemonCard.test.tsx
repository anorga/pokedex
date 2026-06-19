import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import PokemonCard from "./PokemonCard";
import type { Pokemon } from "../types/pokemon";

const bulbasaur: Pokemon = {
  id: 1,
  name: "bulbasaur",
  types: [{ slot: 1, type: { name: "grass", url: "" } }],
  stats: [{ base_stat: 45, effort: 0, stat: { name: "hp", url: "" } }],
};

function renderCard(props: Partial<Parameters<typeof PokemonCard>[0]> = {}) {
  return render(
    <MemoryRouter>
      <PokemonCard pokemon={[]} isLoading={false} {...props} />
    </MemoryRouter>,
  );
}

describe("PokemonCard", () => {
  it("shows a loading state", () => {
    renderCard({ isLoading: true });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows an empty state when there are no results", () => {
    renderCard({ pokemon: [] });
    expect(screen.getByText("No Pokémon found")).toBeInTheDocument();
  });

  it("renders a card per Pokemon with a link", () => {
    renderCard({ pokemon: [bulbasaur] });
    expect(screen.getByText("1. Bulbasaur")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/1");
  });
});
