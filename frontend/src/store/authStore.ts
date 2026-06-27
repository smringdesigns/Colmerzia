import { create } from "zustand";

interface User {
    id: number;
    name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    token: string | null;

    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: localStorage.getItem("token"),

    setUser: (user) => set({ user }),

    setToken: (token) => {
        if (token) {
            localStorage.setItem("token", token);
        }

        set({ token });
    },

    logout: () => {
        localStorage.removeItem("token");

        set({
            user: null,
            token: null,
        });
    },
}));