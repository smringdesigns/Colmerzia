import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { getCategories, getProducts } from "../features/catalog/catalogApi";
import type { ProductListItem } from "../features/catalog/catalogApi";
import { getStoreInfo } from "../features/store/storeApi";
import { useCart } from "../features/cart/useCart";
import { formatMoney } from "../lib/money";

/**
 * Home para negocios con storefront_layout = "services".
 *
 * A diferencia de CatalogHome (grilla densa, muchos SKUs a la vez) o
 * MenuHome (filas compactas), acá cada servicio necesita espacio
 * para explicarse: la descripción es lo primero que se lee, no el
 * precio. Por eso son tarjetas grandes de 1-2 columnas, no 4.
 *
 * OJO: el botón dice "Agregar", no "Reservar" — todavía no existe
 * un sistema de citas/turnos en el backend, solo carrito y pedidos
 * como cualquier producto. Si más adelante se agrega agenda real,
 * este es el lugar para cambiarlo.
 */
export default function ServicesHome() {
    const [categoryId, setCategoryId] = useState<number | null>(null);
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

    const { data: services, isLoading } = useQuery({
        queryKey: ["products", "services", categoryId],
        queryFn: () =>
            getProducts({
                category_id: categoryId ?? undefined,
                per_page: 60,
            }),
    });

    const handleQuickAdd = (service: ProductListItem) => {
        if (!service.in_stock) return;
        addItem.mutate({ productId: service.id, quantity: 1 });
    };

    return (
        <div className="w-full bg-white">
            {/* =====================================================
                ENCABEZADO
            ===================================================== */}
            <section className="border-b border-[#e2e8f0] bg-[#f2f3ff]">
                <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
                    <span className="inline-flex items-center rounded-full border border-[#c7c4d7]/60 bg-white/60 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#4648d4]">
                        {store?.name ?? "Servicios"}
                    </span>

                    <h1 className="mt-5 text-3xl font-bold tracking-tight text-[#131b2e] sm:text-4xl">
                        Elegí el servicio que necesitás
                    </h1>

                    <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#464554]">
                        Cada servicio incluye lo que necesitás saber antes de
                        pedirlo — sin sorpresas.
                    </p>
                </div>
            </section>

            <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
                {/* =================================================
                    FILTRO DE CATEGORÍAS
                ================================================= */}
                {categories && categories.data.length > 0 && (
                    <div className="mb-10 flex flex-wrap justify-center gap-2">
                        <button
                            type="button"
                            onClick={() => setCategoryId(null)}
                            className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                                categoryId === null
                                    ? "border-[#4648d4] bg-[#4648d4] text-white shadow-sm"
                                    : "border-[#c7c4d7] bg-white text-[#464554] hover:border-[#4648d4] hover:text-[#4648d4]"
                            }`}
                        >
                            Todos
                        </button>

                        {categories.data.map((category) => (
                            <button
                                key={category.id}
                                type="button"
                                onClick={() => setCategoryId(category.id)}
                                className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                                    categoryId === category.id
                                        ? "border-[#4648d4] bg-[#4648d4] text-white shadow-sm"
                                        : "border-[#c7c4d7] bg-white text-[#464554] hover:border-[#4648d4] hover:text-[#4648d4]"
                                }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                )}

                {/* =================================================
                    ESTADO DE CARGA
                ================================================= */}
                {isLoading && (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="h-52 animate-pulse rounded-2xl bg-[#f2f3ff]" />
                        ))}
                    </div>
                )}

                {!isLoading && services?.data.length === 0 && (
                    <p className="py-16 text-center text-sm text-[#767586]">
                        No hay servicios disponibles en esta categoría por
                        ahora.
                    </p>
                )}

                {/* =================================================
                    TARJETAS DE SERVICIO
                ================================================= */}
                {!isLoading && services && services.data.length > 0 && (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {services.data.map((service) => (
                            <article
                                key={service.id}
                                className="flex flex-col overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-sm transition hover:border-[#c7c4d7] hover:shadow-md"
                            >
                                <div className="aspect-[16/9] w-full overflow-hidden bg-[#f2f3ff]">
                                    {service.image ? (
                                        <img
                                            src={service.image}
                                            alt={service.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-[#767586]/40">
                                            {service.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-1 flex-col p-6">
                                    {service.category && (
                                        <p className="text-xs font-semibold uppercase tracking-wide text-[#767586]">
                                            {service.category.name}
                                        </p>
                                    )}

                                    <h3 className="mt-1 text-lg font-bold text-[#131b2e]">
                                        {service.name}
                                    </h3>

                                    {service.short_description && (
                                        <p className="mt-2 flex-1 text-sm leading-6 text-[#464554]">
                                            {service.short_description}
                                        </p>
                                    )}

                                    <div className="mt-5 flex items-center justify-between border-t border-[#e2e8f0] pt-4">
                                        <span className="text-lg font-bold text-[#131b2e]">
                                            {formatMoney(service.price)}
                                        </span>

                                        {!service.in_stock ? (
                                            <span className="text-xs font-semibold uppercase tracking-wide text-[#b45309]">
                                                No disponible
                                            </span>
                                        ) : service.has_variants ? (
                                            <Link
                                                to={`/productos/${service.slug}`}
                                                className="inline-flex items-center gap-1.5 rounded-full bg-[#4648d4] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#6063ee]"
                                            >
                                                Ver opciones
                                                <ArrowRight size={14} />
                                            </Link>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => handleQuickAdd(service)}
                                                className="rounded-full bg-[#4648d4] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#6063ee]"
                                            >
                                                Agregar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
