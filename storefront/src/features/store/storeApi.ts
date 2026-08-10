import { api } from "../../api/client";

export interface StoreInfo {
    name: string;
    subdomain: string;
    logo_path: string | null;
    contact_email: string | null;
    contact_phone: string | null;
    currency: string;
}

export async function getStoreInfo(): Promise<StoreInfo> {
    const res = await api.get("/v1/storefront/store");
    return res.data.data;
}
