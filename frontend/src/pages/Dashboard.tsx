import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Package, ShoppingCart, TrendingUp, Users } from "lucide-react";

import Badge from "../components/ui/Badge";
import { getCustomers } from "../features/customers/customersApi";
import { getProducts } from "../features/products/services/productsApi";
import { getOrders } from "../features/orders/ordersApi";
import { getSalesReport } from "../features/reports/reportsApi";
import { ORDER_STATUS_LABELS, ORDER_STATUS_TONES } from "../features/orders/statusLabels";

function formatMoney(value: number | string) {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
    }).format(Number(value));
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("es-CO", {
        day: "numeric",
        month: "short",
    });
}

// Mes actual en formato YYYY-MM, tal como lo espera /v1/reports/sales.
function currentMonth() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export default function Dashboard() {
    const navigate = useNavigate();
    const month = currentMonth();

    // Pedimos per_page: 1 porque solo nos interesa el "total" que trae
    // la paginacion de Laravel, no la lista completa de registros.
    const { data: productsTotal, isLoading: loadingProductsTotal } = useQuery({
        queryFn: () => getProducts({ per_page: 1 }),
        queryKey: ["dashboard", "products", "total"],
    });

    const { data: productsActive, isLoading: loadingProductsActive } = useQuery({
        queryFn: () => getProducts({ is_active: true, per_page: 1 }),
        queryKey: ["dashboard", "products", "active"],
    });

    const { data: customersTotal, isLoading: loadingCustomersTotal } = useQuery({
        queryFn: () => getCustomers({ per_page: 1 }),
        queryKey: ["dashboard", "customers", "total"],
    });

    const { data: customersActive, isLoading: loadingCustomersActive } = useQuery({
        queryFn: () => getCustomers({ is_active: true, per_page: 1 }),
        queryKey: ["dashboard", "customers", "active"],
    });

    const { data: ordersTotal, isLoading: loadingOrdersTotal } = useQuery({
        queryFn: () => getOrders({ per_page: 1 }),
        queryKey: ["dashboard", "orders", "total"],
    });

    const { data: ordersPending, isLoading: loadingOrdersPending } = useQuery({
        queryFn: () => getOrders({ status: "pending", per_page: 1 }),
        queryKey: ["dashboard", "orders", "pending"],
    });

    const { data: recentOrders, isLoading: loadingRecentOrders } = useQuery({
        queryFn: () => getOrders({ per_page: 5 }),
        queryKey: ["dashboard", "orders", "recent"],
    });

    const { data: salesReport, isLoading: loadingSales } = useQuery({
        queryFn: () => getSalesReport(month),
        queryKey: ["dashboard", "sales", month],
    });

    const catalogHealth =
        productsTotal && productsTotal.total > 0
            ? Math.round(((productsActive?.total ?? 0) / productsTotal.total) * 100)
            : 0;

    const activeCustomersPct =
        customersTotal && customersTotal.total > 0
            ? Math.round(((customersActive?.total ?? 0) / customersTotal.total) * 100)
            : 0;

    const cards = [
        {
            title: "Productos",
            value: loadingProductsTotal ? "…" : String(productsTotal?.total ?? 0),
            caption: loadingProductsActive
                ? "Cargando..."
                : `${productsActive?.total ?? 0} activos`,
            icon: Package,
            tone: "orange",
        },
        {
            title: "Clientes",
            value: loadingCustomersTotal ? "…" : String(customersTotal?.total ?? 0),
            caption: loadingCustomersActive
                ? "Cargando..."
                : `${customersActive?.total ?? 0} activos`,
            icon: Users,
            tone: "blue",
        },
        {
            title: "Pedidos",
            value: loadingOrdersTotal ? "…" : String(ordersTotal?.total ?? 0),
            caption: loadingOrdersPending
                ? "Cargando..."
                : `${ordersPending?.total ?? 0} pendientes`,
            icon: ShoppingCart,
            tone: "green",
        },
        {
            title: "Ventas del mes",
            value: loadingSales ? "…" : formatMoney(salesReport?.summary.revenue ?? 0),
            caption: loadingSales
                ? "Cargando..."
                : `Ganancia: ${formatMoney(salesReport?.summary.profit ?? 0)}`,
            icon: TrendingUp,
            tone: "purple",
        },
    ];

    return (
        <div className="dashboard-page">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">Overview</p>
                    <h1>Dashboard</h1>
                </div>
                <button
                    className="primary-action"
                    type="button"
                    onClick={() => navigate("/reports/sales")}
                >
                    Generar informe
                </button>
            </div>

            <section className="welcome-panel">
                <div>
                    <p>Buenas tardes</p>
                    <h2>Esto es lo que está sucediendo con tu tienda hoy.</h2>
                </div>
                <span>Actualizado hace un momento</span>
            </section>

            <section className="stats-grid">
                {cards.map((card) => (
                    <article className="stat-card" key={card.title}>
                        <span className={`stat-icon ${card.tone}`}>
                            <card.icon size={22} />
                        </span>
                        <div>
                            <p>{card.title}</p>
                            <strong>{card.value}</strong>
                            <span>{card.caption}</span>
                        </div>
                    </article>
                ))}
            </section>

            <section className="dashboard-grid">
                <article className="panel-card">
                    <div className="panel-header">
                        <div>
                            <h2>Órdenes recientes</h2>
                            <p>Actividad comercial más reciente</p>
                        </div>
                    </div>

                    {loadingRecentOrders && (
                        <div className="empty-state">Cargando pedidos...</div>
                    )}

                    {!loadingRecentOrders && recentOrders?.data.length === 0 && (
                        <div className="empty-state">Todavía no hay pedidos.</div>
                    )}

                    {!loadingRecentOrders && recentOrders && recentOrders.data.length > 0 && (
                        <div className="windmill-table-wrap">
                            <table className="windmill-table">
                                <thead>
                                    <tr>
                                        <th>Pedido</th>
                                        <th>Cliente</th>
                                        <th>Fecha</th>
                                        <th>Estado</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.data.map((order) => (
                                        <tr
                                            key={order.id}
                                            onClick={() => navigate(`/orders/${order.id}`)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <td>{order.order_number}</td>
                                            <td>{order.customer_snapshot?.name ?? "—"}</td>
                                            <td>{formatDate(order.created_at)}</td>
                                            <td>
                                                <Badge tone={ORDER_STATUS_TONES[order.status]}>
                                                    {ORDER_STATUS_LABELS[order.status]}
                                                </Badge>
                                            </td>
                                            <td>{formatMoney(order.total)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </article>

                <article className="panel-card compact-panel">
                    <h2>Salud de la tienda</h2>
                    <div className="health-row">
                        <span>Productos activos sobre el total</span>
                        <strong>{catalogHealth}%</strong>
                    </div>
                    <div className="progress-track">
                        <span style={{ width: `${catalogHealth}%` }} />
                    </div>
                    <div className="health-row">
                        <span>Clientes activos sobre el total</span>
                        <strong>{activeCustomersPct}%</strong>
                    </div>
                    <div className="progress-track">
                        <span style={{ width: `${activeCustomersPct}%` }} />
                    </div>
                </article>
            </section>
        </div>
    );
}
