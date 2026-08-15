import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Minus, Plus, ShoppingBag } from "lucide-react";

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
            <div className="flex min-h-[50vh] items-center justify-center">
                <p className="text-sm font-medium text-[#767586]">Cargando producto...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center text-center px-4">
                <p className="text-base font-semibold text-[#131b2e]">
                    No encontramos este producto.
                </p>
                <p className="mt-1 text-sm text-[#464554]">
                    Es posible que haya sido eliminado o el enlace sea incorrecto.
                </p>
            </div>
        );
    }

    const selectedVariant = product.variants?.find((v) => v.id === variantId);
    const price = selectedVariant?.price ?? product.price;
    const comparePrice = selectedVariant?.compare_price ?? product.compare_price;
    const inStock = product.has_variants ? (selectedVariant?.in_stock ?? false) : product.in_stock;
    const needsVariantChoice = product.has_variants && !variantId;

    return (
        <main className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
                {/* =====================================================
                    GALERÍA DE IMÁGENES
                ===================================================== */}
                <div className="flex flex-col gap-4">
                    <div className="relative aspect-square overflow-hidden rounded-xl border border-[#c7c4d7]/60 bg-[#f2f3ff] shadow-sm">
                        {product.images[activeImage] ? (
                            <img
                                src={product.images[activeImage].path}
                                alt={product.images[activeImage].alt ?? product.name}
                                className="h-full w-full object-cover transition-all duration-300"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-6xl font-bold text-[#767586]/40">
                                {product.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>

                    {product.images.length > 1 && (
                        <div className="flex flex-wrap gap-3">
                            {product.images.map((image, index) => (
                                <button
                                    key={image.id}
                                    type="button"
                                    onClick={() => setActiveImage(index)}
                                    className={`relative aspect-square h-20 w-20 overflow-hidden rounded-lg border-2 transition ${
                                        index === activeImage
                                            ? "border-[#4648d4] shadow-sm"
                                            : "border-[#c7c4d7]/50 hover:border-[#4648d4]"
                                    }`}
                                >
                                    <img src={image.path} alt="" className="h-full w-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* =====================================================
                    INFORMACIÓN Y ACCIONES DEL PRODUCTO
                ===================================================== */}
                <div className="lg:sticky lg:top-28">
                    {product.category && (
                        <p className="font-mono text-xs uppercase tracking-widest text-[#767586]">
                            {product.category.name}
                        </p>
                    )}

                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#131b2e] sm:text-4xl">
                        {product.name}
                    </h1>

                    {/* Precios */}
                    <div className="mt-4 flex items-baseline gap-3">
                        <span className="text-2xl font-bold text-[#131b2e]">
                            {formatMoney(price)}
                        </span>
                        {comparePrice && Number(comparePrice) > Number(price) && (
                            <span className="text-base font-medium text-[#767586] line-through">
                                {formatMoney(comparePrice)}
                            </span>
                        )}
                    </div>

                    {product.short_description && (
                        <p className="mt-4 text-base leading-relaxed text-[#464554]">
                            {product.short_description}
                        </p>
                    )}

                    {/* Variantes */}
                    {product.has_variants && product.variants && (
                        <div className="mt-8">
                            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#131b2e]">
                                Elige una opción
                            </p>
                            <div className="flex flex-wrap gap-2.5">
                                {product.variants.map((variant) => (
                                    <button
                                        key={variant.id}
                                        type="button"
                                        disabled={!variant.in_stock}
                                        onClick={() => setVariantId(variant.id)}
                                        className={`rounded-lg border px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                                            variantId === variant.id
                                                ? "border-[#4648d4] bg-[#4648d4] text-white shadow-sm"
                                                : "border-[#c7c4d7] bg-white text-[#131b2e] hover:border-[#4648d4]"
                                        }`}
                                    >
                                        {variant.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Controles de cantidad y botón de compra */}
                    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="flex items-center rounded-lg border border-[#c7c4d7] bg-white shadow-sm">
                            <button
                                type="button"
                                className="p-3 text-[#464554] transition hover:text-[#4648d4]"
                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                aria-label="Restar cantidad"
                            >
                                <Minus size={16} />
                            </button>
                            <span className="w-10 text-center text-sm font-semibold text-[#131b2e]">
                                {quantity}
                            </span>
                            <button
                                type="button"
                                className="p-3 text-[#464554] transition hover:text-[#4648d4]"
                                onClick={() => setQuantity((q) => q + 1)}
                                aria-label="Sumar cantidad"
                            >
                                <Plus size={16} />
                            </button>
                        </div>

                        <button
                            type="button"
                            disabled={!inStock || needsVariantChoice || addItem.isPending}
                            onClick={() =>
                                addItem.mutate({
                                    productId: product.id,
                                    quantity,
                                    productVariantId: variantId ?? undefined,
                                })
                            }
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#4648d4] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#6063ee] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ShoppingBag size={18} />
                            {!inStock
                                ? "Agotado"
                                : needsVariantChoice
                                ? "Elige una opción"
                                : addItem.isPending
                                ? "Agregando..."
                                : "Agregar al carrito"}
                        </button>
                    </div>

                    {/* Descripción extendida */}
                    {product.description && (
                        <div className="mt-10 border-t border-[#c7c4d7]/50 pt-8 text-sm leading-relaxed text-[#464554]">
                            <h3 className="mb-3 font-semibold text-[#131b2e]">Descripción del producto</h3>
                            <div className="space-y-2">{product.description}</div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}