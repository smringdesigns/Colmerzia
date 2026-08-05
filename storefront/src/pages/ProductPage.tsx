import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Minus, Plus } from "lucide-react";

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
        return <p className="py-24 text-center text-sm text-[var(--color-ink-soft)]">Cargando...</p>;
    }

    if (!product) {
        return (
            <p className="py-24 text-center text-sm text-[var(--color-ink-soft)]">
                No encontramos este producto.
            </p>
        );
    }

    const selectedVariant = product.variants?.find((v) => v.id === variantId);
    const price = selectedVariant?.price ?? product.price;
    const comparePrice = selectedVariant?.compare_price ?? product.compare_price;
    const inStock = product.has_variants ? (selectedVariant?.in_stock ?? false) : product.in_stock;
    const needsVariantChoice = product.has_variants && !variantId;

    return (
        <main className="mx-auto max-w-6xl px-5 py-10">
            <div className="grid gap-10 md:grid-cols-2">
                <div>
                    <div className="aspect-square overflow-hidden rounded-md border border-[var(--color-line)] bg-[var(--color-stone-deep)]">
                        {product.images[activeImage] ? (
                            <img
                                src={product.images[activeImage].path}
                                alt={product.images[activeImage].alt ?? product.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center font-display text-6xl text-[var(--color-ink-soft)]/40">
                                {product.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>

                    {product.images.length > 1 && (
                        <div className="mt-3 flex gap-2">
                            {product.images.map((image, index) => (
                                <button
                                    key={image.id}
                                    type="button"
                                    onClick={() => setActiveImage(index)}
                                    className={`h-16 w-16 overflow-hidden rounded border ${
                                        index === activeImage
                                            ? "border-[var(--color-ink)]"
                                            : "border-[var(--color-line)]"
                                    }`}
                                >
                                    <img src={image.path} alt="" className="h-full w-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="md:sticky md:top-24 md:self-start">
                    {product.category && (
                        <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-ink-soft)]">
                            {product.category.name}
                        </p>
                    )}

                    <h1 className="mt-1 font-display text-3xl">{product.name}</h1>

                    <div className="mt-3 flex items-baseline gap-2">
                        <span className="price text-xl">{formatMoney(price)}</span>
                        {comparePrice && Number(comparePrice) > Number(price) && (
                            <span className="price text-sm text-[var(--color-ink-soft)] line-through">
                                {formatMoney(comparePrice)}
                            </span>
                        )}
                    </div>

                    {product.short_description && (
                        <p className="mt-4 text-sm text-[var(--color-ink-soft)]">
                            {product.short_description}
                        </p>
                    )}

                    {product.has_variants && product.variants && (
                        <div className="mt-6">
                            <p className="mb-2 text-xs uppercase tracking-wide text-[var(--color-ink-soft)]">
                                Elige una opción
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {product.variants.map((variant) => (
                                    <button
                                        key={variant.id}
                                        type="button"
                                        disabled={!variant.in_stock}
                                        onClick={() => setVariantId(variant.id)}
                                        className={`rounded-md border px-3 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-40 ${
                                            variantId === variant.id
                                                ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-stone)]"
                                                : "border-[var(--color-line)]"
                                        }`}
                                    >
                                        {variant.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-6 flex items-center gap-3">
                        <div className="flex items-center rounded-md border border-[var(--color-line)]">
                            <button
                                type="button"
                                className="p-2"
                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                aria-label="Restar cantidad"
                            >
                                <Minus size={14} />
                            </button>
                            <span className="price w-8 text-center text-sm">{quantity}</span>
                            <button
                                type="button"
                                className="p-2"
                                onClick={() => setQuantity((q) => q + 1)}
                                aria-label="Sumar cantidad"
                            >
                                <Plus size={14} />
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
                            className="flex-1 rounded-md bg-[var(--color-pine)] py-3 text-sm font-medium text-[var(--color-stone)] transition hover:bg-[var(--color-pine-dark)] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {!inStock
                                ? "Agotado"
                                : needsVariantChoice
                                  ? "Elige una opción"
                                  : addItem.isPending
                                    ? "Agregando..."
                                    : "Agregar al carrito"}
                        </button>
                    </div>

                    {product.description && (
                        <div className="mt-8 border-t border-[var(--color-line)] pt-6 text-sm leading-relaxed text-[var(--color-ink-soft)]">
                            {product.description}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
