import { useNavigate } from "react-router-dom";

const MAX_DEX_ID = 1025;

function DiceIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8" cy="8" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="16" cy="8" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="8" cy="16" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="16" cy="16" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function RandomButton() {
  const navigate = useNavigate();

  const goRandom = () => {
    const id = Math.floor(Math.random() * MAX_DEX_ID) + 1;
    navigate(`/${id}`);
  };

  return (
    <button
      type="button"
      onClick={goRandom}
      aria-label="Show a random Pokémon"
      title="Random Pokémon"
      className="rounded-full p-2 text-slate-300 transition-colors hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-600"
    >
      <DiceIcon className="h-5 w-5" />
    </button>
  );
}

export default RandomButton;
