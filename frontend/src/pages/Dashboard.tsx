import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
    Package,
    PackageX,
    ShoppingCart,
    TrendingUp,
    Truck,
    UserPlus,
    Users,
} from "lucide-react";

import { getCustomers } from "../features/customers/customersApi";
import { getProducts } from "../features/products/services/productsApi";
import { getOrders } from "../features/orders/ordersApi";
import { getSalesReport, getSalesYearly } from "../features/reports/reportsApi";
import { getActivity, type ActivityItem } from "../features/activity/activityApi";
import { relativeTime } from "../lib/relativeTime";
import SalesTrendChart from "../components/charts/SalesTrendChart";

function formatMoney(value: number | string) {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
    }).format(Number(value));
}

// Mes actual en formato YYYY-MM, tal como lo espera /v1/reports/sales.
function currentMonth() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

const ACTIVITY_ICONS: Record<ActivityItem["type"], typeof ShoppingCart> = {
    order_created: ShoppingCart,
    order_shipped: Truck,
    customer_created: UserPlus,
    low_stock: PackageX,
};

const ACTIVITY_TONES: Record<ActivityItem["type"], string> = {
    order_created: "purple",
    order_shipped: "blue",
    customer_created: "green",
    low_stock: "orange",
};

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

    const { data: salesReport, isLoading: loadingSales } = useQuery({
        queryFn: () => getSalesReport(month),
        queryKey: ["dashboard", "sales", month],
    });

    const { data: yearly, isLoading: loadingYearly } = useQuery({
        queryFn: getSalesYearly,
        queryKey: ["dashboard", "sales", "yearly"],
    });

    const { data: activity, isLoading: loadingActivity } = useQuery({
        queryFn: () => getActivity(8),
        queryKey: ["dashboard", "activity"],
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

            <section className="dashboard-grid single">
                <article className="panel-card">
                    <div className="panel-header">
                        <div>
                            <h2>Ventas de los últimos 12 meses</h2>
                            <p>Ingresos mensuales de pedidos pagados</p>
                        </div>
                    </div>

                    {loadingYearly && <div className="empty-state">Cargando...</div>}

                    {!loadingYearly && yearly && (
                        <SalesTrendChart months={yearly.months} />
                    )}
                </article>
            </section>

            <section className="dashboard-grid">
                <article className="panel-card">
                    <div className="panel-header">
                        <div>
                            <h2>Actividad reciente</h2>
                            <p>Pedidos, clientes e inventario</p>
                        </div>
                    </div>

                    {loadingActivity && (
                        <div className="empty-state">Cargando actividad...</div>
                    )}

                    {!loadingActivity && activity?.items.length === 0 && (
                        <div className="empty-state">Todavía no hay actividad reciente.</div>
                    )}

                    {!loadingActivity && activity && activity.items.length > 0 && (
                        <ul className="activity-feed">
                            {activity.items.map((item, index) => {
                                const Icon = ACTIVITY_ICONS[item.type];
                                return (
                                    <li
                                        key={`${item.type}-${index}`}
                                        onClick={() => navigate(item.url)}
                                    >
                                        <span className={`activity-icon ${ACTIVITY_TONES[item.type]}`}>
                                            <Icon size={16} />
                                        </span>
                                        <div>
                                            <p>{item.title}</p>
                                            <span>{item.subtitle}</span>
                                        </div>
                                        <time>{relativeTime(item.at)}</time>
                                    </li>
                                );
                            })}
                        </ul>
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
