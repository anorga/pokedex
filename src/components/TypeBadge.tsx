import { typeColor } from "../utils/pokemonTypes";
import { capitalize } from "../utils/format";

interface TypeBadgeProps {
  type: string;
  size?: "sm" | "md";
}

function TypeBadge({ type, size = "sm" }: TypeBadgeProps) {
  const sizing =
    size === "md" ? "text-sm px-3.5 py-1.5" : "text-xs px-2.5 py-1";

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold uppercase tracking-wide text-white shadow-sm ${sizing}`}
      style={{ backgroundColor: typeColor(type) }}
    >
      {capitalize(type)}
    </span>
  );
}

export default TypeBadge;
