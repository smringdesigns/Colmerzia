import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
    Minus,
    Package,
    PackageX,
    ShoppingCart,
    TrendingDown,
    TrendingUp,
    Truck,
    UserPlus,
    Users,
} from "lucide-react";

import { getDashboardKpis } from "../features/dashboard/dashboardApi";
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

function TrendBadge({ trend }: { trend: number | null | undefined }) {
    if (trend === null || trend === undefined) {
        return <span className="trend-badge neutral">Nuevo</span>;
    }

    if (trend === 0) {
        return (
            <span className="trend-badge neutral">
                <Minus size={12} />
                0%
            </span>
        );
    }

    const isPositive = trend > 0;

    return (
        <span className={`trend-badge ${isPositive ? "positive" : "negative"}`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {isPositive ? "+" : ""}
            {trend}%
        </span>
    );
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

    const { data: kpis, isLoading: loadingKpis } = useQuery({
        queryFn: getDashboardKpis,
        queryKey: ["dashboard", "kpis"],
    });

    // Solo para la ganancia (kpis ya trae ingresos + variación) --
    // el desglose de costo/ganancia vive en SalesReportController,
    // no tiene sentido duplicar esa lógica acá.
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
        kpis && kpis.products.total > 0
            ? Math.round(((kpis.products.active ?? 0) / kpis.products.total) * 100)
            : 0;

    const activeCustomersPct =
        kpis && kpis.customers.total > 0
            ? Math.round(((kpis.customers.active ?? 0) / kpis.customers.total) * 100)
            : 0;

    const cards = [
        {
            title: "Productos",
            value: loadingKpis ? "…" : String(kpis?.products.total ?? 0),
            caption: loadingKpis ? "Cargando..." : `${kpis?.products.active ?? 0} activos`,
            trend: kpis?.products.trend,
            icon: Package,
            tone: "orange",
        },
        {
            title: "Clientes",
            value: loadingKpis ? "…" : String(kpis?.customers.total ?? 0),
            caption: loadingKpis ? "Cargando..." : `${kpis?.customers.active ?? 0} activos`,
            trend: kpis?.customers.trend,
            icon: Users,
            tone: "blue",
        },
        {
            title: "Pedidos",
            value: loadingKpis ? "…" : String(kpis?.orders.total ?? 0),
            caption: loadingKpis ? "Cargando..." : `${kpis?.orders.pending ?? 0} pendientes`,
            trend: kpis?.orders.trend,
            icon: ShoppingCart,
            tone: "green",
        },
        {
            title: "Ventas del mes",
            value: loadingKpis ? "…" : formatMoney(kpis?.revenue.this_month ?? 0),
            caption: loadingSales
                ? "Cargando..."
                : `Ganancia: ${formatMoney(salesReport?.summary.profit ?? 0)}`,
            trend: kpis?.revenue.trend,
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
                    <article className="kpi-card" key={card.title}>
                        <div className="kpi-card-top">
                            <span className={`stat-icon ${card.tone}`}>
                                <card.icon size={22} />
                            </span>
                            <TrendBadge trend={card.trend} />
                        </div>
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
