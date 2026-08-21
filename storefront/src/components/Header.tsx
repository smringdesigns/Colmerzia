import { ShoppingBag, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { useCart } from "../features/cart/useCart";
import { useUIStore } from "../lib/uiStore";
import { useCustomerAuthStore } from "../lib/customerAuthStore";
import { getStoreInfo } from "../features/store/storeApi";

export default function Header() {
    const { cart } = useCart();
    const openCart = useUIStore((s) => s.openCart);

    const isAuthenticated = useCustomerAuthStore(
        (s) => s.isAuthenticated
    );
    const customer = useCustomerAuthStore((s) => s.customer);

    const { data: store } = useQuery({
        queryKey: ["store-info"],
        queryFn: getStoreInfo,
        staleTime: 5 * 60 * 1000,
    });

    const itemCount =
        cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

    return (
       <header className="sticky top-0 z-50 border-b border-[var(--color-line)] bg-[var(--color-stone)]/95 backdrop-blur">
            <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* Logo y nombre de la tienda */}
                <Link to="/" className="flex items-center gap-3">
                    {store?.logo_path && (
                        <img
                            src={store.logo_path}
                            alt={store?.name ?? "Logo"}
                            className="h-9 w-9 rounded-lg border border-[#e2e8f0] object-cover shadow-sm"
                        />
                    )}

                    {store?.name ? (
                        <span className="text-xl font-bold tracking-tight text-[#4648d4]">
                            {store.name}
                        </span>
                    ) : (
                        <span className="skeleton inline-block h-6 w-28 rounded bg-[#eaedff]" />
                    )}
                </Link>

                {/* Navegación central */}
                <nav className="hidden items-center gap-6 md:flex">
                    <Link
                        to="/"
                        className="text-sm font-semibold text-[#464554] transition hover:text-[#4648d4]"
                    >
                        Inicio
                    </Link>

                    <a
                        href="/#catalogo"
                        className="text-sm font-semibold text-[#464554] transition hover:text-[#4648d4]"
                    >
                        Catálogo
                    </a>
                </nav>

                {/* Acciones */}
                <div className="flex items-center gap-3">

                    {/* Cuenta */}
                    <Link
                        to={isAuthenticated ? "/cuenta" : "/login"}
                        className="flex items-center gap-2 rounded-full border border-[#c7c4d7] bg-[#faf8ff] px-4 py-2.5 text-sm font-semibold text-[#131b2e] shadow-sm transition hover:border-[#4648d4] hover:bg-[#4648d4] hover:text-white"
                    >
                        <User size={17} />

                        <span className="hidden sm:inline">
                            {isAuthenticated
                                ? (customer?.first_name ?? "Mi cuenta")
                                : "Ingresar"}
                        </span>
                    </Link>

                    {/* Carrito */}
                    <button
                        type="button"
                        onClick={openCart}
                        className="relative flex items-center gap-2 rounded-full border border-[#c7c4d7] bg-[#faf8ff] px-4 py-2.5 text-sm font-semibold text-[#131b2e] shadow-sm transition hover:border-[#4648d4] hover:bg-[#4648d4] hover:text-white"
                    >
                        <ShoppingBag size={17} />

                        <span>Carrito</span>

                        {itemCount > 0 && (
                            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ba1a1a] px-1 font-mono text-[11px] font-bold text-white shadow-sm">
                                {itemCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
}