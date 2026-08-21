import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Minus, Plus, ShoppingBag } from "lucide-react";

import { getProduct } from "../features/catalog/catalogApi";
import { useCart } from "../features/cart/useCart";
import { formatMoney } from "../lib/money";

export default function ProductPage() {
    const { slug } = useParams<{ slug: string }>();
    const { addItem } = useCart();

    const { data: product, isLoading } = useQuery({
        queryKey: ["product", slug],
        queryFn: () => getProduct(slug!),
        enabled: !!slug,
    });

    const [activeImage, setActiveImage] = useState(0);
    const [variantId, setVariantId] = useState<number | null>(null);
    const [quantity, setQuantity] = useState(1);

    if (isLoading) {
        return (
            <main className="min-h-[70vh] bg-[#faf8ff] px-4 py-10 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-[1280px]">
                    <div className="grid gap-8 lg:grid-cols-2">
                        <div className="aspect-square animate-pulse rounded-2xl bg-[#eaedff]" />

                        <div className="space-y-4 py-2">
                            <div className="h-4 w-24 animate-pulse rounded bg-[#eaedff]" />
                            <div className="h-9 w-3/4 animate-pulse rounded bg-[#eaedff]" />
                            <div className="h-7 w-32 animate-pulse rounded bg-[#eaedff]" />
                            <div className="h-16 w-full animate-pulse rounded bg-[#eaedff]" />
                            <div className="h-11 w-full animate-pulse rounded-xl bg-[#eaedff]" />
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (!product) {
        return (
            <main className="flex min-h-[70vh] items-center justify-center bg-[#faf8ff] px-4">
                <div className="max-w-md text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eaedff] text-2xl font-bold text-[#4648d4]">
                        ?
                    </div>

                    <h1 className="mt-5 text-xl font-bold text-[#131b2e]">
                        No encontramos este producto
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-[#686777]">
                        Es posible que haya sido eliminado o que el enlace
                        utilizado ya no sea válido.
                    </p>

                    <Link
                        to="/"
                        className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#4648d4] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#383ab9]"
                    >
                        <ArrowLeft size={16} />
                        Volver al catálogo
                    </Link>
                </div>
            </main>
        );
    }

    const selectedVariant = product.variants?.find(
        (variant) => variant.id === variantId
    );

    const price = selectedVariant?.price ?? product.price;

    const comparePrice =
        selectedVariant?.compare_price ?? product.compare_price;

    const inStock = product.has_variants
        ? (selectedVariant?.in_stock ?? false)
        : product.in_stock;

    const needsVariantChoice = product.has_variants && !variantId;

    return (
        <main className="min-h-screen bg-[#faf8ff]">
            <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

                {/* Breadcrumb */}
                <div className="mb-6">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-[#686777] transition hover:text-[#4648d4]"
                    >
                        <ArrowLeft size={15} />
                        Volver al catálogo
                    </Link>
                </div>

                {/* =====================================================
                    PRODUCTO — 50% GALERÍA / 50% INFORMACIÓN
                ===================================================== */}

                <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-10 xl:gap-12">

                    {/* =================================================
                        GALERÍA
                    ================================================= */}

                    <div className="min-w-0">

                        {/* Imagen principal */}
                        <div className="relative aspect-square overflow-hidden rounded-2xl border border-[#e2e1eb] bg-white shadow-[0_8px_30px_rgba(35,35,60,0.05)]">
                            {product.images[activeImage] ? (
                                <img
                                    src={product.images[activeImage].path}
                                    alt={
                                        product.images[activeImage].alt ??
                                        product.name
                                    }
                                    className="h-full w-full object-cover transition duration-500"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-[#eaedff] text-7xl font-bold text-[#4648d4]/30">
                                    {product.name.charAt(0).toUpperCase()}
                                </div>
                            )}

                            {/* Estado de stock */}
                            {!inStock && !needsVariantChoice && (
                                <div className="absolute left-4 top-4 rounded-full bg-[#131b2e]/90 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
                                    Agotado
                                </div>
                            )}
                        </div>

                        {/* Miniaturas */}
                        {product.images.length > 1 && (
                            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                                {product.images.map((image, index) => (
                                    <button
                                        key={image.id}
                                        type="button"
                                        onClick={() => setActiveImage(index)}
                                        aria-label={`Ver imagen ${index + 1}`}
                                        className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-white transition ${
                                            index === activeImage
                                                ? "border-[#4648d4] shadow-sm"
                                                : "border-[#e2e1eb] hover:border-[#9998aa]"
                                        }`}
                                    >
                                        <img
                                            src={image.path}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* =================================================
                        INFORMACIÓN DEL PRODUCTO
                    ================================================= */}

                    <div className="lg:sticky lg:top-24">

                        {/* Contenedor compacto */}
                        <div className="rounded-2xl border border-[#e2e1eb] bg-white p-5 shadow-[0_8px_30px_rgba(35,35,60,0.05)] sm:p-6">

                            {/* Categoría */}
                            {product.category && (
                                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#4648d4]">
                                    {product.category.name}
                                </p>
                            )}

                            {/* Nombre */}
                            <h1 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-[#131b2e] sm:text-3xl">
                                {product.name}
                            </h1>

                            {/* Precio */}
                            <div className="mt-3 flex flex-wrap items-baseline gap-2">
                                <span className="text-2xl font-bold tracking-tight text-[#131b2e]">
                                    {formatMoney(price)}
                                </span>

                                {comparePrice &&
                                    Number(comparePrice) >
                                        Number(price) && (
                                        <span className="text-sm font-medium text-[#9695a1] line-through">
                                            {formatMoney(comparePrice)}
                                        </span>
                                    )}
                            </div>

                            {/* Descripción corta */}
                            {product.short_description && (
                                <p className="mt-3 border-b border-[#eeeef3] pb-4 text-sm leading-5 text-[#686777]">
                                    {product.short_description}
                                </p>
                            )}

                            {/* Variantes */}
                            {product.has_variants &&
                                product.variants && (
                                    <div className="mt-4">
                                        <div className="mb-2 flex items-center justify-between">
                                            <p className="text-sm font-bold text-[#131b2e]">
                                                Elige una opción
                                            </p>

                                            {needsVariantChoice && (
                                                <span className="text-[11px] font-medium text-[#ba1a1a]">
                                                    Selecciona una
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {product.variants.map(
                                                (variant) => (
                                                    <button
                                                        key={variant.id}
                                                        type="button"
                                                        disabled={
                                                            !variant.in_stock
                                                        }
                                                        onClick={() =>
                                                            setVariantId(
                                                                variant.id
                                                            )
                                                        }
                                                        className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                                                            variantId ===
                                                            variant.id
                                                                ? "border-[#4648d4] bg-[#4648d4] text-white shadow-sm"
                                                                : variant.in_stock
                                                                ? "border-[#d9d8e3] bg-white text-[#343344] hover:border-[#4648d4] hover:text-[#4648d4]"
                                                                : "cursor-not-allowed border-[#eeeef3] bg-[#f7f7fa] text-[#aaa9b4] line-through"
                                                        }`}
                                                    >
                                                        {variant.name}
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}

                            {/* Compra */}
                            <div className="mt-5 border-t border-[#eeeef3] pt-4">
                                <div className="flex gap-2">

                                    {/* Cantidad */}
                                    <div className="flex h-11 w-[105px] shrink-0 items-center justify-between rounded-lg border border-[#d9d8e3] bg-[#fcfcfe]">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setQuantity((q) =>
                                                    Math.max(1, q - 1)
                                                )
                                            }
                                            aria-label="Restar cantidad"
                                            className="flex h-full w-8 items-center justify-center text-[#686777] transition hover:text-[#4648d4]"
                                        >
                                            <Minus size={14} />
                                        </button>

                                        <span className="text-sm font-bold text-[#131b2e]">
                                            {quantity}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setQuantity((q) => q + 1)
                                            }
                                            aria-label="Sumar cantidad"
                                            className="flex h-full w-8 items-center justify-center text-[#686777] transition hover:text-[#4648d4]"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>

                                    {/* Agregar al carrito */}
                                    <button
                                        type="button"
                                        disabled={
                                            !inStock ||
                                            needsVariantChoice ||
                                            addItem.isPending
                                        }
                                        onClick={() =>
                                            addItem.mutate({
                                                productId: product.id,
                                                quantity,
                                                productVariantId:
                                                    variantId ?? undefined,
                                            })
                                        }
                                        className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-[#4648d4] px-4 text-xs font-bold text-white shadow-sm transition hover:bg-[#383ab9] hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#4648d4]/20 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <ShoppingBag size={16} />

                                        {!inStock
                                            ? "Agotado"
                                            : needsVariantChoice
                                            ? "Elige una opción"
                                            : addItem.isPending
                                            ? "Agregando..."
                                            : "Agregar al carrito"}
                                    </button>
                                </div>
                            </div>

                            {/* Descripción completa */}
                            {product.description && (
                                <div className="mt-5 border-t border-[#eeeef3] pt-4">
                                    <h2 className="text-sm font-bold text-[#131b2e]">
                                        Descripción del producto
                                    </h2>

                                    <div className="mt-2 text-sm leading-5 text-[#686777]">
                                        {product.description}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}