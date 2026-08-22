import { api } from "../../api/client";

// ==========================================
// Tipos e Interfaces
// ==========================================

export interface SocialLinks {
    facebook: string | null;
    instagram: string | null;
    tiktok: string | null;
    youtube: string | null;
    x: string | null;
}

export interface StoreSetting {
    id: number;
    store_id: number;
    contact_email: string | null;
    contact_phone: string | null;
    currency: string;
    timezone: string;
    logo_path: string | null;
    theme_colors: Record<string, string> | null;
    social_links: SocialLinks | null;
}

export interface Subscription {
    id: number;
    store_id: number;
    plan_slug: string;
    status: string;
    trial_ends_at: string | null;
    current_period_ends_at: string | null;
}

export interface Store {
    id: number;
    uuid: string;
    name: string;
    subdomain: string;
    custom_domain: string | null;
    business_type: string | null;
    is_active: boolean;
    settings?: StoreSetting;
    subscription?: Subscription;
    created_at: string;
}

export interface CreateStorePayload {
    name: string;
    subdomain: string;
    business_type: string;
}

export interface StoreResponse {
    success: boolean;
    message?: string;
    data: Store;
}

export interface UpdateStoreSettingsPayload {
    name?: string;
    contact_email?: string | null;
    contact_phone?: string | null;
    currency?: string;
    timezone?: string;
    logo_path?: string | null;
    theme_colors?: Record<string, string> | null;
    social_links?: SocialLinks | null;
}

// ==========================================
// Funciones
// ==========================================

export async function createStore(
    payload: CreateStorePayload
): Promise<StoreResponse> {
    const res = await api.post("/v1/stores", payload);

    return res.data;
}

export async function getMyStore(): Promise<StoreResponse> {
    const res = await api.get("/v1/settings/store");

    return res.data;
}

export async function updateStoreSettings(
    payload: UpdateStoreSettingsPayload
): Promise<StoreResponse> {
    const res = await api.put("/v1/settings/store", payload);

    return res.data;
}