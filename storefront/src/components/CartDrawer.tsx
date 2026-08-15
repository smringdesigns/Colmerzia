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
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop con desenfoque */}
            <div
                className="absolute inset-0 bg-[#131b2e]/50 backdrop-blur-sm transition-opacity"
                onClick={closeCart}
                aria-hidden="true"
            />

            {/* Drawer Lateral */}
            <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out">
                {/* Cabecera del Drawer */}
                <div className="flex items-center justify-between border-b border-[#c7c4d7]/50 px-6 py-5">
                    <h2 className="text-xl font-bold tracking-tight text-[#131b2e]">Tu carrito</h2>
                    <button
                        type="button"
                        onClick={closeCart}
                        aria-label="Cerrar carrito"
                        className="rounded-full p-2 text-[#464554] transition hover:bg-[#eaedff] hover:text-[#4648d4]"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Lista de Productos del Carrito */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {isEmpty ? (
                        <div className="flex h-full flex-col items-center justify-center text-center">
                            <p className="text-sm font-medium text-[#767586]">Todavía no agregaste nada.</p>
                            <p className="mt-1 text-xs text-[#464554]">Explora el catálogo y añade tus productos favoritos.</p>
                        </div>
                    ) : (
                        <ul className="flex flex-col divide-y divide-[#c7c4d7]/30">
                            {cart.items.map((item) => (
                                <li key={item.id} className="flex items-center justify-between py-4">
                                    <div className="flex-1 pr-4">
                                        <p className="text-sm font-semibold text-[#131b2e]">{item.product_name}</p>
                                        {item.variant_name && (
                                            <p className="mt-0.5 text-xs text-[#767586]">
                                                {item.variant_name}
                                            </p>
                                        )}

                                        <div className="mt-3 flex items-center gap-3">
                                            <div className="flex items-center rounded-md border border-[#c7c4d7] bg-[#faf8ff]">
                                                <button
                                                    type="button"
                                                    className="flex h-7 w-7 items-center justify-center text-[#464554] transition hover:text-[#4648d4]"
                                                    onClick={() =>
                                                        updateItem.mutate({
                                                            itemId: item.id,
                                                            quantity: item.quantity - 1,
                                                        })
                                                    }
                                                    aria-label="Restar cantidad"
                                                >
                                                    <Minus size={13} />
                                                </button>

                                                <span className="w-6 text-center text-xs font-semibold text-[#131b2e]">
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    type="button"
                                                    className="flex h-7 w-7 items-center justify-center text-[#464554] transition hover:text-[#4648d4]"
                                                    onClick={() =>
                                                        updateItem.mutate({
                                                            itemId: item.id,
                                                            quantity: item.quantity + 1,
                                                        })
                                                    }
                                                    aria-label="Sumar cantidad"
                                                >
                                                    <Plus size={13} />
                                                </button>
                                            </div>

                                            <button
                                                type="button"
                                                className="text-[#767586] transition hover:text-[#ba1a1a]"
                                                onClick={() => removeItem.mutate(item.id)}
                                                aria-label="Quitar del carrito"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <p className="text-sm font-semibold text-[#131b2e]">{formatMoney(item.total)}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Sección de Resumen y Cupones (Estilo Ticket) */}
                {!isEmpty && (
                    <div className="border-t border-[#c7c4d7]/50 bg-[#f2f3ff] p-6">
                        {cart.coupon_code ? (
                            <div className="mb-4 flex items-center justify-between rounded-lg border border-[#c7c4d7] bg-white px-3.5 py-2.5 text-xs shadow-sm">
                                <span className="flex items-center gap-1.5 font-mono font-semibold text-[#4648d4]">
                                    <Tag size={13} />
                                    {cart.coupon_code}
                                </span>
                                <button
                                    type="button"
                                    className="font-semibold text-[#ba1a1a] transition hover:underline"
                                    onClick={() => removeCouponCode.mutate()}
                                >
                                    Quitar
                                </button>
                            </div>
                        ) : (
                            <form
                                className="mb-4 flex gap-2"
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
                                    className="w-full rounded-lg border border-[#c7c4d7] bg-white px-3 py-2 font-mono text-xs text-[#131b2e] outline-none transition focus:border-[#4648d4]"
                                />
                                <button
                                    type="submit"
                                    className="shrink-0 rounded-lg bg-[#131b2e] px-4 py-2 font-semibold text-white transition hover:bg-[#4648d4]"
                                >
                                    Aplicar
                                </button>
                            </form>
                        )}

                        <div className="space-y-2 text-sm text-[#464554]">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="font-medium text-[#131b2e]">{formatMoney(cart.subtotal)}</span>
                            </div>
                            {Number(cart.discount) > 0 && (
                                <div className="flex justify-between text-emerald-600">
                                    <span>Descuento</span>
                                    <span className="font-medium">-{formatMoney(cart.discount)}</span>
                                </div>
                            )}
                            <div className="my-2 border-t border-dashed border-[#c7c4d7]" />
                            <div className="flex items-center justify-between text-base font-bold text-[#131b2e]">
                                <span>Total</span>
                                <span className="text-lg text-[#4648d4]">{formatMoney(cart.total)}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Botón de Checkout */}
                <div className="border-t border-[#c7c4d7]/50 bg-white p-6">
                    <button
                        type="button"
                        disabled={isEmpty}
                        onClick={() => {
                            closeCart();
                            navigate("/checkout");
                        }}
                        className="w-full rounded-lg bg-[#4648d4] py-3.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-[#6063ee] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Ir a pagar
                    </button>
                </div>
            </aside>
        </div>
    );
}