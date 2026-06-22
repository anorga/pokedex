import { createContext } from "react";

export interface ToastAction {
  label: string;
  onAction: () => void;
}

export interface Toast {
  id: number;
  message: string;
  action?: ToastAction;
}

export interface ToastContextValue {
  addToast: (message: string, action?: ToastAction) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);
