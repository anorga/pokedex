import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { useFavorites } from "../hooks/useFavorites";

interface FavoriteButtonProps {
  id: number;
  className?: string;
  /** Tailwind size classes for the icon, e.g. "h-6 w-6". */
  iconClass?: string;
}

function FavoriteButton({
  id,
  className = "",
  iconClass = "h-6 w-6",
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(id);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(id);
      }}
      className={`grid place-items-center rounded-full bg-white/80 p-1.5 text-red-500 shadow-sm backdrop-blur-sm transition-transform hover:scale-110 dark:bg-slate-900/70 ${className}`}
    >
      {active ? (
        <HeartSolid className={iconClass} aria-hidden="true" />
      ) : (
        <HeartOutline
          className={`${iconClass} text-slate-400 dark:text-slate-300`}
          aria-hidden="true"
        />
      )}
    </button>
  );
}

export default FavoriteButton;
