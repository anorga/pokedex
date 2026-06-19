import { PAGE_SIZE } from "../api/pokeapi";

function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-center px-4 pt-6 pb-2">
        <div className="skeleton h-28 w-28 rounded-full bg-slate-200 dark:bg-slate-700" />
      </div>
      <div className="flex flex-col items-center gap-2 px-3 pb-4 pt-2">
        <div className="skeleton h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="flex gap-1.5">
          <div className="skeleton h-5 w-12 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="skeleton h-5 w-12 rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
    </div>
  );
}

function PokemonCardSkeleton({ count = PAGE_SIZE }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </>
  );
}

export default PokemonCardSkeleton;
