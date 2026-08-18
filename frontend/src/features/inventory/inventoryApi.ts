import { api } from "../../api/client";


// ── Tipos ─────────────────────────────────────────────────

export interface InventoryItem {
    id: number;
    warehouse_id: number;
    product_id: number;
    product_variant_id: number | null;

    product_name: string;
    product_sku: string;
    variant_name: string | null;

    quantity: number;
    reserved: number;
    available: number;
    minimum: number;

    is_low_stock: boolean;
    last_movement_at: string | null;
}


export interface Warehouse {
    id: number;
    name: string;
    code: string;
    is_default: boolean;
}


export interface InventoryResponse {
    warehouse: Warehouse;

    data: InventoryItem[];

    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}


// ── Funciones ─────────────────────────────────────────────


// Obtener bodegas disponibles
export async function getWarehouses(): Promise<Warehouse[]> {

    const res = await api.get("/v1/warehouses");

    return res.data;
}


// Obtener inventario
export async function getInventory(params?: {
    search?: string;
    warehouse_id?: number;
    page?: number;
    per_page?: number;
}): Promise<InventoryResponse> {

    const res = await api.get("/v1/inventory", {
        params,
    });


    return {
        warehouse: res.data.warehouse,

        data: res.data.data,

        current_page: res.data.current_page,
        last_page: res.data.last_page,
        per_page: res.data.per_page,
        total: res.data.total,
    };
}