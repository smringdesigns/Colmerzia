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
    const isAuthenticated = useCustomerAuthStore((s) => s.isAuthenticated);
    const customer = useCustomerAuthStore((s) => s.customer);

    const { data: store } = useQuery({
        queryKey: ["store-info"],
        queryFn: getStoreInfo,
        staleTime: 5 * 60 * 1000,
    });

    const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

    return (
        <header className="sticky top-0 z-30 border-b border-[var(--color-line)] bg-[var(--color-stone)]/95 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
                <Link to="/" className="flex items-center gap-2 font-display text-2xl">
                    {store?.logo_path && (
                        <img
                            src={store.logo_path}
                            alt=""
                            className="h-8 w-8 rounded-sm object-cover"
                        />
                    )}
                    {store?.name ?? (
                        <span className="skeleton inline-block h-6 w-28 align-middle" />
                    )}
                </Link>

                <div className="flex items-center gap-3">
                    <Link
                        to={isAuthenticated ? "/cuenta" : "/login"}
                        className="flex items-center gap-2 rounded-full border border-[var(--color-ink)] px-4 py-2 text-sm transition hover:bg-[var(--color-ink)] hover:text-[var(--color-stone)]"
                    >
                        <User size={16} />
                        {isAuthenticated ? (customer?.first_name ?? "Mi cuenta") : "Ingresar"}
                    </Link>

                    <button
                        type="button"
                        onClick={openCart}
                        className="relative flex items-center gap-2 rounded-full border border-[var(--color-ink)] px-4 py-2 text-sm transition hover:bg-[var(--color-ink)] hover:text-[var(--color-stone)]"
                    >
                        <ShoppingBag size={16} />
                        Carrito
                        {itemCount > 0 && (
                            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-ochre)] px-1 font-mono text-[11px] text-[var(--color-ink)]">
                                {itemCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
}
