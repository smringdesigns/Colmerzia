import { api } from "../../api/client";

export interface Customer {
    id: number;
    uuid: string;
    first_name: string;
    last_name: string;
    full_name: string;
    email: string;
    phone: string | null;
    created_at: string;
}

export interface CustomerAddress {
    id: number;
    uuid: string;
    label: string | null;
    recipient_name: string;
    phone: string | null;
    address_line_1: string;
    address_line_2: string | null;
    country: string | null;
    state: string | null;
    city: string;
    postal_code: string | null;
    is_shipping: boolean;
    is_billing: boolean;
    is_default: boolean;
    notes: string | null;
}

export interface RegisterPayload {
    first_name: string;
    last_name?: string;
    email: string;
    phone?: string;
    password: string;
    password_confirmation: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

interface AuthResponse {
    data: Customer;
    token: string;
}

export async function registerCustomer(payload: RegisterPayload): Promise<AuthResponse> {
    const res = await api.post("/v1/storefront/auth/register", payload);
    return res.data;
}

export async function loginCustomer(payload: LoginPayload): Promise<AuthResponse> {
    const res = await api.post("/v1/storefront/auth/login", payload);
    return res.data;
}

export async function logoutCustomer(): Promise<void> {
    await api.post("/v1/storefront/auth/logout");
}

export async function getCustomerMe(): Promise<Customer> {
    const res = await api.get("/v1/storefront/me");
    return res.data;
}

export async function getCustomerAddresses(): Promise<CustomerAddress[]> {
    const res = await api.get("/v1/storefront/addresses");
    return res.data;
}

export type SaveAddressPayload = Omit<CustomerAddress, "id" | "uuid">;

export async function createCustomerAddress(
    payload: SaveAddressPayload
): Promise<CustomerAddress> {
    const res = await api.post("/v1/storefront/addresses", payload);
    return res.data;
}

export async function updateCustomerAddress(
    id: number,
    payload: SaveAddressPayload
): Promise<CustomerAddress> {
    const res = await api.put(`/v1/storefront/addresses/${id}`, payload);
    return res.data;
}

export async function deleteCustomerAddress(id: number): Promise<void> {
    await api.delete(`/v1/storefront/addresses/${id}`);
}

/** Mensaje de error legible desde una respuesta de axios del backend. */
export function extractErrorMessage(error: unknown, fallback: string): string {
    if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response?.data
            ?.message === "string"
    ) {
        return (error as { response: { data: { message: string } } }).response.data.message;
    }

    return fallback;
}
