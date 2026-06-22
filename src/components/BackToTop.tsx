import { useEffect, useState } from "react";
import { ChevronUpIcon } from "@heroicons/react/24/outline";

function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-[70] grid h-11 w-11 place-items-center rounded-full bg-slate-800 text-white shadow-lg transition-all duration-300 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600 ${
        show
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <ChevronUpIcon className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}

export default BackToTop;
