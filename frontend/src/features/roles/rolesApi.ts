import { api } from "../../api/client";

// ── Tipos ─────────────────────────────────────────────────

export interface RoleSummary {
    id: number;
    name: string;
    slug: string;
}

export interface PermissionSummary {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
}

export interface Role {
    id: number;
    uuid: string;
    name: string;
    slug: string;
    description: string | null;
    is_system: boolean;
    users_count?: number;
    permissions: PermissionSummary[];
    created_at: string;
}

export interface RolePayload {
    name: string;
    description?: string | null;
    permission_ids?: number[];
}

// Permisos agrupados por módulo: { products: [...], users: [...], ... }
export type GroupedPermissions = Record<string, PermissionSummary[]>;

// ── Funciones ─────────────────────────────────────────────

export async function getRoles(): Promise<Role[]> {
    const res = await api.get("/v1/roles");
    return res.data.data;
}

export async function createRole(payload: RolePayload): Promise<Role> {
    const res = await api.post("/v1/roles", payload);
    return res.data.data;
}

export async function updateRole(
    id: number,
    payload: Partial<RolePayload>
): Promise<Role> {
    const res = await api.put(`/v1/roles/${id}`, payload);
    return res.data.data;
}

export async function deleteRole(id: number): Promise<void> {
    await api.delete(`/v1/roles/${id}`);
}

export async function getPermissions(): Promise<GroupedPermissions> {
    const res = await api.get("/v1/permissions");
    return res.data.data;
}
