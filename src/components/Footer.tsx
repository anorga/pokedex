import pokeball from "../assets/pokeball.png";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white py-8 text-center dark:border-slate-800 dark:bg-slate-900">
      <p className="flex items-center justify-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300">
        <img src={pokeball} alt="" className="h-4 w-4" />
        <span>© {currentYear} Christian Anorga</span>
      </p>
      <p className="mt-1 text-xs text-slate-400">
        Data from{" "}
        <a
          href="https://pokeapi.co/"
          target="_blank"
          rel="noreferrer"
          className="underline transition-colors hover:text-slate-600 dark:hover:text-slate-200"
        >
          PokéAPI
        </a>
      </p>
    </footer>
  );
}

export default Footer;
