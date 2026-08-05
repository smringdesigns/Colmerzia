import { Check } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import type { OrderConfirmation } from "../features/cart/cartApi";
import { formatMoney } from "../lib/money";

export default function ConfirmationPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const order = (location.state as { order?: OrderConfirmation } | null)?.order;

    useEffect(() => {
        if (!order) {
            navigate("/", { replace: true });
        }
    }, [order, navigate]);

    if (!order) return null;

    return (
        <main className="mx-auto max-w-xl px-5 py-16">
            <div className="mb-8 flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-pine)] text-[var(--color-stone)]">
                    <Check size={22} />
                </div>
                <h1 className="font-display text-3xl">Gracias por tu pedido</h1>
                <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
                    Te enviamos la confirmación a tu correo. Guarda tu número de pedido.
                </p>
            </div>

            <div className="receipt p-6">
                <div className="mb-4 text-center">
                    <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-ink-soft)]">
                        Pedido
                    </p>
                    <p className="price text-lg">{order.order_number}</p>
                </div>

                <hr className="receipt-divider" />

                <ul className="flex flex-col gap-2">
                    {order.items.map((item, index) => (
                        <li key={index} className="receipt-row">
                            <span className="text-[var(--color-ink)]">
                                {item.quantity}× {item.product_name}
                            </span>
                            <span>{formatMoney(item.total)}</span>
                        </li>
                    ))}
                </ul>

                <hr className="receipt-divider" />

                <div className="receipt-row">
                    <span>Subtotal</span>
                    <span>{formatMoney(order.subtotal)}</span>
                </div>
                <div className="receipt-row">
                    <span>Descuento</span>
                    <span>-{formatMoney(order.discount)}</span>
                </div>
                <div className="receipt-row">
                    <span>Envío</span>
                    <span>{formatMoney(order.shipping)}</span>
                </div>
                <div className="receipt-row total">
                    <span>Total</span>
                    <span>{formatMoney(order.total)}</span>
                </div>
            </div>

            <Link
                to="/"
                className="mt-8 block w-full rounded-md border border-[var(--color-ink)] py-3 text-center text-sm font-medium transition hover:bg-[var(--color-ink)] hover:text-[var(--color-stone)]"
            >
                Seguir comprando
            </Link>
        </main>
    );
}
