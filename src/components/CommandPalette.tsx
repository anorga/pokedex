import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { pokemonId } from "../api/pokeapi";
import { usePokemonIndex } from "../hooks/usePokemon";
import type { NamedApiResource } from "../types/pokemon";
import { capitalize, formatDexId } from "../utils/format";

export const OPEN_COMMAND_PALETTE = "open-command-palette";

function CommandPalette() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { data: index } = usePokemonIndex();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(OPEN_COMMAND_PALETTE, onOpen);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(OPEN_COMMAND_PALETTE, onOpen);
    };
  }, []);

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  const matches: NamedApiResource[] = query.trim()
    ? (index ?? [])
        .filter((e) =>
          e.name.toLowerCase().includes(query.trim().toLowerCase()),
        )
        .slice(0, 8)
    : [];

  return (
    <Dialog open={open} onClose={close} className="relative z-[60]">
      <DialogBackdrop className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" />
      <div className="fixed inset-0 overflow-y-auto p-4 pt-[12vh]">
        <DialogPanel className="mx-auto max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">
          <Combobox
            onChange={(entry: NamedApiResource | null) => {
              if (!entry) return;
              navigate(`/${pokemonId(entry)}`);
              close();
            }}
          >
            <div className="flex items-center gap-2 border-b border-slate-200 px-4 dark:border-slate-700">
              <MagnifyingGlassIcon className="h-5 w-5 shrink-0 text-slate-400" />
              <ComboboxInput
                autoFocus
                className="w-full bg-transparent py-3.5 text-base text-slate-800 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
                placeholder="Search Pokémon…"
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            {matches.length > 0 && (
              <ComboboxOptions static className="max-h-72 overflow-y-auto py-2">
                {matches.map((entry) => (
                  <ComboboxOption
                    key={entry.name}
                    value={entry}
                    className="flex cursor-pointer items-center justify-between px-4 py-2 text-slate-700 data-[focus]:bg-slate-100 dark:text-slate-200 dark:data-[focus]:bg-slate-700"
                  >
                    <span className="font-medium">
                      {capitalize(entry.name)}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      {formatDexId(pokemonId(entry))}
                    </span>
                  </ComboboxOption>
                ))}
              </ComboboxOptions>
            )}
            {query.trim() && matches.length === 0 && (
              <p className="px-4 py-6 text-center text-sm text-slate-400">
                No Pokémon found
              </p>
            )}
          </Combobox>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default CommandPalette;
