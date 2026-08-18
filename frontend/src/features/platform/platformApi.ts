import { api } from "../../api/client";


// ── Tipos ─────────────────────────────────────────────────

export interface PlatformStore {
    id: number;
    uuid: string;
    name: string;
    email: string | null;
    subdomain: string;
    custom_domain: string | null;
    business_type: string | null;
    is_active: boolean;
    is_verified: boolean;
    created_at: string;

    users_count?: number;
    products_count?: number;
    categories_count?: number;

    subscription?: {
        plan_slug: string;
        status: string;
        trial_ends_at: string | null;
        current_period_ends_at: string | null;
    } | null;

    settings?: {
        currency: string;
        timezone: string;
        logo_path: string | null;
    } | null;
}

export interface PlatformStoresResponse {
    data: PlatformStore[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface PlatformUser {
    id: number;
    uuid: string;
    store_id: number;
    name: string;
    email: string;
    is_active: boolean;
    last_login_at: string | null;
    created_at: string;
    store: { id: number; name: string; subdomain: string } | null;
    roles: { id: number; name: string; slug: string }[];
}

export interface PlatformUsersResponse {
    data: PlatformUser[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}


// ── Funciones ─────────────────────────────────────────────

export async function getPlatformStores(params?: {
    search?: string;
    business_type?: string;
    is_active?: boolean;
    page?: number;
    per_page?: number;
}): Promise<PlatformStoresResponse> {

    const res = await api.get("/v1/platform/stores", { params });

    return {
        data: res.data.data,
        current_page: res.data.meta?.current_page ?? res.data.current_page,
        last_page: res.data.meta?.last_page ?? res.data.last_page,
        per_page: res.data.meta?.per_page ?? res.data.per_page,
        total: res.data.meta?.total ?? res.data.total,
    };
}

export async function getPlatformStore(id: number): Promise<PlatformStore> {
    const res = await api.get(`/v1/platform/stores/${id}`);
    return res.data.data ?? res.data;
}

export async function getPlatformUsers(params?: {
    search?: string;
    store_id?: number;
    page?: number;
    per_page?: number;
}): Promise<PlatformUsersResponse> {

    const res = await api.get("/v1/platform/users", { params });

    return {
        data: res.data.data,
        current_page: res.data.meta?.current_page ?? res.data.current_page,
        last_page: res.data.meta?.last_page ?? res.data.last_page,
        per_page: res.data.meta?.per_page ?? res.data.per_page,
        total: res.data.meta?.total ?? res.data.total,
    };
}

/**
 * Elimina un usuario de forma PERMANENTE, sin importar la tienda a
 * la que pertenezca. A diferencia de deleteUser() (features/users),
 * esto no es soft-delete: libera el correo (único en toda la
 * plataforma) para poder volver a usarlo. Úsalo solo para corregir
 * errores reales, no como borrado rutinario de staff.
 */
export async function deletePlatformUser(id: number): Promise<void> {
    await api.delete(`/v1/platform/users/${id}`);
}

/**
 * Cambia el tenant activo del panel a la tienda indicada y recarga.
 *
 * Como super-admin, tu propio token de Sanctum sirve para operar
 * sobre cualquier tienda (ver Controller::currentStoreId en el
 * backend) — lo único que hace falta es que el frontend mande el
 * X-Tenant correcto. api/client.ts cae a este valor de localStorage
 * cuando no estás navegando por un subdominio real.
 */
export function switchToStore(subdomain: string): void {
    localStorage.setItem("tenant_subdomain", subdomain);
    window.location.reload();
}
