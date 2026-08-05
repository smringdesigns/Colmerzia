import { create } from "zustand";

interface UIState {
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    toast: { message: string; tone: "success" | "error" } | null;
    showToast: (message: string, tone?: "success" | "error") => void;
    clearToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    isCartOpen: false,
    openCart: () => set({ isCartOpen: true }),
    closeCart: () => set({ isCartOpen: false }),
    toast: null,
    showToast: (message, tone = "success") => set({ toast: { message, tone } }),
    clearToast: () => set({ toast: null }),
}));
