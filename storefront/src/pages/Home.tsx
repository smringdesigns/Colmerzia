import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Search } from "lucide-react";

import { getCategories, getProducts } from "../features/catalog/catalogApi";
import { getStoreInfo } from "../features/store/storeApi";
import ProductCard from "../components/ProductCard";

export default function Home() {
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [search, setSearch] = useState("");

    // ---------------------------------------------------------
    // Consultas con React Query (Lógica original conservada)
    // ---------------------------------------------------------
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

    // Tomamos las primeras categorías reales de la API para la sección visual destacada
    const featuredCategories = categories?.data?.slice(0, 4) ?? [];

    const handleGoToCatalog = () => {
        document
            .getElementById("catalogo")
            ?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="w-full">
            {/* =====================================================
                HERO SECTION
            ===================================================== */}
            <section className="relative overflow-hidden bg-[#f2f3ff]">
                <div className="mx-auto grid min-h-[550px] w-full max-w-[1440px] grid-cols-1 items-center px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
                    <div className="max-w-xl">
                        <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-[#4648d4]">
                            {store?.name ?? "Tienda Online"}
                        </span>

                        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[#131b2e] sm:text-5xl lg:text-6xl">
                            Todo lo que buscas,
                            <br />a un clic de tu puerta.
                        </h1>

                        <p className="mt-6 max-w-md text-base leading-6 text-[#464554] sm:text-lg">
                            Catálogo completo, precios claros y pedidos que salen
                            el mismo día. Como comprarle a la tienda de la
                            esquina, pero desde donde estés.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={handleGoToCatalog}
                                className="inline-flex items-center gap-2 rounded-lg bg-[#4648d4] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#6063ee]"
                            >
                                Ver catálogo
                                <ArrowRight size={17} />
                            </button>

                            <a
                                href="#categorias"
                                className="inline-flex items-center rounded-lg border border-[#c7c4d7] bg-white px-6 py-3 text-sm font-semibold text-[#131b2e] transition hover:bg-[#f2f3ff]"
                            >
                                Explorar categorías
                            </a>
                        </div>

                        {/* Resumen dinámico del catálogo */}
                        <div className="mt-10 flex gap-8 border-t border-[#c7c4d7]/60 pt-6">
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
                CATEGORÍAS DESTACADAS (Bento Grid Visual)
            ===================================================== */}
            {featuredCategories.length > 0 && (
                <section
                    id="categorias"
                    className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8"
                >
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold tracking-tight text-[#131b2e] sm:text-3xl">
                            Categorías destacadas
                        </h2>
                        <p className="mt-2 text-sm text-[#464554]">
                            Explora por nuestros departamentos principales.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {featuredCategories.map((category, index) => (
                            <button
                                key={category.id}
                                type="button"
                                onClick={() => {
                                    setCategoryId(category.id);
                                    handleGoToCatalog();
                                }}
                                className={`group relative flex min-h-[220px] overflow-hidden rounded-xl border border-[#e2e8f0] bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
                                    index === 0 ? "sm:col-span-2" : ""
                                }`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-[#131b2e]/80 via-[#131b2e]/30 to-transparent" />

                                <div className="relative mt-auto flex w-full items-end justify-between p-5">
                                    <div>
                                        <h3 className="text-xl font-semibold text-white">
                                            {category.name}
                                        </h3>
                                        <p className="mt-1 text-sm text-white/80">
                                            Filtrar productos
                                        </p>
                                    </div>

                                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition group-hover:bg-white group-hover:text-[#4648d4]">
                                        <ArrowRight size={18} />
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </section>
            )}

            {/* =====================================================
                CATÁLOGO PRINCIPAL & FILTROS
            ===================================================== */}
            <main
                id="catalogo"
                className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8"
            >
                {/* Cabecera de sección y barra de búsqueda interna */}
                <div className="mb-8 flex flex-col gap-4 border-b border-[#c7c4d7]/50 pb-8 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="font-mono text-xs uppercase tracking-widest text-[#767586]">
                            Catálogo
                        </p>
                        <h2 className="text-3xl font-bold tracking-tight text-[#131b2e]">
                            Todos los productos
                        </h2>
                    </div>

                    <label className="flex items-center gap-2 rounded-full border border-[#c7c4d7] bg-white/50 px-4 py-2">
                        <Search size={16} className="text-[#767586]" />
                        <input
                            type="search"
                            placeholder="Buscar en el catálogo..."
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            className="bg-transparent text-sm text-[#131b2e] outline-none placeholder:text-[#767586]"
                        />
                    </label>
                </div>

                {/* Filtros de Categorías (Píldoras) */}
                {categories && categories.data.length > 0 && (
                    <div className="mb-8 flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => setCategoryId(null)}
                            className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                                categoryId === null
                                    ? "border-[#4648d4] bg-[#4648d4] text-white"
                                    : "border-[#c7c4d7] bg-white text-[#464554] hover:border-[#4648d4]"
                            }`}
                        >
                            Todas
                        </button>
                        {categories.data.map((category) => (
                            <button
                                key={category.id}
                                type="button"
                                onClick={() => setCategoryId(category.id)}
                                className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                                    categoryId === category.id
                                        ? "border-[#4648d4] bg-[#4648d4] text-white"
                                        : "border-[#c7c4d7] bg-white text-[#464554] hover:border-[#4648d4]"
                                }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                )}

                {/* Estado de Carga (Skeletons) */}
                {isLoading && (
                    <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <div key={index} className="flex flex-col gap-3">
                                <div className="aspect-[4/5] w-full animate-pulse rounded-lg bg-[#eaedff]" />
                                <div className="h-4 w-3/4 animate-pulse rounded bg-[#eaedff]" />
                                <div className="h-3 w-1/2 animate-pulse rounded bg-[#eaedff]" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Estado Sin Resultados */}
                {!isLoading && products?.data.length === 0 && (
                    <div className="py-20 text-center">
                        <Search size={32} className="mx-auto mb-4 text-[#767586]" />
                        <p className="text-sm text-[#464554]">
                            No encontramos productos con ese filtro.
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                setCategoryId(null);
                            }}
                            className="mt-4 text-sm font-semibold text-[#4648d4] hover:underline"
                        >
                            Limpiar filtros
                        </button>
                    </div>
                )}

                {/* Grid de Productos */}
                {!isLoading && products && products.data.length > 0 && (
                    <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
                        {products.data.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}