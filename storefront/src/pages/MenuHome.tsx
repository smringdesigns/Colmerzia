import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";

import { getCategories, getProducts } from "../features/catalog/catalogApi";
import type { ProductListItem } from "../features/catalog/catalogApi";
import { getStoreInfo } from "../features/store/storeApi";
import { useCart } from "../features/cart/useCart";
import { formatMoney } from "../lib/money";

/**
 * Home para negocios con storefront_layout = "menu" (restaurantes).
 *
 * Se diferencia de CatalogHome a propósito en la estructura, no solo
 * en el color: acá no hay grilla de tarjetas ni "categorías
 * destacadas" como banners — un menú se lee de arriba a abajo, por
 * secciones, como una carta real. La navegación es de anclas
 * (saltar a "Entradas", "Platos fuertes", etc.), y cada plato es una
 * fila compacta (foto chica + nombre + descripción + precio), no una
 * tarjeta grande — así entran muchos más ítems sin scroll infinito.
 */
export default function MenuHome() {
    const [search, setSearch] = useState("");
    const { addItem } = useCart();

    const { data: store } = useQuery({
        queryKey: ["store-info"],
        queryFn: getStoreInfo,
        staleTime: 5 * 60 * 1000,
    });

    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
        staleTime: 5 * 60 * 1000,
    });

    // Traemos todo el menú de una — no tiene sentido paginar una
    // carta de restaurante como si fuera un catálogo de 500 SKUs.
    const { data: products, isLoading } = useQuery({
        queryKey: ["products", "menu", search],
        queryFn: () => getProducts({ search: search || undefined, per_page: 60 }),
    });

    const sections = useMemo(() => {
        if (!categories?.data || !products?.data) return [];

        const byCategory = new Map<number | "sin-categoria", ProductListItem[]>();

        for (const product of products.data) {
            const key = product.category?.id ?? "sin-categoria";
            const list = byCategory.get(key) ?? [];
            list.push(product);
            byCategory.set(key, list);
        }

        const known = categories.data
            .filter((category) => byCategory.has(category.id))
            .map((category) => ({
                id: category.id,
                name: category.name,
                items: byCategory.get(category.id)!,
            }));

        const uncategorized = byCategory.get("sin-categoria");

        return uncategorized
            ? [...known, { id: "sin-categoria", name: "Otros", items: uncategorized }]
            : known;
    }, [categories, products]);

    const handleQuickAdd = (product: ProductListItem) => {
        if (!product.in_stock) return;
        addItem.mutate({ productId: product.id, quantity: 1 });
    };

    return (
        <div className="w-full bg-white">
            {/* =====================================================
                ENCABEZADO
            ===================================================== */}
            <section className="border-b border-[#e2e8f0] bg-[#f2f3ff]">
                <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6">
                    <span className="inline-flex items-center rounded-full border border-[#c7c4d7]/60 bg-white/60 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#4648d4]">
                        {store?.name ?? "Menú"}
                    </span>

                    <h1 className="mt-5 text-3xl font-bold tracking-tight text-[#131b2e] sm:text-4xl">
                        Nuestra carta
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-[#464554]">
                        Elegí lo que se te antoje y agregalo directo a tu
                        pedido.
                    </p>

                    <label className="mx-auto mt-7 flex max-w-sm items-center gap-2 rounded-full border border-[#c7c4d7] bg-white px-4 py-2.5 shadow-sm transition focus-within:border-[#4648d4] focus-within:ring-4 focus-within:ring-[#4648d4]/10">
                        <Search size={16} className="shrink-0 text-[#767586]" />
                        <input
                            type="search"
                            placeholder="Buscar en el menú..."
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            className="min-w-0 flex-1 bg-transparent text-sm text-[#131b2e] outline-none placeholder:text-[#767586]"
                        />
                    </label>
                </div>
            </section>

            {/* =====================================================
                NAVEGACIÓN DE SECCIONES (anclas)
            ===================================================== */}
            {sections.length > 1 && (
                <div className="sticky top-0 z-10 border-b border-[#e2e8f0] bg-white/95 backdrop-blur">
                    <div className="mx-auto flex max-w-3xl gap-2 overflow-x-auto px-4 py-3 sm:px-6">
                        {sections.map((section) => (
                            <a
                                key={section.id}
                                href={`#seccion-${section.id}`}
                                className="shrink-0 rounded-full border border-[#c7c4d7] px-4 py-1.5 text-xs font-semibold text-[#464554] transition hover:border-[#4648d4] hover:text-[#4648d4]"
                            >
                                {section.name}
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* =====================================================
                SECCIONES DEL MENÚ
            ===================================================== */}
            <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
                {isLoading && (
                    <div className="flex flex-col gap-4">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className="h-20 animate-pulse rounded-xl bg-[#f2f3ff]" />
                        ))}
                    </div>
                )}

                {!isLoading && sections.length === 0 && (
                    <p className="py-16 text-center text-sm text-[#767586]">
                        No encontramos platos que coincidan con tu búsqueda.
                    </p>
                )}

                {sections.map((section) => (
                    <section key={section.id} id={`seccion-${section.id}`} className="mb-12 scroll-mt-20">
                        <h2 className="mb-1 text-xl font-bold tracking-tight text-[#131b2e]">
                            {section.name}
                        </h2>
                        <div className="mb-6 h-px bg-[#e2e8f0]" />

                        <div className="flex flex-col divide-y divide-[#e2e8f0]">
                            {section.items.map((product) => (
                                <div key={product.id} className="flex items-center gap-4 py-4">
                                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-[#e2e8f0] bg-[#f2f3ff]">
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-[#767586]/40">
                                                {product.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h3 className="truncate text-sm font-semibold text-[#131b2e]">
                                            {product.name}
                                        </h3>
                                        {product.short_description && (
                                            <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-[#767586]">
                                                {product.short_description}
                                            </p>
                                        )}
                                        {!product.in_stock && (
                                            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#b45309]">
                                                Agotado hoy
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex shrink-0 items-center gap-3">
                                        <span className="text-sm font-semibold text-[#131b2e]">
                                            {formatMoney(product.price)}
                                        </span>

                                        {product.in_stock && (
                                            product.has_variants ? (
                                                <Link
                                                    to={`/productos/${product.slug}`}
                                                    title="Elegir opciones"
                                                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[#4648d4] text-[#4648d4] transition hover:bg-[#4648d4] hover:text-white"
                                                >
                                                    <Plus size={16} />
                                                </Link>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => handleQuickAdd(product)}
                                                    title="Agregar al pedido"
                                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4648d4] text-white transition hover:bg-[#6063ee]"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </main>
        </div>
    );
}
