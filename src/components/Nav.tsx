import { Disclosure } from "@headlessui/react";
import {
  Bars3Icon,
  MoonIcon,
  SunIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";
import pokeball from "../assets/pokeball.png";
import { useTheme } from "../hooks/useTheme";
import { useFavorites } from "../hooks/useFavorites";

interface NavItem {
  name: string;
  to: string;
}

const navigation: NavItem[] = [
  { name: "Home", to: "/" },
  { name: "Favorites", to: "/favorites" },
];

function linkClasses({ isActive }: { isActive: boolean }): string {
  return [
    "rounded-md px-3 py-2 text-sm font-semibold transition-colors",
    isActive
      ? "bg-slate-700/60 text-white"
      : "text-slate-300 hover:bg-slate-700/40 hover:text-white",
  ].join(" ");
}

export default function Nav() {
  const { theme, toggleTheme } = useTheme();
  const { favorites } = useFavorites();

  return (
    <Disclosure
      as="nav"
      className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/95 backdrop-blur"
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-6xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-600">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>

              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <NavLink
                  to="/"
                  className="flex flex-shrink-0 items-center gap-2"
                >
                  <img className="h-9 w-auto" src={pokeball} alt="" />
                  <span className="font-display text-2xl tracking-wide text-white">
                    Pokédex
                  </span>
                </NavLink>
                <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-2">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.to}
                      className={linkClasses}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        {item.name}
                        {item.name === "Favorites" && favorites.length > 0 && (
                          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                            {favorites.length}
                          </span>
                        )}
                      </span>
                    </NavLink>
                  ))}
                </div>
              </div>

              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:pr-0">
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label={
                    theme === "dark"
                      ? "Switch to light mode"
                      : "Switch to dark mode"
                  }
                  className="rounded-full p-2 text-slate-300 transition-colors hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-600"
                >
                  {theme === "dark" ? (
                    <SunIcon className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <MoonIcon className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={NavLink}
                  to={item.to}
                  className={({ isActive }: { isActive: boolean }) =>
                    [
                      "block rounded-md px-3 py-2 text-base font-medium",
                      isActive
                        ? "bg-slate-700 text-white"
                        : "text-slate-300 hover:bg-slate-700 hover:text-white",
                    ].join(" ")
                  }
                >
                  {item.name}
                  {item.name === "Favorites" && favorites.length > 0
                    ? ` (${favorites.length})`
                    : ""}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
