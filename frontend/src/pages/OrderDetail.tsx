import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import Panel from "../components/ui/Panel";
import { useToast } from "../components/ui/useToast";
import {
    getOrder,
    updateOrderStatus,
    type OrderStatus,
    type PaymentStatus,
    type ShippingStatus,
} from "../features/orders/ordersApi";
import {
    ORDER_STATUS_LABELS,
    ORDER_STATUS_OPTIONS,
    ORDER_STATUS_TONES,
    PAYMENT_STATUS_OPTIONS,
    SHIPPING_STATUS_OPTIONS,
} from "../features/orders/statusLabels";

function formatMoney(value: string) {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
    }).format(Number(value));
}

function formatDateTime(iso: string | null) {
    if (!iso) return "-";

    return new Date(iso).toLocaleString("es-CO", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function OrderDetail() {
    const { id } = useParams<{ id: string }>();
    const orderId = Number(id);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { notify } = useToast();

    const { data: order, isLoading, isError } = useQuery({
        queryKey: ["orders", orderId],
        queryFn: () => getOrder(orderId),
        enabled: Number.isFinite(orderId),
    });

    const [status, setStatus] = useState<OrderStatus | "">("");
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | "">("");
    const [shippingStatus, setShippingStatus] = useState<ShippingStatus | "">("");

    useEffect(() => {
        if (order) {
            setStatus(order.status);
            setPaymentStatus(order.payment_status);
            setShippingStatus(order.shipping_status);
        }
    }, [order]);

    const { mutate: save, isPending: isSaving } = useMutation({
        mutationFn: () =>
            updateOrderStatus(orderId, {
                status: status || undefined,
                payment_status: paymentStatus || undefined,
                shipping_status: shippingStatus || undefined,
            }),
        onSuccess: () => {
            notify({
                title: "Pedido actualizado",
                message: "El estado del pedido se guardó correctamente.",
                tone: "success",
            });
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
        onError: () => {
            notify({
                title: "Error al actualizar",
                message: "No se pudo actualizar el pedido. Intentalo nuevamente.",
                tone: "error",
            });
        },
    });

    if (isLoading) {
        return (
            <div className="resource-page">
                <div className="empty-state">Cargando pedido...</div>
            </div>
        );
    }

    if (isError || !order) {
        return (
            <div className="resource-page">
                <div className="empty-state danger">
                    No se pudo cargar el pedido. Puede que no exista o no tengas acceso.
                </div>
            </div>
        );
    }

    const hasChanges =
        status !== order.status ||
        paymentStatus !== order.payment_status ||
        shippingStatus !== order.shipping_status;

    return (
        <div className="form-page">
            <PageHeader
                eyebrow="Pedidos"
                title={order.order_number}
                subtitle={formatDateTime(order.created_at)}
                action={
                    <Button type="button" variant="secondary" onClick={() => navigate("/orders")}>
                        <ArrowLeft size={16} />
                        Volver
                    </Button>
                }
            />

            <div className="form-grid two">
                <Panel className="form-section">
                    <div className="form-section-heading">
                        <h2>Cliente</h2>
                    </div>
                    <p>
                        <strong>{order.customer_snapshot?.name ?? "Sin datos"}</strong>
                    </p>
                    {order.customer_snapshot?.email && <p>{order.customer_snapshot.email}</p>}
                    {order.customer_snapshot?.phone && <p>{order.customer_snapshot.phone}</p>}
                </Panel>

                <Panel className="form-section">
                    <div className="form-section-heading">
                        <h2>Dirección de envío</h2>
                    </div>
                    {order.shipping_address ? (
                        <>
                            <p>{order.shipping_address.line1}</p>
                            {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
                            <p>
                                {order.shipping_address.city}
                                {order.shipping_address.state ? `, ${order.shipping_address.state}` : ""}
                            </p>
                            <p>{order.shipping_address.country}</p>
                        </>
                    ) : (
                        <p>Sin dirección registrada.</p>
                    )}
                </Panel>
            </div>

            <Panel className="table-panel">
                <div className="form-section-heading">
                    <h2>Productos</h2>
                </div>
                <div className="windmill-table-wrap">
                    <table className="windmill-table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>SKU</th>
                                <th>Cantidad</th>
                                <th>Precio unitario</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items?.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.product_name}</td>
                                    <td>{item.product_sku ?? "-"}</td>
                                    <td>{item.quantity}</td>
                                    <td>{formatMoney(item.unit_price)}</td>
                                    <td>{formatMoney(item.total)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="order-totals">
                    <div>
                        <span>Subtotal</span>
                        <strong>{formatMoney(order.subtotal)}</strong>
                    </div>
                    <div>
                        <span>Descuento</span>
                        <strong>-{formatMoney(order.discount)}</strong>
                    </div>
                    <div>
                        <span>Envío</span>
                        <strong>{formatMoney(order.shipping)}</strong>
                    </div>
                    <div className="order-total-final">
                        <span>Total</span>
                        <strong>{formatMoney(order.total)}</strong>
                    </div>
                </div>
            </Panel>

            <Panel className="form-section">
                <div className="form-section-heading">
                    <h2>Estado del pedido</h2>
                    <p>
                        Estado actual: <Badge tone={ORDER_STATUS_TONES[order.status]}>{ORDER_STATUS_LABELS[order.status]}</Badge>
                    </p>
                </div>

                <div className="form-grid three">
                    <label className="ui-field">
                        <span>Estado del pedido</span>
                        <select
                            className="ui-select"
                            value={status}
                            onChange={(event) => setStatus(event.target.value as OrderStatus)}
                        >
                            {ORDER_STATUS_OPTIONS.map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="ui-field">
                        <span>Estado del pago</span>
                        <select
                            className="ui-select"
                            value={paymentStatus}
                            onChange={(event) => setPaymentStatus(event.target.value as PaymentStatus)}
                        >
                            {PAYMENT_STATUS_OPTIONS.map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="ui-field">
                        <span>Estado del envío</span>
                        <select
                            className="ui-select"
                            value={shippingStatus}
                            onChange={(event) => setShippingStatus(event.target.value as ShippingStatus)}
                        >
                            {SHIPPING_STATUS_OPTIONS.map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                {status === "cancelled" && order.status !== "cancelled" && (
                    <p className="form-warning">
                        Cancelar este pedido repondrá el stock de sus productos automáticamente.
                    </p>
                )}

                <div className="form-actions">
                    <Button
                        type="button"
                        disabled={!hasChanges || isSaving}
                        onClick={() => save()}
                    >
                        <Save size={16} />
                        {isSaving ? "Guardando..." : "Guardar cambios"}
                    </Button>
                </div>
            </Panel>
        </div>
    );
}
