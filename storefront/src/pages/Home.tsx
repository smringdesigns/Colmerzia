import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";

import { getCategories, getProducts } from "../features/catalog/catalogApi";
import ProductCard from "../components/ProductCard";

export default function Home() {
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [search, setSearch] = useState("");

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

    return (
        <main className="mx-auto max-w-6xl px-5 py-10">
            <div className="mb-8 flex flex-col gap-4 border-b border-[var(--color-line)] pb-8 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-ink-soft)]">
                        Catálogo
                    </p>
                    <h1 className="font-display text-3xl">Todos los productos</h1>
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
                <p className="py-16 text-center text-sm text-[var(--color-ink-soft)]">
                    Cargando productos...
                </p>
            )}

            {!isLoading && products?.data.length === 0 && (
                <p className="py-16 text-center text-sm text-[var(--color-ink-soft)]">
                    No encontramos productos con ese filtro.
                </p>
            )}

            <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
                {products?.data.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </main>
    );
}
