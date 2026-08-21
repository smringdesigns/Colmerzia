import { Check, Printer } from "lucide-react";
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

    function handlePrint() {
        window.print();
    }

    return (
        <>
            {/* =========================================================
                VISTA NORMAL DE LA PÁGINA
            ========================================================= */}
            <main className="min-h-screen bg-[#faf8ff] px-4 py-10 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl">

                    {/* Cabecera */}
                    <div className="mb-8 flex flex-col items-center text-center print:hidden">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#4648d4] text-white shadow-sm">
                            <Check size={26} />
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight text-[#131b2e]">
                            ¡Gracias por tu pedido!
                        </h1>

                        <p className="mt-2 max-w-md text-sm leading-6 text-[#686777]">
                            Tu pedido fue recibido correctamente.
                            Guarda tu número de pedido para futuras consultas.
                        </p>
                    </div>

                    {/* =====================================================
                        RECIBO VISIBLE EN PANTALLA
                    ===================================================== */}
                    <div
                        id="thermal-receipt"
                        className="
                            mx-auto
                            w-full
                            max-w-[520px]
                            rounded-2xl
                            border
                            border-[#e2e1eb]
                            bg-white
                            p-6
                            shadow-[0_8px_30px_rgba(35,35,60,0.05)]
                            sm:p-8
                            print:mx-0
                            print:w-[80mm]
                            print:max-w-none
                            print:rounded-none
                            print:border-0
                            print:bg-white
                            print:p-0
                            print:shadow-none
                        "
                    >
                        {/* =================================================
                            ENCABEZADO DE LA TIENDA
                            ================================================= */}

                        <div className="text-center">

                            {/* Logo
                                -------------------------------------------------
                                Aquí posteriormente podemos reemplazar esto por
                                el logo real de la tienda.
                            */}
                            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-[#4648d4] text-lg font-bold text-white print:h-auto print:w-auto print:rounded-none print:bg-transparent print:text-black">
                                C
                            </div>

                            <h2 className="text-lg font-bold text-[#131b2e] print:text-[15px]">
                                Colmerzia
                            </h2>

                            <p className="mt-1 text-xs leading-5 text-[#686777] print:text-[10px] print:leading-4">
                                Tu tienda en línea
                            </p>

                            {/* Datos de la tienda */}
                            <div className="mt-2 text-[11px] leading-4 text-[#686777] print:text-[9px] print:leading-3">
                                <p>Valledupar, Cesar</p>
                                <p>Colombia</p>
                                <p>Tel: 000 000 0000</p>
                            </div>
                        </div>

                        <div className="my-5 border-t border-dashed border-[#c7c4d7] print:my-3 print:border-[#000]" />

                        {/* =================================================
                            INFORMACIÓN DEL PEDIDO
                            ================================================= */}

                        <div className="text-center">
                            <p className="text-[10px] uppercase tracking-widest text-[#767586] print:text-[8px] print:text-black">
                                Número de pedido
                            </p>

                            <p className="mt-1 text-xl font-bold tracking-wide text-[#4648d4] print:text-[14px] print:text-black">
                                {order.order_number}
                            </p>

                            <p className="mt-1 text-[10px] text-[#767586] print:text-[8px] print:text-black">
                                Gracias por tu compra
                            </p>
                        </div>

                        <div className="my-5 border-t border-dashed border-[#c7c4d7] print:my-3 print:border-[#000]" />

                        {/* =================================================
                            PRODUCTOS
                            ================================================= */}

                        <div>
                            <div className="mb-2 flex justify-between text-[10px] font-bold uppercase tracking-wide text-[#767586] print:text-[8px] print:text-black">
                                <span>Producto</span>
                                <span>Total</span>
                            </div>

                            <ul className="flex flex-col gap-3 print:gap-2">
                                {order.items.map((item, index) => (
                                    <li
                                        key={`${item.product_name}-${index}`}
                                        className="flex items-start justify-between gap-4 text-sm print:gap-2 print:text-[9px]"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium leading-5 text-[#131b2e] print:leading-3 print:text-black">
                                                {item.quantity}× {item.product_name}
                                            </p>

                                            {item.product_sku && (
                                                <p className="mt-0.5 text-[10px] text-[#767586] print:text-[8px] print:text-black">
                                                    SKU: {item.product_sku}
                                                </p>
                                            )}

                                            <p className="text-[10px] text-[#767586] print:text-[8px] print:text-black">
                                                {formatMoney(item.unit_price)} c/u
                                            </p>
                                        </div>

                                        <span className="shrink-0 font-semibold text-[#131b2e] print:text-black">
                                            {formatMoney(item.total)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="my-5 border-t border-dashed border-[#c7c4d7] print:my-3 print:border-[#000]" />

                        {/* =================================================
                            TOTALES
                            ================================================= */}

                        <div className="space-y-2 text-sm print:space-y-1 print:text-[9px]">
                            <div className="flex justify-between">
                                <span className="text-[#686777] print:text-black">
                                    Subtotal
                                </span>

                                <span className="font-medium text-[#131b2e] print:text-black">
                                    {formatMoney(order.subtotal)}
                                </span>
                            </div>

                            {Number(order.discount) > 0 && (
                                <div className="flex justify-between text-emerald-600 print:text-black">
                                    <span>Descuento</span>

                                    <span className="font-medium">
                                        -{formatMoney(order.discount)}
                                    </span>
                                </div>
                            )}

                            <div className="flex justify-between">
                                <span className="text-[#686777] print:text-black">
                                    Envío
                                </span>

                                <span className="font-medium text-[#131b2e] print:text-black">
                                    {formatMoney(order.shipping)}
                                </span>
                            </div>
                        </div>

                        <div className="my-4 border-t border-[#c7c4d7] print:my-3 print:border-[#000]" />

                        {/* Total */}
                        <div className="flex items-center justify-between">
                            <span className="text-base font-bold text-[#131b2e] print:text-[11px] print:text-black">
                                TOTAL
                            </span>

                            <span className="text-xl font-bold text-[#4648d4] print:text-[13px] print:text-black">
                                {formatMoney(order.total)}
                            </span>
                        </div>

                        <div className="my-5 border-t border-dashed border-[#c7c4d7] print:my-3 print:border-[#000]" />

                        {/* =================================================
                            INFORMACIÓN FINAL
                            ================================================= */}

                        <div className="text-center">
                            <p className="text-xs font-medium text-[#131b2e] print:text-[9px] print:text-black">
                                ¡Gracias por tu compra!
                            </p>

                            <p className="mt-1 text-[10px] leading-4 text-[#767586] print:text-[8px] print:leading-3 print:text-black">
                                Conserva este recibo como comprobante de tu compra.
                            </p>

                            <p className="mt-2 text-[9px] text-[#9695a1] print:text-[7px] print:text-black">
                                Colmerzia
                            </p>
                        </div>
                    </div>

                    {/* =====================================================
                        ACCIONES
                    ===================================================== */}

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row print:hidden">
                        <button
                            type="button"
                            onClick={handlePrint}
                            className="
                                inline-flex
                                flex-1
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-[#4648d4]
                                px-5
                                py-3.5
                                text-sm
                                font-semibold
                                text-white
                                shadow-sm
                                transition
                                hover:bg-[#383ab9]
                                hover:shadow-md
                                focus:outline-none
                                focus:ring-4
                                focus:ring-[#4648d4]/20
                            "
                        >
                            <Printer size={17} />
                            Imprimir factura
                        </button>

                        <Link
                            to="/"
                            className="
                                inline-flex
                                flex-1
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-[#d9d8e3]
                                bg-white
                                px-5
                                py-3.5
                                text-center
                                text-sm
                                font-semibold
                                text-[#131b2e]
                                transition
                                hover:border-[#4648d4]
                                hover:bg-[#4648d4]
                                hover:text-white
                            "
                        >
                            Seguir comprando
                        </Link>
                    </div>
                </div>
            </main>

            {/* =============================================================
                ESTILOS EXCLUSIVOS DE IMPRESIÓN
            ============================================================= */}

            <style>
                {`
                    @media print {
                        @page {
                            size: 80mm auto;
                            margin: 0;
                        }

                        html,
                        body {
                            width: 80mm;
                            margin: 0;
                            padding: 0;
                            background: #ffffff !important;
                        }

                        body {
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }

                        /*
                         * Ocultamos absolutamente todo lo que no sea
                         * el recibo.
                         */
                        body * {
                            visibility: hidden;
                        }

                        #thermal-receipt,
                        #thermal-receipt * {
                            visibility: visible;
                        }

                        #thermal-receipt {
                            position: absolute;
                            left: 0;
                            top: 0;

                            width: 80mm !important;
                            max-width: 80mm !important;

                            margin: 0 !important;

                            padding: 4mm !important;

                            box-sizing: border-box;

                            font-family:
                                Arial,
                                Helvetica,
                                sans-serif;

                            color: #000000 !important;

                            background: #ffffff !important;
                        }

                        /*
                         * Evita que el navegador intente dividir
                         * elementos del recibo entre páginas.
                         */
                        #thermal-receipt,
                        #thermal-receipt ul,
                        #thermal-receipt li {
                            break-inside: avoid;
                            page-break-inside: avoid;
                        }

                        /*
                         * No queremos enlaces, botones ni elementos
                         * interactivos en la impresión.
                         */
                        button,
                        a {
                            box-shadow: none !important;
                        }
                    }
                `}
            </style>
        </>
    );
}