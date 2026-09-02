import {
    LayoutDashboard,
    Package,
    FolderTree,
    Tag,
    Users,
    Warehouse,
    ShoppingCart,
    TrendingUp,
    Settings,
    Building2,
    Store,
    ExternalLink,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import { useAuthStore } from "../../store/authStore";
import { openStorefront } from "../../features/platform/platformApi";
import { LANDING_URL } from "../../lib/landingUrl";

const menu = [
    {
        name: "Dashboard",
        path: "/",
        icon: LayoutDashboard,
    },
    {
        name: "Productos",
        path: "/products",
        icon: Package,
    },
    {
        name: "Categorías",
        path: "/categories",
        icon: FolderTree,
    },
    {
        name: "Marcas",
        path: "/brands",
        icon: Tag,
    },
    {
        name: "Inventario",
        path: "/inventory",
        icon: Warehouse,
    },
    {
        name: "Clientes",
        path: "/customers",
        icon: Users,
    },
    {
        name: "Pedidos",
        path: "/orders",
        icon: ShoppingCart,
    },
    {
        name: "Ventas",
        path: "/reports/sales",
        icon: TrendingUp,
    },
    {
        name: "Configuración",
        path: "/settings",
        icon: Settings,
    },
];

export default function Sidebar() {
    const { hasRole, user } = useAuthStore();
    const isSuperAdmin = hasRole("super-admin");
    const subdomain = user?.store?.subdomain;

    return (
        <aside className="sidebar">
            <a
                href={LANDING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="sidebar-brand"
                title="Ir a colmerzia.com"
            >
                <div className="sidebar-logo">C</div>
                <div>
                    <h1>Colmerzia</h1>
                    <p>Panel Administrativo</p>
                </div>
            </a>

            <nav className="sidebar-nav">
                {menu.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            isActive ? "sidebar-link active" : "sidebar-link"
                        }
                    >
                        <item.icon size={18} />
                        <span>{item.name}</span>
                    </NavLink>
                ))}

                {isSuperAdmin && (
                    <NavLink
                        to="/admin"
                        className={({ isActive }) =>
                            isActive ? "sidebar-link active" : "sidebar-link"
                        }
                    >
                        <Building2 size={18} />
                        <span>Todas las tiendas</span>
                    </NavLink>
                )}
            </nav>

            {/*
                "Ver mi tienda" -- antes acá había solo un cuadro
                decorativo de bienvenida sin ninguna función. Un
                dueño de tienda nuevo no tenía NINGÚN lugar en todo
                el panel para encontrar el link público de su propia
                tienda (openStorefront/getStorefrontUrl ya existían
                en platformApi.ts, pero solo los usaba el panel de
                super-admin -- nunca estuvieron conectados acá).
            */}
            {subdomain && (
                <button
                    type="button"
                    className="sidebar-cta sidebar-cta-action"
                    onClick={() => openStorefront(subdomain)}
                >
                    <span className="sidebar-cta-icon">
                        <Store size={18} />
                    </span>
                    <span className="sidebar-cta-text">
                        <strong>Ver mi tienda</strong>
                        <span>{subdomain}.colmerzia.com</span>
                    </span>
                    <ExternalLink size={15} className="sidebar-cta-arrow" />
                </button>
            )}
        </aside>
    );
}
