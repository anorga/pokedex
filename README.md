# Pokédex Web Application

A Pokémon Pokédex web application built with React 19, TypeScript, and Vite,
backed by data from the [PokéAPI](https://pokeapi.co/). Styling is handled with
Tailwind CSS v4 and routing with React Router. Data fetching, caching, and
search are powered by TanStack Query.

Hosted on: [https://pokedex-navy-delta.vercel.app](https://pokedex-navy-delta.vercel.app)

## Tech stack

- **React 19** + **TypeScript**
- **Vite** — dev server and build tooling
- **Tailwind CSS v4** — styling (via `@tailwindcss/vite`)
- **TanStack Query** — server-state fetching, caching, and search
- **React Router** — client-side routing
- **Vitest** + **Testing Library** — unit and component tests
- **ESLint** (flat config) + **Prettier** — linting and formatting

## Getting started

Install dependencies:

```bash
npm install
```

## Available scripts

### `npm run dev`

Starts the Vite dev server with hot module replacement at
[http://localhost:3000](http://localhost:3000).

### `npm run build`

Type-checks the project (`tsc -b`) and produces an optimized production build in
the `dist/` folder.

### `npm run preview`

Serves the production build locally for a final smoke test.

### `npm test`

Runs the test suite with Vitest.

### `npm run lint`

Lints the project with ESLint.

### `npm run format`

Formats the codebase with Prettier.

## Project structure

```
src/
  api/         PokéAPI client (native fetch)
  components/  UI components
  hooks/       TanStack Query hooks + utilities
  types/       Shared TypeScript types
  utils/       Small helpers
  main.tsx     App entry (providers + router)
```
