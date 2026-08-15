import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

import { formatMoney } from "../lib/money";
import type { ProductListItem } from "../features/catalog/catalogApi";

export default function ProductCard({
    product,
}: {
    product: ProductListItem;
}) {
    // ---------------------------------------------------------
    // Determina si el producto tiene un precio anterior mayor
    // al precio actual.
    // ---------------------------------------------------------
    const onSale =
        product.compare_price &&
        Number(product.compare_price) > Number(product.price);

    return (
        <Link
            to={`/productos/${product.slug}`}
            className="group flex cursor-pointer flex-col"
        >
            {/* =====================================================
                Imagen del producto
            ===================================================== */}
            <div className="relative mb-3 aspect-[4/5] overflow-hidden rounded-lg border border-[#e2e8f0] bg-[#f2f3ff]">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#eaedff]">
                        <span className="text-5xl font-semibold text-[#767586]/40">
                            {product.name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                )}

                {/* =================================================
                    Etiqueta de oferta
                ================================================= */}
                {onSale && (
                    <span className="absolute left-2 top-2 rounded bg-[#f1f5f9] px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#131b2e] shadow-sm">
                        Oferta
                    </span>
                )}

                {/* =================================================
                    Producto agotado
                ================================================= */}
                {!product.in_stock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#131b2e]/60">
                        <span className="rounded bg-white/95 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#131b2e]">
                            Agotado
                        </span>
                    </div>
                )}

                {/* =================================================
                    Botón visual de carrito

                    No hacemos aquí la acción de agregar al carrito
                    porque ProductCard actualmente funciona como
                    enlace hacia el detalle del producto.
                ================================================= */}
                {product.in_stock && (
                    <span
                        className="
                            absolute bottom-3 right-3
                            flex h-10 w-10 items-center justify-center
                            rounded-full bg-white
                            text-[#464554]
                            shadow-[0_10px_15px_-3px_rgba(15,23,42,0.10)]
                            opacity-0
                            translate-y-2
                            transition-all duration-300
                            group-hover:translate-y-0
                            group-hover:opacity-100
                            group-hover:text-[#4648d4]
                        "
                    >
                        <ShoppingBag size={18} />
                    </span>
                )}
            </div>

            {/* =====================================================
                Información del producto
            ===================================================== */}
            <div className="mt-1 flex items-start justify-between gap-3">
                {/* Nombre y categoría */}
                <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold leading-5 text-[#131b2e] transition-colors group-hover:text-[#4648d4]">
                        {product.name}
                    </h3>

                    {product.category && (
                        <p className="mt-1 truncate text-xs leading-4 text-[#464554]">
                            {product.category.name}
                        </p>
                    )}
                </div>

                {/* Precio */}
                <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold leading-5 text-[#131b2e]">
                        {formatMoney(product.price)}
                    </p>

                    {onSale && (
                        <p className="mt-0.5 text-xs leading-4 text-[#767586] line-through">
                            {formatMoney(product.compare_price!)}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}
