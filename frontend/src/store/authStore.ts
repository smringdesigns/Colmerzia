import { create } from "zustand";

import { queryClient } from "../lib/queryClient";

interface Role {
    id: number;
    name: string;
    slug: string;
}

interface Permission {
    id: number;
    name: string;
    slug: string;
}

interface Store {
    id: number;
    name: string;
    subdomain: string;
}

interface User {
    id: number;
    uuid: string;
    store_id: number;
    name: string;
    email: string;
    is_active: boolean;

    store?: Store | null;
    roles: Role[];
    permissions: Permission[];
}

interface AuthState {
    user: User | null;
    token: string | null;

    setUser: (user: User | null) => void;

    setToken: (token: string | null) => void;

    hasPermission: (permission: string) => boolean;

    hasRole: (role: string) => boolean;

    logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({

    user: null,

    token: localStorage.getItem("token"),

    setUser: (user) => set({ user }),

    setToken: (token) => {

        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
            localStorage.removeItem("tenant_subdomain");
        }

        set({ token });

    },

    hasPermission: (permission) => {

        const user = get().user;

        if (!user) {
            return false;
        }

        // El super-admin tiene acceso a todo
        const isSuperAdmin = user.roles.some(
            (role) => role.slug === "super-admin"
        );

        if (isSuperAdmin) {
            return true;
        }

        return user.permissions.some(
            (item) => item.slug === permission
        );

    },

    hasRole: (role) => {

        const user = get().user;

        if (!user) {
            return false;
        }

        return user.roles.some(
            (item) => item.slug === role
        );

    },

    logout: () => {

        localStorage.removeItem("token");
        localStorage.removeItem("tenant_subdomain");

        // Limpia todo el caché de TanStack Query. Sin esto, si otro
        // usuario (de otra tienda) inicia sesión en la misma pestaña
        // sin recargar la página, vería por unos segundos los datos
        // cacheados de la tienda anterior antes del refetch.
        queryClient.clear();

        set({
            user: null,
            token: null,
        });

    },

}));
