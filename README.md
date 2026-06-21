# Pokédex

A fast, installable Pokédex built with React 19, TypeScript, and Vite, powered by the [PokéAPI](https://pokeapi.co/).

**Live demo:** [pokedex-navy-delta.vercel.app](https://pokedex-navy-delta.vercel.app)

## Features

- Browse all 1,000+ Pokémon with paginated, cached loading
- Global search by name (debounced)
- Filter by type and generation, sort by number or name
- Command palette (`⌘K` / `Ctrl+K`) for quick jump
- Random Pokémon button
- Detail pages: stats (bars + radar chart), type matchups, evolution chain, abilities, flavor text, shiny toggle
- Compare up to 4 Pokémon side by side
- Favorites, saved locally
- Shareable, bookmarkable URLs for every view
- Light / dark mode
- Installable PWA with offline support

## Tech stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- TanStack Query (with localStorage persistence)
- React Router
- Vitest + Testing Library
- ESLint + Prettier

## Scripts

```bash
npm run dev      # start dev server (http://localhost:3000)
npm run build    # type-check + production build
npm run preview  # preview the production build
npm test         # run tests
npm run lint     # lint
npm run format   # format
```

## Project structure

```
src/
  api/         PokéAPI client
  components/  UI components
  context/     Favorites provider
  hooks/       Data + utility hooks
  types/       Shared types
  utils/       Helpers (formatting, types, generations, sort)
```
