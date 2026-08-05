import { useState } from "react";
import { Minus, Plus, Tag, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useCart } from "../features/cart/useCart";
import { useUIStore } from "../lib/uiStore";
import { formatMoney } from "../lib/money";

export default function CartDrawer() {
    const isOpen = useUIStore((s) => s.isCartOpen);
    const closeCart = useUIStore((s) => s.closeCart);
    const navigate = useNavigate();

    const { cart, updateItem, removeItem, applyCouponCode, removeCouponCode } = useCart();
    const [couponInput, setCouponInput] = useState("");

    if (!isOpen) return null;

    const isEmpty = !cart || cart.items.length === 0;

    return (
        <div className="fixed inset-0 z-40">
            <div
                className="absolute inset-0 bg-[var(--color-ink)]/40"
                onClick={closeCart}
                aria-hidden="true"
            />

            <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[var(--color-stone)] shadow-2xl">
                <div className="flex items-center justify-between border-b border-[var(--color-line)] px-5 py-4">
                    <h2 className="font-display text-xl">Tu carrito</h2>
                    <button type="button" onClick={closeCart} aria-label="Cerrar carrito">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-4">
                    {isEmpty ? (
                        <p className="mt-10 text-center text-sm text-[var(--color-ink-soft)]">
                            Todavía no agregaste nada.
                        </p>
                    ) : (
                        <ul className="flex flex-col gap-4">
                            {cart.items.map((item) => (
                                <li key={item.id} className="flex gap-3">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{item.product_name}</p>
                                        {item.variant_name && (
                                            <p className="text-xs text-[var(--color-ink-soft)]">
                                                {item.variant_name}
                                            </p>
                                        )}

                                        <div className="mt-2 flex items-center gap-2">
                                            <button
                                                type="button"
                                                className="flex h-6 w-6 items-center justify-center rounded border border-[var(--color-line)]"
                                                onClick={() =>
                                                    updateItem.mutate({
                                                        itemId: item.id,
                                                        quantity: item.quantity - 1,
                                                    })
                                                }
                                                aria-label="Restar cantidad"
                                            >
                                                <Minus size={12} />
                                            </button>

                                            <span className="price w-6 text-center text-sm">
                                                {item.quantity}
                                            </span>

                                            <button
                                                type="button"
                                                className="flex h-6 w-6 items-center justify-center rounded border border-[var(--color-line)]"
                                                onClick={() =>
                                                    updateItem.mutate({
                                                        itemId: item.id,
                                                        quantity: item.quantity + 1,
                                                    })
                                                }
                                                aria-label="Sumar cantidad"
                                            >
                                                <Plus size={12} />
                                            </button>

                                            <button
                                                type="button"
                                                className="ml-2 text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
                                                onClick={() => removeItem.mutate(item.id)}
                                                aria-label="Quitar del carrito"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    <p className="price text-sm">{formatMoney(item.total)}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {!isEmpty && (
                    <div className="receipt m-5 mt-0 p-4">
                        {cart.coupon_code ? (
                            <div className="mb-3 flex items-center justify-between text-xs">
                                <span className="flex items-center gap-1 font-mono">
                                    <Tag size={12} />
                                    {cart.coupon_code}
                                </span>
                                <button
                                    type="button"
                                    className="underline"
                                    onClick={() => removeCouponCode.mutate()}
                                >
                                    Quitar
                                </button>
                            </div>
                        ) : (
                            <form
                                className="mb-3 flex gap-2"
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    if (!couponInput.trim()) return;
                                    applyCouponCode.mutate(couponInput.trim());
                                    setCouponInput("");
                                }}
                            >
                                <input
                                    type="text"
                                    value={couponInput}
                                    onChange={(event) => setCouponInput(event.target.value)}
                                    placeholder="Código de cupón"
                                    className="w-full border-b border-dashed border-[var(--color-line)] bg-transparent px-1 py-1 font-mono text-xs outline-none"
                                />
                                <button type="submit" className="font-mono text-xs underline shrink-0">
                                    Aplicar
                                </button>
                            </form>
                        )}

                        <div className="receipt-row">
                            <span>Subtotal</span>
                            <span>{formatMoney(cart.subtotal)}</span>
                        </div>
                        <div className="receipt-row">
                            <span>Descuento</span>
                            <span>-{formatMoney(cart.discount)}</span>
                        </div>
                        <div className="receipt-row total">
                            <span>Total</span>
                            <span>{formatMoney(cart.total)}</span>
                        </div>
                    </div>
                )}

                <div className="border-t border-[var(--color-line)] p-5">
                    <button
                        type="button"
                        disabled={isEmpty}
                        onClick={() => {
                            closeCart();
                            navigate("/checkout");
                        }}
                        className="w-full rounded-md bg-[var(--color-pine)] py-3 text-sm font-medium text-[var(--color-stone)] transition hover:bg-[var(--color-pine-dark)] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Ir a pagar
                    </button>
                </div>
            </aside>
        </div>
    );
}
