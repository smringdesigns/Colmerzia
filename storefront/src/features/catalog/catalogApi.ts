import { api } from "../../api/client";

export interface CategorySummary {
    id: number;
    name: string;
    slug: string;
    image: string | null;
}

export interface ProductListItem {
    id: number;
    name: string;
    slug: string;
    short_description: string | null;
    price: string;
    compare_price: string | null;
    has_variants: boolean;
    in_stock: boolean;
    image: string | null;
    category: { id: number; name: string; slug: string } | null;
}

export interface ProductVariant {
    id: number;
    name: string;
    sku: string | null;
    attributes: Record<string, string> | null;
    price: string;
    compare_price: string | null;
    in_stock: boolean;
}

export interface ProductImage {
    id: number;
    path: string;
    alt: string | null;
    is_primary: boolean;
}

export interface ProductDetail {
    id: number;
    name: string;
    slug: string;
    short_description: string | null;
    description: string | null;
    price: string;
    compare_price: string | null;
    has_variants: boolean;
    stock: number | null;
    in_stock: boolean;
    images: ProductImage[];
    variants?: ProductVariant[];
    category: { id: number; name: string; slug: string } | null;
    brand: { id: number; name: string } | null;
}

export interface ProductsResponse {
    data: ProductListItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export async function getProducts(params?: {
    search?: string;
    category_id?: number;
    page?: number;
}): Promise<ProductsResponse> {
    const res = await api.get("/v1/storefront/products", { params });
    return res.data;
}

export async function getProduct(slug: string): Promise<ProductDetail> {
    const res = await api.get(`/v1/storefront/products/${slug}`);
    return res.data;
}

export async function getCategories(): Promise<{ data: CategorySummary[] }> {
    const res = await api.get("/v1/storefront/categories");
    return res.data;
}
