import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Search } from "lucide-react";

import { getCategories, getProducts } from "../features/catalog/catalogApi";
import { getStoreInfo } from "../features/store/storeApi";
import ProductCard from "../components/ProductCard";

export default function CatalogHome() {
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [search, setSearch] = useState("");

    // =========================================================
    // CONSULTAS
    // =========================================================

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

    const { data: products, isLoading } = useQuery({
        queryKey: ["products", categoryId, search],
        queryFn: () =>
            getProducts({
                category_id: categoryId ?? undefined,
                search: search || undefined,
            }),
    });

    // =========================================================
    // DATOS DERIVADOS
    // =========================================================

    const featuredCategories = categories?.data?.slice(0, 4) ?? [];

    // =========================================================
    // ACCIONES
    // =========================================================

    const handleGoToCatalog = () => {
        document
            .getElementById("catalogo")
            ?.scrollIntoView({ behavior: "smooth" });
    };

    const handleGoToCategories = () => {
        document
            .getElementById("categorias")
            ?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSelectCategory = (id: number) => {
        setCategoryId(id);
        handleGoToCatalog();
    };

    const handleClearFilters = () => {
        setSearch("");
        setCategoryId(null);
    };

    return (
        <div className="w-full bg-white">
            {/* =====================================================
                HERO
            ===================================================== */}
            <section className="relative overflow-hidden bg-[#f2f3ff]">
                {/* Decoración de fondo sutil */}
                <div className="pointer-events-none absolute -right-32 top-0 h-80 w-80 rounded-full bg-white/50 blur-3xl" />

                <div className="pointer-events-none absolute -bottom-40 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#4648d4]/5 blur-3xl" />

                <div className="relative mx-auto flex min-h-[520px] w-full max-w-[1440px] items-center px-4 py-16 sm:px-6 lg:px-8">
                    <div className="max-w-2xl">
                        {/* Nombre de la tienda */}
                        <span className="mb-5 inline-flex items-center rounded-full border border-[#c7c4d7]/60 bg-white/60 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#4648d4]">
                            {store?.name ?? "Tienda Online"}
                        </span>

                        {/* Título */}
                        <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-[#131b2e] sm:text-5xl lg:text-6xl">
                            Todo lo que buscas,
                            <span className="block">
                                a un clic de tu puerta.
                            </span>
                        </h1>

                        {/* Descripción */}
                        <p className="mt-6 max-w-xl text-base leading-7 text-[#464554] sm:text-lg">
                            Explora nuestros productos, encuentra lo que necesitas
                            y realiza tus pedidos de manera rápida y sencilla desde
                            cualquier lugar.
                        </p>

                        {/* Acciones */}
                        <div className="mt-8 flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={handleGoToCatalog}
                                className="inline-flex items-center gap-2 rounded-lg bg-[#4648d4] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#6063ee] hover:shadow-md"
                            >
                                Ver catálogo
                                <ArrowRight size={17} />
                            </button>

                            <button
                                type="button"
                                onClick={handleGoToCategories}
                                className="inline-flex items-center rounded-lg border border-[#c7c4d7] bg-white px-6 py-3.5 text-sm font-semibold text-[#131b2e] shadow-sm transition hover:border-[#4648d4] hover:bg-[#f7f7ff] hover:text-[#4648d4]"
                            >
                                Explorar categorías
                            </button>
                        </div>

                        {/* Estadísticas */}
                        <div className="mt-10 flex flex-wrap gap-x-10 gap-y-5 border-t border-[#c7c4d7]/60 pt-6">
                            <div>
                                <p className="text-2xl font-bold text-[#131b2e]">
                                    {products ? products.total : "—"}
                                </p>

                                <p className="mt-1 text-xs text-[#767586]">
                                    Productos disponibles
                                </p>
                            </div>

                            <div>
                                <p className="text-2xl font-bold text-[#131b2e]">
                                    {categories?.data?.length ?? "—"}
                                </p>

                                <p className="mt-1 text-xs text-[#767586]">
                                    Categorías
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                CATEGORÍAS DESTACADAS
            ===================================================== */}
            {featuredCategories.length > 0 && (
                <section
                    id="categorias"
                    className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8"
                >
                    <div className="mb-8">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#767586]">
                            Explora
                        </p>

                        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#131b2e] sm:text-3xl">
                            Categorías destacadas
                        </h2>

                        <p className="mt-2 text-sm text-[#464554]">
                            Explora nuestros departamentos principales y encuentra
                            lo que necesitas.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {featuredCategories.map((category, index) => (
                            <button
                                key={category.id}
                                type="button"
                                onClick={() =>
                                    handleSelectCategory(category.id)
                                }
                                className={`group relative flex min-h-[220px] overflow-hidden rounded-xl border border-[#e2e8f0] bg-white text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#c7c4d7] hover:shadow-md ${
                                    index === 0 ? "sm:col-span-2" : ""
                                }`}
                            >
                                {/* Fondo visual de la tarjeta */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#131b2e]/90 via-[#131b2e]/45 to-[#131b2e]/5" />

                                {/* Detalle decorativo */}
                                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10 transition duration-500 group-hover:scale-125" />

                                <div className="relative mt-auto flex w-full items-end justify-between p-5">
                                    <div>
                                        <h3 className="text-xl font-semibold text-white">
                                            {category.name}
                                        </h3>

                                        <p className="mt-1 text-sm text-white/80">
                                            Ver productos
                                        </p>
                                    </div>

                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition group-hover:bg-white group-hover:text-[#4648d4]">
                                        <ArrowRight size={18} />
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </section>
            )}

            {/* =====================================================
                CATÁLOGO PRINCIPAL
            ===================================================== */}
            <main
                id="catalogo"
                className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8"
            >
                {/* Cabecera */}
                <div className="mb-8 flex flex-col gap-5 border-b border-[#c7c4d7]/50 pb-8 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="font-mono text-xs uppercase tracking-widest text-[#767586]">
                            Catálogo
                        </p>

                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#131b2e]">
                            Todos los productos
                        </h2>

                        <p className="mt-2 text-sm text-[#464554]">
                            Explora nuestra selección y encuentra lo que buscas.
                        </p>
                    </div>

                    {/* Buscador */}
                    <label className="flex w-full items-center gap-2 rounded-full border border-[#c7c4d7] bg-white px-4 py-2.5 shadow-sm transition focus-within:border-[#4648d4] focus-within:ring-4 focus-within:ring-[#4648d4]/10 sm:max-w-sm">
                        <Search
                            size={16}
                            className="shrink-0 text-[#767586]"
                        />

                        <input
                            type="search"
                            placeholder="Buscar en el catálogo..."
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            className="min-w-0 flex-1 bg-transparent text-sm text-[#131b2e] outline-none placeholder:text-[#767586]"
                        />
                    </label>
                </div>

                {/* =================================================
                    FILTROS DE CATEGORÍA
                ================================================= */}
                {categories && categories.data.length > 0 && (
                    <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
                        <button
                            type="button"
                            onClick={() => setCategoryId(null)}
                            className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                                categoryId === null
                                    ? "border-[#4648d4] bg-[#4648d4] text-white shadow-sm"
                                    : "border-[#c7c4d7] bg-white text-[#464554] hover:border-[#4648d4] hover:text-[#4648d4]"
                            }`}
                        >
                            Todas
                        </button>

                        {categories.data.map((category) => (
                            <button
                                key={category.id}
                                type="button"
                                onClick={() => setCategoryId(category.id)}
                                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition ${
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
                    <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <div
                                key={index}
                                className="flex flex-col gap-3"
                            >
                                <div className="aspect-[4/5] w-full animate-pulse rounded-xl bg-[#eaedff]" />

                                <div className="h-4 w-3/4 animate-pulse rounded bg-[#eaedff]" />

                                <div className="h-3 w-1/2 animate-pulse rounded bg-[#eaedff]" />
                            </div>
                        ))}
                    </div>
                )}

                {/* =================================================
                    SIN RESULTADOS
                ================================================= */}
                {!isLoading && products?.data.length === 0 && (
                    <div className="rounded-xl border border-[#c7c4d7]/50 bg-[#f2f3ff]/40 px-6 py-20 text-center">
                        <Search
                            size={32}
                            className="mx-auto mb-4 text-[#767586]"
                        />

                        <h3 className="text-base font-semibold text-[#131b2e]">
                            No encontramos productos
                        </h3>

                        <p className="mt-2 text-sm text-[#464554]">
                            Prueba con otra búsqueda o elimina los filtros
                            actuales.
                        </p>

                        <button
                            type="button"
                            onClick={handleClearFilters}
                            className="mt-5 text-sm font-semibold text-[#4648d4] transition hover:underline"
                        >
                            Limpiar filtros
                        </button>
                    </div>
                )}

                {/* =================================================
                    PRODUCTOS
                ================================================= */}
                {!isLoading &&
                    products &&
                    products.data.length > 0 && (
                        <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
                            {products.data.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    )}
            </main>
        </div>
    );
}