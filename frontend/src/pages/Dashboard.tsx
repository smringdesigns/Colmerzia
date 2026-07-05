import { useQuery } from "@tanstack/react-query";
import { Package, ShoppingCart, TrendingUp, Users } from "lucide-react";

import { getCustomers } from "../features/customers/customersApi";
import { getProducts } from "../features/products/services/productsApi";

export default function Dashboard() {
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
            value: "—",
            caption: "Módulo en construcción",
            icon: ShoppingCart,
            tone: "green",
            muted: true,
        },
        {
            title: "Ventas",
            value: "—",
            caption: "Módulo en construcción",
            icon: TrendingUp,
            tone: "purple",
            muted: true,
        },
    ];

    return (
        <div className="dashboard-page">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">Overview</p>
                    <h1>Dashboard</h1>
                </div>
                <button className="primary-action" type="button">
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
                    <article
                        className={`stat-card${card.muted ? " stat-card-muted" : ""}`}
                        key={card.title}
                    >
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
                    <div className="empty-state">
                        El módulo de pedidos todavía no está conectado al backend.
                        En cuanto exista el endpoint de órdenes, esta tabla se llena sola.
                    </div>
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
