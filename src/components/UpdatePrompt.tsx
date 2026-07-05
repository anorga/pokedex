import { useRegisterSW } from "virtual:pwa-register/react";

/**
 * Floating banner when a new build's service worker is waiting, offering a
 * one-click refresh instead of silently updating mid-session.
 */
function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!needRefresh) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-4 right-4 z-[90] flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-xl dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
    >
      <span>A new version is available</span>
      <button
        type="button"
        onClick={() => void updateServiceWorker(true)}
        className="font-semibold text-red-500 hover:text-red-600"
      >
        Refresh
      </button>
      <button
        type="button"
        onClick={() => setNeedRefresh(false)}
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
      >
        Later
      </button>
    </div>
  );
}

export default UpdatePrompt;
