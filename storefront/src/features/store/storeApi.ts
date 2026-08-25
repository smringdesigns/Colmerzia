import { api } from "../../api/client";

export interface StoreSocialLinks {
    facebook?: string | null;
    instagram?: string | null;
    tiktok?: string | null;
    youtube?: string | null;
    x?: string | null;
}

export interface StoreInfo {
    name: string;
    subdomain: string;
    logo_path: string | null;
    logo_url: string | null;
    contact_email: string | null;
    contact_phone: string | null;
    currency: string;
    social_links: StoreSocialLinks;
}

export async function getStoreInfo(): Promise<StoreInfo> {
    const res = await api.get("/v1/storefront/store");
    return res.data.data;
}