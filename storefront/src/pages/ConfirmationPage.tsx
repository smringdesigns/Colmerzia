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
        <main className="mx-auto max-w-xl px-4 py-16 sm:px-6">
            {/* Cabecera de éxito */}
            <div className="mb-8 flex flex-col items-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#4648d4] text-white shadow-sm">
                    <Check size={26} />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-[#131b2e]">
                    ¡Gracias por tu pedido!
                </h1>
                <p className="mt-2 text-sm text-[#464554]">
                    Te enviamos la confirmación a tu correo. Guarda tu número de pedido.
                </p>
            </div>

            {/* Estilo de Recibo / Ticket */}
            <div className="rounded-2xl border border-[#c7c4d7]/60 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-6 text-center">
                    <p className="font-mono text-xs uppercase tracking-widest text-[#767586]">
                        Número de pedido
                    </p>
                    <p className="mt-1 text-xl font-bold tracking-wide text-[#4648d4]">
                        {order.order_number}
                    </p>
                </div>

                <div className="my-4 border-t border-dashed border-[#c7c4d7]" />

                {/* Lista de productos */}
                <ul className="flex flex-col gap-3 py-2">
                    {order.items.map((item, index) => (
                        <li key={index} className="flex items-center justify-between text-sm">
                            <span className="font-medium text-[#131b2e]">
                                {item.quantity}× {item.product_name}
                            </span>
                            <span className="font-semibold text-[#131b2e]">
                                {formatMoney(item.total)}
                            </span>
                        </li>
                    ))}
                </ul>

                <div className="my-4 border-t border-dashed border-[#c7c4d7]" />

                {/* Totales y desglose */}
                <div className="space-y-2 text-sm text-[#464554]">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-medium text-[#131b2e]">{formatMoney(order.subtotal)}</span>
                    </div>
                    {Number(order.discount) > 0 && (
                        <div className="flex justify-between text-emerald-600">
                            <span>Descuento</span>
                            <span className="font-medium">-{formatMoney(order.discount)}</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span>Envío</span>
                        <span className="font-medium text-[#131b2e]">{formatMoney(order.shipping)}</span>
                    </div>

                    <div className="my-3 border-t border-[#c7c4d7]/50" />

                    <div className="flex items-center justify-between text-base font-bold text-[#131b2e]">
                        <span>Total pagado</span>
                        <span className="text-lg text-[#4648d4]">{formatMoney(order.total)}</span>
                    </div>
                </div>
            </div>

            {/* Botón de acción */}
            <Link
                to="/"
                className="mt-8 flex w-full items-center justify-center rounded-lg border border-[#c7c4d7] bg-white py-3.5 text-center text-sm font-semibold text-[#131b2e] shadow-sm transition hover:border-[#4648d4] hover:bg-[#4648d4] hover:text-white"
            >
                Seguir comprando
            </Link>
        </main>
    );
}