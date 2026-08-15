import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { useCart } from "../features/cart/useCart";
import { checkout, extractErrorMessage } from "../features/cart/cartApi";
import { formatMoney } from "../lib/money";
import { useUIStore } from "../lib/uiStore";
import { clearGuestToken } from "../lib/guestToken";

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { cart, isLoading } = useCart();
    const showToast = useUIStore((s) => s.showToast);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        line1: "",
        line2: "",
        city: "",
        state: "",
        country: "",
        postal_code: "",
    });

    function update<K extends keyof typeof form>(key: K, value: string) {
        setForm((current) => ({ ...current, [key]: value }));
    }

    const { mutate: submit, isPending } = useMutation({
        mutationFn: () =>
            checkout({
                customer: { name: form.name, email: form.email, phone: form.phone || undefined },
                shipping_address: {
                    line1: form.line1,
                    line2: form.line2 || undefined,
                    city: form.city,
                    state: form.state || undefined,
                    country: form.country,
                    postal_code: form.postal_code || undefined,
                },
            }),
        onSuccess: (order) => {
            clearGuestToken(); // el carrito ya se convirtió en pedido
            navigate("/confirmacion", { state: { order } });
        },
        onError: (error) => {
            showToast(extractErrorMessage(error, "No se pudo procesar el pedido."), "error");
        },
    });

    if (isLoading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <p className="text-sm font-medium text-[#767586]">Cargando carrito...</p>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <main className="mx-auto max-w-xl px-4 py-24 text-center">
                <p className="text-base font-semibold text-[#131b2e]">Tu carrito está vacío.</p>
                <p className="mt-1 text-sm text-[#464554]">Agrega algunos productos antes de finalizar la compra.</p>
                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#4648d4] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#6063ee]"
                >
                    Ver catálogo
                </button>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-[#131b2e]">Finalizar compra</h1>

            <form
                className="mt-8 grid gap-12 lg:grid-cols-[1.4fr_1fr]"
                onSubmit={(event) => {
                    event.preventDefault();
                    submit();
                }}
            >
                {/* Formulario de Datos y Dirección */}
                <div className="flex flex-col gap-10">
                    <section className="rounded-2xl border border-[#c7c4d7]/60 bg-white p-6 shadow-sm sm:p-8">
                        <h2 className="mb-4 text-lg font-semibold text-[#131b2e]">Información de contacto</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Nombre completo" required className="sm:col-span-2">
                                <input
                                    required
                                    value={form.name}
                                    onChange={(e) => update("name", e.target.value)}
                                    placeholder="Ej. Juan Pérez"
                                    className="w-full rounded-lg border border-[#c7c4d7] bg-white px-4 py-2.5 text-sm text-[#131b2e] outline-none transition focus:border-[#4648d4] focus:ring-2 focus:ring-[#4648d4]/20"
                                />
                            </Field>
                            <Field label="Correo electrónico" required>
                                <input
                                    required
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => update("email", e.target.value)}
                                    placeholder="correo@ejemplo.com"
                                    className="w-full rounded-lg border border-[#c7c4d7] bg-white px-4 py-2.5 text-sm text-[#131b2e] outline-none transition focus:border-[#4648d4] focus:ring-2 focus:ring-[#4648d4]/20"
                                />
                            </Field>
                            <Field label="Teléfono">
                                <input
                                    value={form.phone}
                                    onChange={(e) => update("phone", e.target.value)}
                                    placeholder="3001234567"
                                    className="w-full rounded-lg border border-[#c7c4d7] bg-white px-4 py-2.5 text-sm text-[#131b2e] outline-none transition focus:border-[#4648d4] focus:ring-2 focus:ring-[#4648d4]/20"
                                />
                            </Field>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-[#c7c4d7]/60 bg-white p-6 shadow-sm sm:p-8">
                        <h2 className="mb-4 text-lg font-semibold text-[#131b2e]">Dirección de envío</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Dirección" required className="sm:col-span-2">
                                <input
                                    required
                                    value={form.line1}
                                    onChange={(e) => update("line1", e.target.value)}
                                    placeholder="Calle, número, barrio"
                                    className="w-full rounded-lg border border-[#c7c4d7] bg-white px-4 py-2.5 text-sm text-[#131b2e] outline-none transition focus:border-[#4648d4] focus:ring-2 focus:ring-[#4648d4]/20"
                                />
                            </Field>
                            <Field label="Complemento (opcional)" className="sm:col-span-2">
                                <input
                                    value={form.line2}
                                    onChange={(e) => update("line2", e.target.value)}
                                    placeholder="Apartamento, torre, interior, etc."
                                    className="w-full rounded-lg border border-[#c7c4d7] bg-white px-4 py-2.5 text-sm text-[#131b2e] outline-none transition focus:border-[#4648d4] focus:ring-2 focus:ring-[#4648d4]/20"
                                />
                            </Field>
                            <Field label="Ciudad" required>
                                <input
                                    required
                                    value={form.city}
                                    onChange={(e) => update("city", e.target.value)}
                                    placeholder="Valledupar"
                                    className="w-full rounded-lg border border-[#c7c4d7] bg-white px-4 py-2.5 text-sm text-[#131b2e] outline-none transition focus:border-[#4648d4] focus:ring-2 focus:ring-[#4648d4]/20"
                                />
                            </Field>
                            <Field label="Departamento / estado">
                                <input
                                    value={form.state}
                                    onChange={(e) => update("state", e.target.value)}
                                    placeholder="Cesar"
                                    className="w-full rounded-lg border border-[#c7c4d7] bg-white px-4 py-2.5 text-sm text-[#131b2e] outline-none transition focus:border-[#4648d4] focus:ring-2 focus:ring-[#4648d4]/20"
                                />
                            </Field>
                            <Field label="País" required>
                                <input
                                    required
                                    value={form.country}
                                    onChange={(e) => update("country", e.target.value)}
                                    placeholder="Colombia"
                                    className="w-full rounded-lg border border-[#c7c4d7] bg-white px-4 py-2.5 text-sm text-[#131b2e] outline-none transition focus:border-[#4648d4] focus:ring-2 focus:ring-[#4648d4]/20"
                                />
                            </Field>
                            <Field label="Código postal">
                                <input
                                    value={form.postal_code}
                                    onChange={(e) => update("postal_code", e.target.value)}
                                    placeholder="200001"
                                    className="w-full rounded-lg border border-[#c7c4d7] bg-white px-4 py-2.5 text-sm text-[#131b2e] outline-none transition focus:border-[#4648d4] focus:ring-2 focus:ring-[#4648d4]/20"
                                />
                            </Field>
                        </div>
                    </section>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full rounded-lg bg-[#4648d4] py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#6063ee] disabled:opacity-50 lg:hidden"
                    >
                        {isPending ? "Procesando..." : `Pagar ${formatMoney(cart.total)}`}
                    </button>
                </div>

                {/* Resumen del pedido (Estilo Ticket) */}
                <aside className="h-fit rounded-2xl border border-[#c7c4d7]/60 bg-white p-6 shadow-sm">
                    <p className="mb-4 font-mono text-xs uppercase tracking-widest text-[#767586]">
                        Resumen del pedido
                    </p>

                    <ul className="mb-4 flex flex-col gap-3">
                        {cart.items.map((item) => (
                            <li key={item.id} className="flex items-center justify-between text-sm">
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
                        <div className="flex justify-between">
                            <span>Envío</span>
                            <span className="font-medium text-[#131b2e]">{formatMoney(cart.shipping)}</span>
                        </div>

                        <div className="my-3 border-t border-[#c7c4d7]/50" />

                        <div className="flex items-center justify-between text-base font-bold text-[#131b2e]">
                            <span>Total</span>
                            <span className="text-lg text-[#4648d4]">{formatMoney(cart.total)}</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="mt-6 hidden w-full rounded-lg bg-[#4648d4] py-3.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-[#6063ee] disabled:opacity-50 lg:block"
                    >
                        {isPending ? "Procesando pedido..." : "Confirmar pedido"}
                    </button>
                </aside>
            </form>
        </main>
    );
}

function Field({
    label,
    required,
    children,
    className,
}: {
    label: string;
    required?: boolean;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <label className={`flex flex-col gap-1.5 ${className ?? ""}`}>
            <span className="text-xs font-semibold text-[#464554]">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </span>
            {children}
        </label>
    );
}