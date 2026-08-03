import { api } from "../../api/client";

// ==========================================
// Tipos e Interfaces
// ==========================================

export interface StoreSetting {
    id: number;
    store_id: number;
    contact_email: string | null;
    contact_phone: string | null;
    currency: string;
    timezone: string;
    logo_path: string | null;
    theme_colors: any | null;
}

export interface Store {
    id: number;
    uuid: string;
    name: string;
    subdomain: string;
    custom_domain: string | null;
    is_active: boolean;
    settings?: StoreSetting; // La configuración que cargamos con 'load()'
    created_at: string;
}

export interface CreateStorePayload {
    name: string;
    subdomain: string;
}

export interface StoreResponse {
    success: boolean;
    message?: string;
    data: Store;
}

// ==========================================
// Funciones
// ==========================================

/**
 * Crea una nueva empresa/tienda en el proceso de Onboarding.
 */
export async function createStore(
    payload: CreateStorePayload
): Promise<StoreResponse> {
    const res = await api.post("/v1/stores", payload);
    return res.data;
}

/**
 * Obtiene la información de la tienda actual resolviendo el Header X-Tenant.
 */
export async function getMyStore(): Promise<StoreResponse> {
    const res = await api.get("/v1/stores/me");
    return res.data;
}