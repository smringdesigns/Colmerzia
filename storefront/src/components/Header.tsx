import { useEffect, useState } from "react";
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

    const customer = useCustomerAuthStore(
        (s) => s.customer
    );

    const [scrolled, setScrolled] = useState(false);

    const { data: store } = useQuery({
        queryKey: ["store-info"],
        queryFn: getStoreInfo,
        staleTime: 5 * 60 * 1000,
    });

    /* =====================================================
       DETECTAR SCROLL
    ===================================================== */

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        handleScroll();

        window.addEventListener("scroll", handleScroll, {
            passive: true,
        });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const itemCount =
        cart?.items.reduce(
            (sum, item) => sum + item.quantity,
            0
        ) ?? 0;

    const firstName =
        customer?.first_name?.trim() || "Mi cuenta";

    return (
        <header
            className={`sticky top-0 z-50 border-b transition-all duration-300 ${
                scrolled
                    ? "border-[#e2e1eb]/50 bg-white/65 shadow-[0_4px_20px_rgba(35,35,60,0.04)] backdrop-blur-xl"
                    : "border-[#e2e1eb]/80 bg-white/90 shadow-[0_1px_12px_rgba(35,35,60,0.04)] backdrop-blur-xl"
            }`}
        >
            <div className="mx-auto flex h-[72px] w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* =====================================================
                    LOGO
                ===================================================== */}

                <Link
                    to="/"
                    className="group flex min-w-0 items-center gap-3"
                >
                    {store?.logo_path ? (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#e2e1eb] bg-[#faf8ff] transition group-hover:border-[#4648d4]/30">
                            <img
                                src={store.logo_path}
                                alt={store.name ?? "Logo"}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    ) : store?.name ? (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e9eaff] text-sm font-bold text-[#4648d4]">
                            {store.name.charAt(0).toUpperCase()}
                        </div>
                    ) : (
                        <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-[#eaedff]" />
                    )}

                    {store?.name ? (
                        <span className="max-w-[180px] truncate text-lg font-bold tracking-tight text-[#131b2e] transition group-hover:text-[#4648d4] sm:max-w-none sm:text-xl">
                            {store.name}
                        </span>
                    ) : (
                        <span className="skeleton inline-block h-6 w-28 rounded-lg bg-[#eaedff]" />
                    )}
                </Link>

                {/* =====================================================
                    NAVEGACIÓN
                ===================================================== */}

                <nav className="hidden items-center gap-1 md:flex">

                    <Link
                        to="/"
                        className="rounded-lg px-3.5 py-2 text-sm font-semibold text-[#464554] transition hover:bg-[#f7f7ff] hover:text-[#4648d4]"
                    >
                        Inicio
                    </Link>

                    <a
                        href="/#catalogo"
                        className="rounded-lg px-3.5 py-2 text-sm font-semibold text-[#464554] transition hover:bg-[#f7f7ff] hover:text-[#4648d4]"
                    >
                        Catálogo
                    </a>
                </nav>

                {/* =====================================================
                    ACCIONES
                ===================================================== */}

                <div className="flex items-center gap-2 sm:gap-3">

                    {/* Separador */}

                    <div className="mr-1 hidden h-7 w-px bg-[#e2e1eb] md:block" />

                    {/* =================================================
                        CUENTA
                    ================================================= */}

                    <Link
                        to={
                            isAuthenticated
                                ? "/cuenta"
                                : "/login"
                        }
                        className="group flex h-10 items-center gap-2 rounded-xl border border-[#e2e1eb] bg-white px-3 text-[#464554] shadow-[0_2px_8px_rgba(35,35,60,0.03)] transition hover:border-[#4648d4]/40 hover:bg-[#f7f7ff] hover:text-[#4648d4] sm:px-3.5"
                    >
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f0f0ff] text-[#4648d4] transition group-hover:bg-[#e9eaff]">
                            <User size={16} />
                        </span>

                        <span className="hidden text-sm font-semibold sm:inline">
                            {isAuthenticated
                                ? firstName
                                : "Ingresar"}
                        </span>
                    </Link>

                    {/* =================================================
                        CARRITO
                    ================================================= */}

                    <button
                        type="button"
                        onClick={openCart}
                        aria-label={`Carrito${
                            itemCount > 0
                                ? `, ${itemCount} productos`
                                : ""
                        }`}
                        className="group relative flex h-10 items-center gap-2 rounded-xl border border-[#e2e1eb] bg-white px-3 text-[#464554] shadow-[0_2px_8px_rgba(35,35,60,0.03)] transition hover:border-[#4648d4]/40 hover:bg-[#f7f7ff] hover:text-[#4648d4] sm:px-3.5"
                    >
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f0f0ff] text-[#4648d4] transition group-hover:bg-[#e9eaff]">
                            <ShoppingBag size={16} />
                        </span>

                        <span className="hidden text-sm font-semibold sm:inline">
                            Carrito
                        </span>

                        {itemCount > 0 && (
                            <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#4648d4] px-1.5 font-mono text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                                {itemCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
}