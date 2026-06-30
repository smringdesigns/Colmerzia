import { api } from "../../../api/client";

// ── Tipos ─────────────────────────────────────────────────

export interface Product {
    id: number;
    uuid: string;
    name: string;
    sku: string;
    price: string;
    compare_price: string | null;
    cost_price: string | null;
    stock: number;
    short_description: string | null;
    description: string | null;
    featured: boolean;
    is_active: boolean;
    category: { id: number; name: string } | null;
    brand:    { id: number; name: string } | null;
    created_at: string;
}

export interface ProductsResponse {
    data: Product[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface ProductPayload {
    name: string;
    sku: string;
    price: number;
    compare_price?: number | null;
    cost_price?: number | null;
    stock?: number;
    short_description?: string;
    description?: string;
    category_id?: number | null;
    brand_id?: number | null;
    featured?: boolean;
    is_active?: boolean;
}

// ── Funciones ─────────────────────────────────────────────

export async function getProducts(params?: {
    search?: string;
    is_active?: boolean;
    category_id?: number;
    page?: number;
    per_page?: number;
}): Promise<ProductsResponse> {
    const res = await api.get("/v1/products", { params });
    return res.data;
}

export async function getProduct(id: number): Promise<Product> {
    const res = await api.get(`/v1/products/${id}`);
    return res.data;
}

export async function createProduct(
    payload: ProductPayload
): Promise<Product> {
    const res = await api.post("/v1/products", payload);
    return res.data;
}

export async function updateProduct(
    id: number,
    payload: ProductPayload
): Promise<Product> {
    const res = await api.put(`/v1/products/${id}`, payload);
    return res.data;
}

export async function deleteProduct(id: number): Promise<void> {
    await api.delete(`/v1/products/${id}`);
}
