import { api } from "../../api/client";

export interface Category {
    id: number;
    uuid: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    is_active: boolean;
    sort_order: number;
    parent_id: number | null;
    parent?: { id: number; name: string } | null;
    products_count?: number;
    created_at: string;
}

export interface CategoryPayload {
    name: string;
    description?: string | null;
    parent_id?: number | null;
    image?: string | null;
    is_active?: boolean;
    sort_order?: number;
}

// GET /v1/categories devuelve un array plano (sin envoltorio
// {"data": [...]}), a diferencia de otros endpoints -- ver
// CategoryController::index en el backend.
export async function getCategories(): Promise<Category[]> {
    const res = await api.get("/v1/categories");
    return res.data;
}

export async function createCategory(payload: CategoryPayload): Promise<Category> {
    const res = await api.post("/v1/categories", payload);
    return res.data.data;
}

export async function updateCategory(
    id: number,
    payload: CategoryPayload
): Promise<Category> {
    const res = await api.put(`/v1/categories/${id}`, payload);
    return res.data.data;
}

export async function deleteCategory(id: number): Promise<void> {
    await api.delete(`/v1/categories/${id}`);
}
