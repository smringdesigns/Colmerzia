import { useState } from "react";
import type { ReactNode } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { useCart } from "../features/cart/useCart";
import { checkout, extractErrorMessage } from "../features/cart/cartApi";
import { getCustomerAddresses } from "../features/customer/customerApi";
import { useCustomerAuthStore } from "../lib/customerAuthStore";
import { formatMoney } from "../lib/money";
import { useUIStore } from "../lib/uiStore";
import { clearGuestToken } from "../lib/guestToken";

const PAYMENT_METHODS = [
    { value: "cash", label: "Efectivo contraentrega" },
    { value: "transfer", label: "Transferencia bancaria" },
    // PSE/tarjeta se agregan acá cuando haya pasarela conectada —
    // el backend ya está listo para recibir el método, solo falta
    // que ManualPaymentGateway deje de ser la única disponible.
];

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { cart, isLoading } = useCart();
    const showToast = useUIStore((s) => s.showToast);

    const isAuthenticated = useCustomerAuthStore((s) => s.isAuthenticated);
    const customer = useCustomerAuthStore((s) => s.customer);

    const { data: addresses } = useQuery({
        queryKey: ["customer-addresses"],
        queryFn: getCustomerAddresses,
        enabled: isAuthenticated,
    });

    const [selectedAddressId, setSelectedAddressId] = useState<number | "new" | null>(null);
    const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0].value);

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

    const usingSavedAddress =
        isAuthenticated && selectedAddressId !== "new" && selectedAddressId !== null;

    const needsManualAddress = !isAuthenticated || selectedAddressId === "new";

    const { mutate: submit, isPending } = useMutation({
        mutationFn: () =>
            checkout({
                payment_method: paymentMethod,
                ...(isAuthenticated
                    ? {}
                    : {
                          customer: {
                              name: form.name,
                              email: form.email,
                              phone: form.phone || undefined,
                          },
                      }),
                ...(usingSavedAddress
                    ? { shipping_address_id: selectedAddressId as number }
                    : {
                          shipping_address: {
                              line1: form.line1,
                              line2: form.line2 || undefined,
                              city: form.city,
                              state: form.state || undefined,
                              country: form.country,
                              postal_code: form.postal_code || undefined,
                          },
                      }),
            }),
        onSuccess: (order) => {
            clearGuestToken();
            navigate("/confirmacion", { state: { order } });
        },
        onError: (error) => {
            showToast(extractErrorMessage(error, "No se pudo procesar el pedido."), "error");
        },
    });

    if (isLoading) {
        return <p className="py-24 text-center text-sm text-[var(--color-ink-soft)]">Cargando...</p>;
    }

    if (!cart || cart.items.length === 0) {
        return (
            <main className="mx-auto max-w-xl px-5 py-24 text-center">
                <p className="text-sm text-[var(--color-ink-soft)]">Tu carrito está vacío.</p>
                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="mt-4 rounded-md bg-[var(--color-pine)] px-5 py-2 text-sm text-[var(--color-stone)]"
                >
                    Ver catálogo
                </button>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-4xl px-5 py-10">
            <h1 className="font-display text-3xl">Finalizar compra</h1>

            <form
                className="mt-8 grid gap-10 md:grid-cols-[1.3fr_1fr]"
                onSubmit={(event) => {
                    event.preventDefault();
                    submit();
                }}
            >
                <div className="flex flex-col gap-8">
                    {!isAuthenticated && (
                        <section>
                            <h2 className="mb-3 font-display text-lg">Contacto</h2>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <Field label="Nombre completo" required>
                                    <input
                                        required
                                        value={form.name}
                                        onChange={(e) => update("name", e.target.value)}
                                        className="field-input"
                                    />
                                </Field>
                                <Field label="Correo electrónico" required>
                                    <input
                                        required
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => update("email", e.target.value)}
                                        className="field-input"
                                    />
                                </Field>
                                <Field label="Teléfono">
                                    <input
                                        value={form.phone}
                                        onChange={(e) => update("phone", e.target.value)}
                                        className="field-input"
                                    />
                                </Field>
                            </div>
                            <p className="mt-3 text-xs text-[var(--color-ink-soft)]">
                                ¿Ya tienes cuenta?{" "}
                                <a href="/login" className="text-[var(--color-pine)] underline">
                                    Inicia sesión
                                </a>{" "}
                                para usar tus direcciones guardadas.
                            </p>
                        </section>
                    )}

                    {isAuthenticated && customer && (
                        <section>
                            <h2 className="mb-3 font-display text-lg">Contacto</h2>
                            <p className="text-sm text-[var(--color-ink-soft)]">
                                {customer.full_name} · {customer.email}
                                {customer.phone ? ` · ${customer.phone}` : ""}
                            </p>
                        </section>
                    )}

                    <section>
                        <h2 className="mb-3 font-display text-lg">Dirección de envío</h2>

                        {isAuthenticated && addresses && addresses.length > 0 && (
                            <div className="mb-4 flex flex-col gap-2">
                                {addresses.map((address) => (
                                    <label
                                        key={address.id}
                                        className="flex cursor-pointer items-start gap-3 rounded-md border border-[var(--color-line)] p-3 text-sm has-[:checked]:border-[var(--color-pine)]"
                                    >
                                        <input
                                            type="radio"
                                            name="address"
                                            checked={selectedAddressId === address.id}
                                            onChange={() => setSelectedAddressId(address.id)}
                                            className="mt-1"
                                        />
                                        <span>
                                            <strong>{address.label || "Dirección"}</strong>
                                            <br />
                                            {address.recipient_name} · {address.address_line_1},{" "}
                                            {address.city}
                                        </span>
                                    </label>
                                ))}
                                <label className="flex cursor-pointer items-center gap-3 rounded-md border border-[var(--color-line)] p-3 text-sm has-[:checked]:border-[var(--color-pine)]">
                                    <input
                                        type="radio"
                                        name="address"
                                        checked={selectedAddressId === "new"}
                                        onChange={() => setSelectedAddressId("new")}
                                    />
                                    Usar otra dirección
                                </label>
                            </div>
                        )}

                        {needsManualAddress && (
                            <div className="grid gap-3 sm:grid-cols-2">
                                <Field label="Dirección" required className="sm:col-span-2">
                                    <input
                                        required
                                        value={form.line1}
                                        onChange={(e) => update("line1", e.target.value)}
                                        className="field-input"
                                    />
                                </Field>
                                <Field label="Complemento (opcional)" className="sm:col-span-2">
                                    <input
                                        value={form.line2}
                                        onChange={(e) => update("line2", e.target.value)}
                                        className="field-input"
                                    />
                                </Field>
                                <Field label="Ciudad" required>
                                    <input
                                        required
                                        value={form.city}
                                        onChange={(e) => update("city", e.target.value)}
                                        className="field-input"
                                    />
                                </Field>
                                <Field label="Departamento / estado">
                                    <input
                                        value={form.state}
                                        onChange={(e) => update("state", e.target.value)}
                                        className="field-input"
                                    />
                                </Field>
                                <Field label="País" required>
                                    <input
                                        required
                                        value={form.country}
                                        onChange={(e) => update("country", e.target.value)}
                                        className="field-input"
                                    />
                                </Field>
                                <Field label="Código postal">
                                    <input
                                        value={form.postal_code}
                                        onChange={(e) => update("postal_code", e.target.value)}
                                        className="field-input"
                                    />
                                </Field>
                            </div>
                        )}
                    </section>

                    <section>
                        <h2 className="mb-3 font-display text-lg">Método de pago</h2>
                        <div className="flex flex-col gap-2">
                            {PAYMENT_METHODS.map((method) => (
                                <label
                                    key={method.value}
                                    className="flex cursor-pointer items-center gap-3 rounded-md border border-[var(--color-line)] p-3 text-sm has-[:checked]:border-[var(--color-pine)]"
                                >
                                    <input
                                        type="radio"
                                        name="payment_method"
                                        checked={paymentMethod === method.value}
                                        onChange={() => setPaymentMethod(method.value)}
                                    />
                                    {method.label}
                                </label>
                            ))}
                        </div>
                    </section>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full rounded-md bg-[var(--color-pine)] py-3 text-sm font-medium text-[var(--color-stone)] transition hover:bg-[var(--color-pine-dark)] disabled:opacity-50 md:hidden"
                    >
                        {isPending ? "Procesando..." : `Pagar ${formatMoney(cart.total)}`}
                    </button>
                </div>

                <aside className="receipt h-fit p-5">
                    <p className="mb-3 font-mono text-xs uppercase tracking-widest text-[var(--color-ink-soft)]">
                        Resumen del pedido
                    </p>

                    <ul className="mb-3 flex flex-col gap-2">
                        {cart.items.map((item) => (
                            <li key={item.id} className="receipt-row">
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
                        <span>{formatMoney(cart.subtotal)}</span>
                    </div>
                    <div className="receipt-row">
                        <span>Descuento</span>
                        <span>-{formatMoney(cart.discount)}</span>
                    </div>
                    <div className="receipt-row">
                        <span>Envío</span>
                        <span>{formatMoney(cart.shipping)}</span>
                    </div>
                    <div className="receipt-row total">
                        <span>Total</span>
                        <span>{formatMoney(cart.total)}</span>
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="mt-5 hidden w-full rounded-md bg-[var(--color-pine)] py-3 text-sm font-medium text-[var(--color-stone)] transition hover:bg-[var(--color-pine-dark)] disabled:opacity-50 md:block"
                    >
                        {isPending ? "Procesando..." : "Confirmar pedido"}
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
    children: ReactNode;
    className?: string;
}) {
    return (
        <label className={`flex flex-col gap-1 ${className ?? ""}`}>
            <span className="text-xs text-[var(--color-ink-soft)]">
                {label}
                {required && " *"}
            </span>
            {children}
        </label>
    );
}
