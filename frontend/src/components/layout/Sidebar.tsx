import {
    LayoutDashboard,
    Package,
    Users,
    Warehouse,
    ShoppingCart,
    Settings,
} from "lucide-react";

import { NavLink } from "react-router-dom";

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
        name: "Configuración",
        path: "/settings",
        icon: Settings,
    },
];

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="sidebar-logo">C</div>
                <div>
                    <h1>Colmerzia</h1>
                    <p>Panel Administrativo</p>
                </div>
            </div>

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
            </nav>

            <div className="sidebar-cta">
                <strong>Bienvenido a Colmerzia</strong>
                <span>Administra productos, pedidos y usuarios desde un solo lugar.</span>
            </div>
        </aside>
    );
}
