import type { Location } from "react-router-dom";

/**
 * History state carried into detail routes so "Back to Pokédex" can pop back
 * to the originating list (restoring its scroll/filters) in one step.
 */
export interface DetailNavState {
  /** The list URL the user started from. */
  from?: string;
  /** How many history entries back that list is. */
  depth?: number;
}

const LIST_PATHS = new Set(["/", "/favorites", "/compare"]);

/**
 * State to attach when pushing a detail route from `location`. Chains through
 * detail pages (incrementing depth), seeds from list pages, and stays
 * undefined when there is no list to return to (e.g. a direct URL visit).
 */
export function detailNavState(location: Location): DetailNavState | undefined {
  const state = location.state as DetailNavState | null;
  if (state?.from) {
    return { from: state.from, depth: (state.depth ?? 1) + 1 };
  }
  if (LIST_PATHS.has(location.pathname)) {
    return { from: `${location.pathname}${location.search}`, depth: 1 };
  }
  return undefined;
}
