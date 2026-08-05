import { Link } from "react-router-dom";
import { formatMoney } from "../lib/money";
import type { ProductListItem } from "../features/catalog/catalogApi";

export default function ProductCard({ product }: { product: ProductListItem }) {
    const onSale =
        product.compare_price && Number(product.compare_price) > Number(product.price);

    return (
        <Link
            to={`/productos/${product.slug}`}
            className="group flex flex-col"
        >
            <div className="relative aspect-[4/5] overflow-hidden rounded-md border border-[var(--color-line)] bg-[var(--color-stone-deep)]">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center font-display text-4xl text-[var(--color-ink-soft)]/40">
                        {product.name.charAt(0).toUpperCase()}
                    </div>
                )}

                {onSale && (
                    <span className="absolute left-2 top-2 rounded-full bg-[var(--color-ochre)] px-2 py-0.5 font-mono text-[11px] text-[var(--color-ink)]">
                        Oferta
                    </span>
                )}

                {!product.in_stock && (
                    <span className="absolute inset-0 flex items-center justify-center bg-[var(--color-ink)]/60 font-mono text-xs uppercase tracking-wide text-[var(--color-stone)]">
                        Agotado
                    </span>
                )}
            </div>

            <div className="mt-3 flex items-start justify-between gap-2">
                <div>
                    <h3 className="font-display text-base leading-tight">{product.name}</h3>
                    {product.category && (
                        <p className="mt-0.5 text-xs text-[var(--color-ink-soft)]">
                            {product.category.name}
                        </p>
                    )}
                </div>

                <div className="text-right">
                    <p className="price text-sm">{formatMoney(product.price)}</p>
                    {onSale && (
                        <p className="price text-xs text-[var(--color-ink-soft)] line-through">
                            {formatMoney(product.compare_price!)}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}
