import { api } from "../../api/client";

// Tipos

export type OrderStatus =
    | "pending"
    | "paid"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type ShippingStatus = "pending" | "preparing" | "shipped" | "delivered";

export interface OrderItem {
    id: number;
    product_id: number;
    product_variant_id: number | null;
    product_name: string;
    product_sku: string | null;
    quantity: number;
    unit_price: string;
    discount: string;
    total: string;
}

export interface CustomerSnapshot {
    name: string;
    email: string;
    phone?: string;
}

export interface ShippingAddress {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    country: string;
    postal_code?: string;
}

export interface Order {
    id: number;
    order_number: string;
    status: OrderStatus;
    payment_status: PaymentStatus;
    shipping_status: ShippingStatus;
    customer_id: number | null;
    customer_snapshot: CustomerSnapshot | null;
    shipping_address: ShippingAddress | null;
    notes: string | null;
    subtotal: string;
    discount: string;
    tax: string;
    shipping: string;
    total: string;
    items?: OrderItem[];
    paid_at: string | null;
    shipped_at: string | null;
    delivered_at: string | null;
    created_at: string;
}

export interface OrdersResponse {
    data: Order[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface UpdateOrderStatusPayload {
    status?: OrderStatus;
    payment_status?: PaymentStatus;
    shipping_status?: ShippingStatus;
}

// Funciones

export async function getOrders(params?: {
    search?: string;
    status?: OrderStatus;
    payment_status?: PaymentStatus;
    page?: number;
    per_page?: number;
}): Promise<OrdersResponse> {
    const res = await api.get("/v1/orders", { params });
    return res.data;
}

export async function getOrder(id: number): Promise<Order> {
    const res = await api.get(`/v1/orders/${id}`);
    return res.data;
}

export async function updateOrderStatus(
    id: number,
    payload: UpdateOrderStatusPayload
): Promise<Order> {
    const res = await api.patch(`/v1/orders/${id}/status`, payload);
    return res.data;
}