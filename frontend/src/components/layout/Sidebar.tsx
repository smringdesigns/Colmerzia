import {
    LayoutDashboard,
    Package,
    Users,
    ShoppingCart,
    Boxes,
    Settings,
} from "lucide-react";

export default function Sidebar() {
    return (
        <aside className="w-64 h-screen bg-slate-900 text-white flex flex-col">

            <div className="p-6 border-b border-slate-700">
                <h1 className="text-3xl font-bold">
                    Commerzia
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">

                <a className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800">
                    <LayoutDashboard size={20} />
                    Dashboard
                </a>

                <a className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800">
                    <Package size={20} />
                    Productos
                </a>

                <a className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800">
                    <Boxes size={20} />
                    Inventario
                </a>

                <a className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800">
                    <Users size={20} />
                    Clientes
                </a>

                <a className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800">
                    <ShoppingCart size={20} />
                    Pedidos
                </a>

                <a className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800">
                    <Settings size={20} />
                    Configuración
                </a>

            </nav>

        </aside>
    );
}