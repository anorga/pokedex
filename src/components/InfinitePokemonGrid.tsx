import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import type { Pokemon } from "../types/pokemon";
import PokemonCard from "./PokemonCard.tsx";
import PokemonGridCard from "./PokemonGridCard.tsx";

interface InfinitePokemonGridProps {
  items: Pokemon[];
  isLoading: boolean;
  isError: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

/** Column count mirroring the grid's responsive classes (sm/lg/xl). */
function useColumns(): number {
  const read = () => {
    if (window.matchMedia("(min-width: 1280px)").matches) return 5;
    if (window.matchMedia("(min-width: 1024px)").matches) return 4;
    if (window.matchMedia("(min-width: 640px)").matches) return 3;
    return 2;
  };
  const [cols, setCols] = useState(read);
  useEffect(() => {
    const onResize = () => setCols(read());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return cols;
}

/**
 * Window-scrolled, row-virtualized card grid with infinite loading: only the
 * rows near the viewport are in the DOM, and the next page is fetched shortly
 * before the user reaches the bottom.
 */
function InfinitePokemonGrid({
  items,
  isLoading,
  isError,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: InfinitePokemonGridProps) {
  const location = useLocation();
  const navigationType = useNavigationType();
  const from = `${location.pathname}${location.search}`;
  const cols = useColumns();

  // The browser can't restore scroll natively here: on back-navigation the
  // virtualized list (re)builds after the popstate, so Chrome finds a short
  // page and gives up. Record the offset continuously while browsing (by
  // unmount time the document has already shrunk and scrollY is clamped) and
  // re-apply it once items have rendered on a POP. Keyed by the query string
  // so each filter combination remembers its own position.
  const scrollKey = `pokedex:list-scroll:${location.search}`;
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        sessionStorage.setItem(scrollKey, String(window.scrollY));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [scrollKey]);

  const restoredRef = useRef(false);
  useEffect(() => {
    if (restoredRef.current || items.length === 0) return;
    restoredRef.current = true;
    if (navigationType !== "POP") return;
    const saved = Number(sessionStorage.getItem(scrollKey));
    if (saved > 0) window.scrollTo({ top: saved, behavior: "instant" });
  }, [items.length, navigationType, scrollKey]);

  // Distance from the document top to the list, so virtual row positions can
  // be translated into window scroll space.
  const listRef = useRef<HTMLDivElement>(null);
  const [listOffset, setListOffset] = useState(0);
  useLayoutEffect(() => {
    setListOffset(listRef.current?.offsetTop ?? 0);
  }, []);

  const rowCount = Math.ceil(items.length / cols);
  const virtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: () => 280,
    overscan: 4,
    scrollMargin: listOffset,
  });

  // Fetch the next page shortly before the sentinel enters the viewport.
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "600px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Loading, error, and empty states reuse the plain grid's presentation.
  if (isLoading || isError || items.length === 0) {
    return <PokemonCard pokemon={[]} isLoading={isLoading} isError={isError} />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div
        ref={listRef}
        className="relative mt-2"
        style={{ height: `${virtualizer.getTotalSize()}px` }}
      >
        {virtualizer.getVirtualItems().map((row) => (
          <div
            key={row.key}
            data-index={row.index}
            ref={virtualizer.measureElement}
            className="absolute inset-x-0 top-0 grid grid-cols-2 gap-4 pb-4 sm:grid-cols-3 sm:gap-5 sm:pb-5 lg:grid-cols-4 xl:grid-cols-5"
            style={{
              transform: `translateY(${row.start - virtualizer.options.scrollMargin}px)`,
            }}
          >
            {items
              .slice(row.index * cols, row.index * cols + cols)
              .map((p, i) => (
                <PokemonGridCard key={p.id} pokemon={p} from={from} index={i} />
              ))}
          </div>
        ))}
      </div>
      <div ref={sentinelRef} aria-hidden="true" />
      <p className="pb-10 pt-2 text-center text-sm text-slate-500 dark:text-slate-400">
        {isFetchingNextPage
          ? "Loading more…"
          : !hasNextPage
            ? "That's every Pokémon!"
            : ""}
      </p>
    </div>
  );
}

export default InfinitePokemonGrid;
