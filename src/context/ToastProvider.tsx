import { useCallback, useMemo, useRef, useState } from "react";
import { ToastContext, type Toast, type ToastAction } from "./toast-context";

const DISMISS_MS = 3500;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, action?: ToastAction) => {
      const id = nextId.current++;
      setToasts((prev) => [...prev, { id, message, action }]);
      setTimeout(() => remove(id), DISMISS_MS);
    },
    [remove],
  );

  const value = useMemo(() => ({ addToast }), [addToast]);

  return (
    <ToastContext value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[80] flex flex-col items-center gap-2 px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="animate-fade-in pointer-events-auto flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            role="status"
          >
            <span>{toast.message}</span>
            {toast.action && (
              <button
                type="button"
                onClick={() => {
                  toast.action?.onAction();
                  remove(toast.id);
                }}
                className="font-semibold text-red-500 hover:text-red-600"
              >
                {toast.action.label}
              </button>
            )}
          </div>
        ))}
      </div>
    </ToastContext>
  );
}
