import { api } from "../../api/client";

// Tipos

export interface Customer {
    id: number;
    uuid: string;
    first_name: string;
    last_name: string | null;
    email: string;
    phone: string | null;
    document_type: string | null;
    document_number: string | null;
    company: string | null;
    birth_date: string | null;
    notes: string | null;
    is_active: boolean;
    orders_count: number;
    created_at: string;
}

export interface CustomersResponse {
    data: Customer[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface CustomerPayload {
    first_name: string;
    last_name?: string;
    email: string;
    phone?: string;
    document_type?: string;
    document_number?: string;
    company?: string;
    birth_date?: string;
    notes?: string;
    is_active?: boolean;
}

// Funciones

export async function getCustomers(params?: {
    search?: string;
    is_active?: boolean;
    page?: number;
    per_page?: number;
}): Promise<CustomersResponse> {
    const res = await api.get("/v1/customers", { params });
    return res.data;
}

export async function getCustomer(id: number): Promise<Customer> {
    const res = await api.get(`/v1/customers/${id}`);
    return res.data;
}

export async function createCustomer(
    payload: CustomerPayload
): Promise<Customer> {
    const res = await api.post("/v1/customers", payload);
    return res.data;
}

export async function updateCustomer(
    id: number,
    payload: CustomerPayload
): Promise<Customer> {
    const res = await api.put(`/v1/customers/${id}`, payload);
    return res.data;
}

export async function deleteCustomer(id: number): Promise<void> {
    await api.delete(`/v1/customers/${id}`);
}
