import { createContext } from "react";

export type ToastTone = "success" | "error" | "info";

export interface ToastInput {
    message: string;
    title: string;
    tone?: ToastTone;
}

export interface ToastContextValue {
    notify: (toast: ToastInput) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);
