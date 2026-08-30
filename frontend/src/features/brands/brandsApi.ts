import { api } from "../../api/client";

export interface Brand {
    id: number;
    uuid: string;
    name: string;
    slug: string;
    description: string | null;
    logo: string | null;
    is_active: boolean;
    products_count?: number;
    created_at: string;
}

export interface BrandPayload {
    name: string;
    description?: string | null;
    logo?: string | null;
    is_active?: boolean;
}

// GET /v1/brands devuelve un array plano (sin envoltorio
// {"data": [...]}) -- mismo criterio que /v1/categories.
export async function getBrands(): Promise<Brand[]> {
    const res = await api.get("/v1/brands");
    return res.data;
}

export async function createBrand(payload: BrandPayload): Promise<Brand> {
    const res = await api.post("/v1/brands", payload);
    return res.data.data;
}

export async function updateBrand(id: number, payload: BrandPayload): Promise<Brand> {
    const res = await api.put(`/v1/brands/${id}`, payload);
    return res.data.data;
}

export async function deleteBrand(id: number): Promise<void> {
    await api.delete(`/v1/brands/${id}`);
}
