import { api } from "../../api/client";

export interface CartItem {
    id: number;
    product_id: number;
    product_variant_id: number | null;
    product_name: string | null;
    variant_name: string | null;
    quantity: number;
    unit_price: string;
    compare_price: string | null;
    total: string;
}

export interface Cart {
    guest_token: string;
    status: string;
    items: CartItem[];
    coupon_code: string | null;
    subtotal: string;
    discount: string;
    tax: string;
    shipping: string;
    total: string;
}

export interface CheckoutPayload {
    customer: {
        name: string;
        email: string;
        phone?: string;
    };
    shipping_address: {
        line1: string;
        line2?: string;
        city: string;
        state?: string;
        country: string;
        postal_code?: string;
    };
}

export interface OrderConfirmation {
    order_number: string;
    status: string;
    payment_status: string;
    shipping_status: string;
    subtotal: string;
    discount: string;
    tax: string;
    shipping: string;
    total: string;
    items: {
        product_name: string;
        product_sku: string | null;
        quantity: number;
        unit_price: string;
        total: string;
    }[];
}

export async function getCart(): Promise<Cart> {
    const res = await api.get("/v1/storefront/cart");
    return res.data;
}

export async function addCartItem(
    productId: number,
    quantity: number,
    productVariantId?: number
): Promise<Cart> {
    const res = await api.post("/v1/storefront/cart/items", {
        product_id: productId,
        product_variant_id: productVariantId,
        quantity,
    });
    return res.data;
}

export async function updateCartItem(itemId: number, quantity: number): Promise<Cart> {
    const res = await api.patch(`/v1/storefront/cart/items/${itemId}`, { quantity });
    return res.data;
}

export async function removeCartItem(itemId: number): Promise<Cart> {
    const res = await api.delete(`/v1/storefront/cart/items/${itemId}`);
    return res.data;
}

export async function applyCoupon(code: string): Promise<Cart> {
    const res = await api.post("/v1/storefront/cart/coupon", { code });
    return res.data;
}

export async function removeCoupon(): Promise<Cart> {
    const res = await api.delete("/v1/storefront/cart/coupon");
    return res.data;
}

export async function checkout(payload: CheckoutPayload): Promise<OrderConfirmation> {
    const res = await api.post("/v1/storefront/checkout", payload);
    return res.data;
}

/** Mensaje de error legible desde una respuesta de axios del backend. */
export function extractErrorMessage(error: unknown, fallback: string): string {
    if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response?.data
            ?.message === "string"
    ) {
        return (error as { response: { data: { message: string } } }).response.data.message;
    }

    return fallback;
}
