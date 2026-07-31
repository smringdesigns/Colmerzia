import type { OrderStatus, PaymentStatus, ShippingStatus } from "./ordersApi";

type Tone = "success" | "warning" | "danger" | "neutral" | "purple";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
    pending: "Pendiente",
    paid: "Pagado",
    processing: "Procesando",
    shipped: "Enviado",
    delivered: "Entregado",
    cancelled: "Cancelado",
    refunded: "Reembolsado",
};

export const ORDER_STATUS_TONES: Record<OrderStatus, Tone> = {
    pending: "neutral",
    paid: "success",
    processing: "warning",
    shipped: "purple",
    delivered: "success",
    cancelled: "danger",
    refunded: "danger",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
    pending: "Pendiente",
    paid: "Pagado",
    failed: "Fallido",
    refunded: "Reembolsado",
};

export const PAYMENT_STATUS_TONES: Record<PaymentStatus, Tone> = {
    pending: "neutral",
    paid: "success",
    failed: "danger",
    refunded: "danger",
};

export const SHIPPING_STATUS_LABELS: Record<ShippingStatus, string> = {
    pending: "Pendiente",
    preparing: "Preparando",
    shipped: "Enviado",
    delivered: "Entregado",
};

export const ORDER_STATUS_OPTIONS = Object.entries(ORDER_STATUS_LABELS) as [
    OrderStatus,
    string,
][];

export const PAYMENT_STATUS_OPTIONS = Object.entries(PAYMENT_STATUS_LABELS) as [
    PaymentStatus,
    string,
][];

export const SHIPPING_STATUS_OPTIONS = Object.entries(SHIPPING_STATUS_LABELS) as [
    ShippingStatus,
    string,
][];