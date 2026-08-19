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
 * Elimina una tienda de forma PERMANENTE, junto con todo lo que le
 * pertenece (usuarios, roles, categorías, productos, configuración,
 * suscripción). Úsalo solo para corregir errores de creación, no
 * para desactivar una tienda real — para eso existe is_active.
 */
export async function deletePlatformStore(id: number): Promise<void> {
    await api.delete(`/v1/platform/stores/${id}`);
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
 * Cambia el tenant activo del panel a la tienda indicada y te lleva
 * a su dashboard.
 *
 * Como super-admin, tu propio token de Sanctum sirve para operar
 * sobre cualquier tienda (ver Controller::currentStoreId en el
 * backend) — lo único que hace falta es que el frontend mande el
 * X-Tenant correcto. api/client.ts cae a este valor de localStorage
 * cuando no estás navegando por un subdominio real.
 *
 * Usamos window.location.href (navegación completa) en vez de
 * navigate() de react-router a propósito: necesitamos que TODO se
 * recargue desde cero —queries de TanStack Query, headers del
 * cliente axios, todo— para que el nuevo X-Tenant se aplique en
 * cada petición siguiente, no solo en la navegación.
 */
export function switchToStore(subdomain: string): void {
    localStorage.setItem("tenant_subdomain", subdomain);
    window.location.href = "/dashboard";
}

/**
 * Calcula la URL pública (storefront) de una tienda a partir de su
 * subdominio.
 *
 * Dev:  VITE_STOREFRONT_URL=http://localhost:5174 → http://{sub}.localhost:5174
 * Prod: VITE_STOREFRONT_URL=https://colmerzia.com → https://{sub}.colmerzia.com
 *
 * Si VITE_STOREFRONT_URL no está definida, cae al puerto de
 * desarrollo del storefront (5174) para no romper el entorno local.
 */
export function getStorefrontUrl(subdomain: string): string {
    const base = import.meta.env.VITE_STOREFRONT_URL ?? "http://colmerzia.localhost:5174";

    try {
        const url = new URL(base);
        const path = url.pathname === "/" ? "" : url.pathname;
        return `${url.protocol}//${subdomain}.${url.host}${path}`;
    } catch {
        return base;
    }
}

/**
 * Abre la tienda pública (storefront) de esa tienda en una pestaña
 * nueva — distinto de switchToStore(), que te lleva al PANEL
 * administrativo. Esto es lo que ve un cliente comprando ahí, sin
 * sesión ni panel.
 */
export function openStorefront(subdomain: string): void {
    window.open(getStorefrontUrl(subdomain), "_blank", "noopener,noreferrer");
}
