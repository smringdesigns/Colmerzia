import { create } from "zustand";
import type { Customer } from "../features/customer/customerApi";

const TOKEN_KEY = "token"; // misma clave que ya lee api/client.ts

interface CustomerAuthState {
    customer: Customer | null;
    isAuthenticated: boolean;
    setSession: (customer: Customer, token: string) => void;
    setCustomer: (customer: Customer) => void;
    clearSession: () => void;
}

export const useCustomerAuthStore = create<CustomerAuthState>((set) => ({
    customer: null,
    isAuthenticated: Boolean(localStorage.getItem(TOKEN_KEY)),

    setSession: (customer, token) => {
        localStorage.setItem(TOKEN_KEY, token);
        set({ customer, isAuthenticated: true });
    },

    setCustomer: (customer) => set({ customer, isAuthenticated: true }),

    clearSession: () => {
        localStorage.removeItem(TOKEN_KEY);
        set({ customer: null, isAuthenticated: false });
    },
}));
