import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowDown, Search } from "lucide-react";

import { getCategories, getProducts } from "../features/catalog/catalogApi";
import { getStoreInfo } from "../features/store/storeApi";
import ProductCard from "../components/ProductCard";

export default function Home() {
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [search, setSearch] = useState("");

    const { data: store } = useQuery({
        queryKey: ["store-info"],
        queryFn: getStoreInfo,
        staleTime: 5 * 60 * 1000,
    });

    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    });

    const { data: products, isLoading } = useQuery({
        queryKey: ["products", categoryId, search],
        queryFn: () =>
            getProducts({
                category_id: categoryId ?? undefined,
                search: search || undefined,
            }),
    });

    const today = new Date().toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    return (
        <>
            {/* ---------------------------------------------------------
                Hero: un "ticket" de bienvenida, mismo lenguaje visual
                del recibo que cierra el carrito y el checkout.
            --------------------------------------------------------- */}
            <section className="hero-band px-5">
                <div className="receipt hero-ticket">
                    <div className="hero-ticket-eyebrow">
                        <span>{store?.name ?? "Tienda"}</span>
                        <span>{today}</span>
                    </div>

                    <h1 className="font-display">
                        Todo lo que buscas,
                        <br />a un clic de tu puerta.
                    </h1>

                    <p className="hero-ticket-tagline">
                        Catálogo completo, precios claros y pedidos que salen
                        el mismo día. Como comprarle a la tienda de la
                        esquina, pero desde donde estés.
                    </p>

                    <div className="receipt-divider" />

                    <div className="receipt-row">
                        <span>Productos disponibles</span>
                        <span>
                            {products ? products.total : "—"}
                        </span>
                    </div>

                    <a href="#catalogo" className="hero-ticket-cta">
                        Ver catálogo
                        <ArrowDown size={13} />
                    </a>
                </div>
            </section>

            <main id="catalogo" className="mx-auto max-w-6xl px-5 py-10">
                <div className="mb-8 flex flex-col gap-4 border-b border-[var(--color-line)] pb-8 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-ink-soft)]">
                            Catálogo
                        </p>
                        <h2 className="font-display text-3xl">Todos los productos</h2>
                    </div>

                    <label className="flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-white/50 px-4 py-2">
                        <Search size={15} className="text-[var(--color-ink-soft)]" />
                        <input
                            type="search"
                            placeholder="Buscar..."
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            className="bg-transparent text-sm outline-none"
                        />
                    </label>
                </div>

                {categories && categories.data.length > 0 && (
                    <div className="mb-8 flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => setCategoryId(null)}
                            className={`rounded-full border px-3 py-1 text-xs ${
                                categoryId === null
                                    ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-stone)]"
                                    : "border-[var(--color-line)]"
                            }`}
                        >
                            Todas
                        </button>
                        {categories.data.map((category) => (
                            <button
                                key={category.id}
                                type="button"
                                onClick={() => setCategoryId(category.id)}
                                className={`rounded-full border px-3 py-1 text-xs ${
                                    categoryId === category.id
                                        ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-stone)]"
                                        : "border-[var(--color-line)]"
                                }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                )}

                {isLoading && (
                    <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <div key={index} className="flex flex-col gap-3">
                                <div className="skeleton aspect-[4/5] w-full" />
                                <div className="skeleton h-4 w-3/4" />
                                <div className="skeleton h-3 w-1/2" />
                            </div>
                        ))}
                    </div>
                )}

                {!isLoading && products?.data.length === 0 && (
                    <p className="py-16 text-center text-sm text-[var(--color-ink-soft)]">
                        No encontramos productos con ese filtro.
                    </p>
                )}

                {!isLoading && products && products.data.length > 0 && (
                    <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
                        {products.data.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </main>
        </>
    );
}
