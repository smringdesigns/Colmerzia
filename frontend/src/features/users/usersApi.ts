import { api } from "../../api/client";
import type { RoleSummary } from "../roles/rolesApi";

// ── Tipos ─────────────────────────────────────────────────

export interface StaffUser {
    id: number;
    uuid: string;
    store_id: number;
    name: string;
    email: string;
    is_active: boolean;
    last_login_at: string | null;
    roles: RoleSummary[];
    created_at: string;
}

export interface UsersResponse {
    data: StaffUser[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface UserPayload {
    name: string;
    email: string;
    password?: string;
    password_confirmation?: string;
    is_active?: boolean;
    role_ids?: number[];
}

// ── Funciones ─────────────────────────────────────────────

export async function getUsers(params?: {
    search?: string;
    is_active?: boolean;
    role?: string;
    page?: number;
    per_page?: number;
}): Promise<UsersResponse> {
    const res = await api.get("/v1/users", { params });

    return {
        data: res.data.data,
        current_page: res.data.meta.current_page,
        last_page: res.data.meta.last_page,
        per_page: res.data.meta.per_page,
        total: res.data.meta.total,
    };
}

export async function getUser(id: number): Promise<StaffUser> {
    const res = await api.get(`/v1/users/${id}`);
    return res.data.data;
}

export async function createUser(payload: UserPayload): Promise<StaffUser> {
    const res = await api.post("/v1/users", payload);
    return res.data.data;
}

export async function updateUser(
    id: number,
    payload: Partial<UserPayload>
): Promise<StaffUser> {
    const res = await api.put(`/v1/users/${id}`, payload);
    return res.data.data;
}

export async function deleteUser(id: number): Promise<void> {
    await api.delete(`/v1/users/${id}`);
}
