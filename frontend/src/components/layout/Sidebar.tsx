import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    Users,
    ShoppingCart,
    Boxes,
    Settings,
} from "lucide-react";

const links = [
    { to: "/",            icon: LayoutDashboard, label: "Dashboard"     },
    { to: "/productos",   icon: Package,          label: "Productos"     },
    { to: "/inventario",  icon: Boxes,            label: "Inventario"    },
    { to: "/clientes",    icon: Users,             label: "Clientes"      },
    { to: "/pedidos",     icon: ShoppingCart,      label: "Pedidos"       },
    { to: "/ajustes",     icon: Settings,          label: "Configuración" },
];

export default function Sidebar() {
    return (
        <aside className="w-64 h-screen bg-slate-900 text-white flex flex-col">

            <div className="p-6 border-b border-slate-700">
                <h1 className="text-3xl font-bold">
                    Commerzia
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {links.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === "/"}
                        className={({ isActive }) =>
                            [
                                "flex items-center gap-3 p-3 rounded-lg transition-colors",
                                isActive
                                    ? "bg-slate-700 text-white"
                                    : "hover:bg-slate-800 text-slate-300",
                            ].join(" ")
                        }
                    >
                        <Icon size={20} />
                        {label}
                    </NavLink>
                ))}
            </nav>

        </aside>
    );
}