import { create } from "zustand";

export interface User {
    id: number;
    name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;

    setUser: (user: User) => void;
    setToken: (token: string) => void;
    login: (user: User, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: localStorage.getItem("token"),
    isAuthenticated: !!localStorage.getItem("token"),

    setUser: (user) =>
        set({
            user,
        }),

    setToken: (token) =>
        set({
            token,
            isAuthenticated: true,
        }),

    login: (user, token) => {
        localStorage.setItem("token", token);

        set({
            user,
            token,
            isAuthenticated: true,
        });
    },

    logout: () => {
        localStorage.removeItem("token");

        set({
            user: null,
            token: null,
            isAuthenticated: false,
        });
    },
}));