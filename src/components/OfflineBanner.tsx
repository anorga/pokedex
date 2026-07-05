import { useSyncExternalStore } from "react";

const subscribe = (callback: () => void) => {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
};

const useOnline = () =>
  useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );

/**
 * A slim banner under the nav while offline, so missing Pokémon read as
 * "not cached yet" rather than an app error. Cached data keeps working.
 */
function OfflineBanner() {
  const online = useOnline();
  if (online) return null;

  return (
    <div
      role="status"
      className="bg-amber-100 px-4 py-1.5 text-center text-sm font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-200"
    >
      You're offline — showing previously viewed Pokémon
    </div>
  );
}

export default OfflineBanner;
