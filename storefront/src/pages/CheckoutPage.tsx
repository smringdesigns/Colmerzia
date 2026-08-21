import { useState } from "react";
import type { ReactNode } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { Check, CreditCard, MapPin, User } from "lucide-react";

import { useCart } from "../features/cart/useCart";
import { checkout, extractErrorMessage } from "../features/cart/cartApi";
import { getCustomerAddresses } from "../features/customer/customerApi";
import { useCustomerAuthStore } from "../lib/customerAuthStore";
import { formatMoney } from "../lib/money";
import { useUIStore } from "../lib/uiStore";
import { clearGuestToken } from "../lib/guestToken";

const PAYMENT_METHODS = [
    {
        value: "cash",
        label: "Efectivo contraentrega",
        description: "Paga cuando recibas tu pedido.",
    },
    {
        value: "transfer",
        label: "Transferencia bancaria",
        description: "Realiza una transferencia antes del envío.",
    },
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

    const [selectedAddressId, setSelectedAddressId] = useState<
        number | "new" | null
    >(null);

    const [paymentMethod, setPaymentMethod] = useState(
        PAYMENT_METHODS[0].value
    );

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
        setForm((current) => ({
            ...current,
            [key]: value,
        }));
    }

    const usingSavedAddress =
        isAuthenticated &&
        selectedAddressId !== "new" &&
        selectedAddressId !== null;

    const needsManualAddress =
        !isAuthenticated || selectedAddressId === "new";

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
                    ? {
                          shipping_address_id:
                              selectedAddressId as number,
                      }
                    : {
                          shipping_address: {
                              line1: form.line1,
                              line2: form.line2 || undefined,
                              city: form.city,
                              state: form.state || undefined,
                              country: form.country,
                              postal_code:
                                  form.postal_code || undefined,
                          },
                      }),
            }),
        onSuccess: (order) => {
            clearGuestToken();

            navigate("/confirmacion", {
                state: { order },
            });
        },
        onError: (error) => {
            showToast(
                extractErrorMessage(
                    error,
                    "No se pudo procesar el pedido."
                ),
                "error"
            );
        },
    });

    if (isLoading) {
        return (
            <main className="min-h-[70vh] bg-[#faf8ff] px-4 py-20">
                <div className="mx-auto max-w-6xl">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 w-64 rounded-lg bg-[#eaedff]" />

                        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]">
                            <div className="space-y-5">
                                <div className="h-40 rounded-2xl bg-[#eaedff]" />
                                <div className="h-52 rounded-2xl bg-[#eaedff]" />
                                <div className="h-32 rounded-2xl bg-[#eaedff]" />
                            </div>

                            <div className="h-80 rounded-2xl bg-[#eaedff]" />
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <main className="flex min-h-[70vh] items-center justify-center bg-[#faf8ff] px-4">
                <div className="w-full max-w-md rounded-2xl border border-[#e2e1eb] bg-white p-8 text-center shadow-[0_8px_30px_rgba(35,35,60,0.05)]">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eaedff] text-[#4648d4]">
                        <CreditCard size={24} />
                    </div>

                    <h1 className="mt-5 text-xl font-bold text-[#131b2e]">
                        Tu carrito está vacío
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-[#686777]">
                        Agrega algunos productos antes de continuar con la
                        compra.
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="mt-6 inline-flex rounded-xl bg-[#4648d4] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#383ab9]"
                    >
                        Ver catálogo
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#faf8ff]">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">

                {/* Encabezado */}
                <div className="mb-8">
                    <Link
                        to="/"
                        className="mb-4 inline-flex items-center text-sm font-medium text-[#686777] transition hover:text-[#4648d4]"
                    >
                        ← Volver al catálogo
                    </Link>

                    <h1 className="text-3xl font-bold tracking-tight text-[#131b2e] sm:text-4xl">
                        Finalizar compra
                    </h1>

                    <p className="mt-2 text-sm text-[#686777]">
                        Completa tus datos y revisa tu pedido antes de
                        confirmarlo.
                    </p>
                </div>

                <form
                    className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]"
                    onSubmit={(event) => {
                        event.preventDefault();
                        submit();
                    }}
                >
                    {/* =====================================================
                        COLUMNA IZQUIERDA
                    ===================================================== */}
                    <div className="flex flex-col gap-5">

                        {/* CONTACTO */}
                        <section className="rounded-2xl border border-[#e2e1eb] bg-white p-5 shadow-[0_8px_30px_rgba(35,35,60,0.04)] sm:p-6">
                            <SectionHeader
                                icon={<User size={17} />}
                                number="01"
                                title="Información de contacto"
                            />

                            {!isAuthenticated ? (
                                <>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <Field
                                            label="Nombre completo"
                                            required
                                        >
                                            <input
                                                required
                                                value={form.name}
                                                onChange={(e) =>
                                                    update(
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                                className="checkout-input"
                                                placeholder="Tu nombre"
                                            />
                                        </Field>

                                        <Field
                                            label="Correo electrónico"
                                            required
                                        >
                                            <input
                                                required
                                                type="email"
                                                value={form.email}
                                                onChange={(e) =>
                                                    update(
                                                        "email",
                                                        e.target.value
                                                    )
                                                }
                                                className="checkout-input"
                                                placeholder="correo@ejemplo.com"
                                            />
                                        </Field>

                                        <Field label="Teléfono">
                                            <input
                                                value={form.phone}
                                                onChange={(e) =>
                                                    update(
                                                        "phone",
                                                        e.target.value
                                                    )
                                                }
                                                className="checkout-input"
                                                placeholder="300 000 0000"
                                            />
                                        </Field>
                                    </div>

                                    <p className="mt-4 rounded-xl bg-[#f7f7fb] px-4 py-3 text-xs leading-5 text-[#686777]">
                                        ¿Ya tienes una cuenta?{" "}
                                        <Link
                                            to="/login"
                                            className="font-semibold text-[#4648d4] underline"
                                        >
                                            Inicia sesión
                                        </Link>{" "}
                                        para utilizar tus direcciones
                                        guardadas.
                                    </p>
                                </>
                            ) : (
                                <div className="rounded-xl border border-[#e2e1eb] bg-[#faf8ff] p-4">
                                    <p className="text-sm font-bold text-[#131b2e]">
                                        {customer?.full_name}
                                    </p>

                                    <p className="mt-1 text-sm text-[#686777]">
                                        {customer?.email}
                                        {customer?.phone
                                            ? ` · ${customer.phone}`
                                            : ""}
                                    </p>

                                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#e9eaff] px-3 py-1 text-xs font-semibold text-[#4648d4]">
                                        <Check size={13} />
                                        Sesión iniciada
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* DIRECCIÓN */}
                        <section className="rounded-2xl border border-[#e2e1eb] bg-white p-5 shadow-[0_8px_30px_rgba(35,35,60,0.04)] sm:p-6">
                            <SectionHeader
                                icon={<MapPin size={17} />}
                                number="02"
                                title="Dirección de envío"
                            />

                            {isAuthenticated &&
                                addresses &&
                                addresses.length > 0 && (
                                    <div className="space-y-3">
                                        {addresses.map((address) => (
                                            <label
                                                key={address.id}
                                                className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition ${
                                                    selectedAddressId ===
                                                    address.id
                                                        ? "border-[#4648d4] bg-[#f7f7ff] shadow-sm"
                                                        : "border-[#e2e1eb] bg-white hover:border-[#aaa9b8]"
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="address"
                                                    checked={
                                                        selectedAddressId ===
                                                        address.id
                                                    }
                                                    onChange={() =>
                                                        setSelectedAddressId(
                                                            address.id
                                                        )
                                                    }
                                                    className="mt-1 accent-[#4648d4]"
                                                />

                                                <span className="min-w-0 text-sm">
                                                    <span className="flex flex-wrap items-center gap-2 font-bold text-[#131b2e]">
                                                        {address.label ||
                                                            "Dirección"}

                                                        {address.is_default && (
                                                            <span className="rounded-full bg-[#e9eaff] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#4648d4]">
                                                                Predeterminada
                                                            </span>
                                                        )}
                                                    </span>

                                                    <span className="mt-1 block leading-5 text-[#686777]">
                                                        {
                                                            address.recipient_name
                                                        }{" "}
                                                        ·{" "}
                                                        {
                                                            address.address_line_1
                                                        }
                                                        {address.address_line_2
                                                            ? `, ${address.address_line_2}`
                                                            : ""}
                                                    </span>

                                                    <span className="block text-[#686777]">
                                                        {address.city}
                                                        {address.state
                                                            ? `, ${address.state}`
                                                            : ""}
                                                        {address.country
                                                            ? `, ${address.country}`
                                                            : ""}
                                                    </span>
                                                </span>
                                            </label>
                                        ))}

                                        <label
                                            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm transition ${
                                                selectedAddressId === "new"
                                                    ? "border-[#4648d4] bg-[#f7f7ff]"
                                                    : "border-[#e2e1eb] hover:border-[#aaa9b8]"
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="address"
                                                checked={
                                                    selectedAddressId === "new"
                                                }
                                                onChange={() =>
                                                    setSelectedAddressId(
                                                        "new"
                                                    )
                                                }
                                                className="accent-[#4648d4]"
                                            />

                                            <span className="font-semibold text-[#131b2e]">
                                                Usar otra dirección
                                            </span>
                                        </label>
                                    </div>
                                )}

                            {needsManualAddress && (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field
                                        label="Dirección"
                                        required
                                        className="sm:col-span-2"
                                    >
                                        <input
                                            required
                                            value={form.line1}
                                            onChange={(e) =>
                                                update(
                                                    "line1",
                                                    e.target.value
                                                )
                                            }
                                            className="checkout-input"
                                            placeholder="Calle, carrera, número..."
                                        />
                                    </Field>

                                    <Field
                                        label="Complemento"
                                        className="sm:col-span-2"
                                    >
                                        <input
                                            value={form.line2}
                                            onChange={(e) =>
                                                update(
                                                    "line2",
                                                    e.target.value
                                                )
                                            }
                                            className="checkout-input"
                                            placeholder="Apartamento, piso, referencia..."
                                        />
                                    </Field>

                                    <Field label="Ciudad" required>
                                        <input
                                            required
                                            value={form.city}
                                            onChange={(e) =>
                                                update(
                                                    "city",
                                                    e.target.value
                                                )
                                            }
                                            className="checkout-input"
                                            placeholder="Ciudad"
                                        />
                                    </Field>

                                    <Field label="Departamento / estado">
                                        <input
                                            value={form.state}
                                            onChange={(e) =>
                                                update(
                                                    "state",
                                                    e.target.value
                                                )
                                            }
                                            className="checkout-input"
                                            placeholder="Departamento"
                                        />
                                    </Field>

                                    <Field label="País" required>
                                        <input
                                            required
                                            value={form.country}
                                            onChange={(e) =>
                                                update(
                                                    "country",
                                                    e.target.value
                                                )
                                            }
                                            className="checkout-input"
                                            placeholder="País"
                                        />
                                    </Field>

                                    <Field label="Código postal">
                                        <input
                                            value={form.postal_code}
                                            onChange={(e) =>
                                                update(
                                                    "postal_code",
                                                    e.target.value
                                                )
                                            }
                                            className="checkout-input"
                                            placeholder="Opcional"
                                        />
                                    </Field>
                                </div>
                            )}
                        </section>

                        {/* PAGO */}
                        <section className="rounded-2xl border border-[#e2e1eb] bg-white p-5 shadow-[0_8px_30px_rgba(35,35,60,0.04)] sm:p-6">
                            <SectionHeader
                                icon={<CreditCard size={17} />}
                                number="03"
                                title="Método de pago"
                            />

                            <div className="grid gap-3 sm:grid-cols-2">
                                {PAYMENT_METHODS.map((method) => (
                                    <label
                                        key={method.value}
                                        className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition ${
                                            paymentMethod === method.value
                                                ? "border-[#4648d4] bg-[#f7f7ff] shadow-sm"
                                                : "border-[#e2e1eb] hover:border-[#aaa9b8]"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            checked={
                                                paymentMethod ===
                                                method.value
                                            }
                                            onChange={() =>
                                                setPaymentMethod(
                                                    method.value
                                                )
                                            }
                                            className="mt-1 accent-[#4648d4]"
                                        />

                                        <span>
                                            <span className="block text-sm font-bold text-[#131b2e]">
                                                {method.label}
                                            </span>

                                            <span className="mt-1 block text-xs leading-5 text-[#686777]">
                                                {method.description}
                                            </span>
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </section>

                        {/* BOTÓN MÓVIL */}
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex h-12 w-full items-center justify-center rounded-xl bg-[#4648d4] px-6 text-sm font-bold text-white shadow-sm transition hover:bg-[#383ab9] disabled:cursor-not-allowed disabled:opacity-50 lg:hidden"
                        >
                            {isPending
                                ? "Procesando pedido..."
                                : `Confirmar pedido · ${formatMoney(
                                      cart.total
                                  )}`}
                        </button>
                    </div>

                    {/* =====================================================
                        RESUMEN
                    ===================================================== */}
                    <aside className="lg:sticky lg:top-24">
                        <div className="overflow-hidden rounded-2xl border border-[#e2e1eb] bg-white shadow-[0_8px_30px_rgba(35,35,60,0.05)]">

                            {/* Cabecera */}
                            <div className="border-b border-[#eeeef3] px-5 py-4 sm:px-6">
                                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#686777]">
                                    Resumen del pedido
                                </p>

                                <p className="mt-1 text-sm text-[#9695a1]">
                                    {cart.items.length}{" "}
                                    {cart.items.length === 1
                                        ? "producto"
                                        : "productos"}
                                </p>
                            </div>

                            {/* Productos */}
                            <div className="px-5 py-5 sm:px-6">
                                <ul className="flex flex-col gap-4">
                                    {cart.items.map((item) => (
                                        <li
                                            key={item.id}
                                            className="flex items-start justify-between gap-4"
                                        >
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-[#131b2e]">
                                                    {item.product_name}
                                                </p>

                                                {item.variant_name && (
                                                    <p className="mt-0.5 text-xs text-[#9695a1]">
                                                        {item.variant_name}
                                                    </p>
                                                )}

                                                <p className="mt-1 text-xs text-[#686777]">
                                                    Cantidad: {item.quantity}
                                                </p>
                                            </div>

                                            <span className="shrink-0 text-sm font-bold text-[#131b2e]">
                                                {formatMoney(item.total)}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Totales */}
                            <div className="border-t border-[#eeeef3] px-5 py-5 sm:px-6">
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between text-[#686777]">
                                        <span>Subtotal</span>
                                        <span className="font-medium text-[#131b2e]">
                                            {formatMoney(cart.subtotal)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between text-[#686777]">
                                        <span>Descuento</span>
                                        <span className="font-medium text-emerald-600">
                                            {Number(cart.discount) > 0
                                                ? `-${formatMoney(
                                                      cart.discount
                                                  )}`
                                                : formatMoney("0")}
                                        </span>
                                    </div>

                                    <div className="flex justify-between text-[#686777]">
                                        <span>Envío</span>
                                        <span className="font-medium text-[#131b2e]">
                                            {formatMoney(cart.shipping)}
                                        </span>
                                    </div>
                                </div>

                                <div className="my-5 border-t border-dashed border-[#d9d8e3]" />

                                <div className="flex items-end justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-bold text-[#131b2e]">
                                            Total
                                        </p>

                                        <p className="mt-1 text-xs text-[#9695a1]">
                                            Impuestos incluidos si aplican
                                        </p>
                                    </div>

                                    <span className="text-2xl font-bold tracking-tight text-[#4648d4]">
                                        {formatMoney(cart.total)}
                                    </span>
                                </div>

                                {/* Botón escritorio */}
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="mt-6 hidden h-12 w-full items-center justify-center rounded-xl bg-[#4648d4] px-6 text-sm font-bold text-white shadow-sm transition hover:bg-[#383ab9] disabled:cursor-not-allowed disabled:opacity-50 lg:flex"
                                >
                                    {isPending
                                        ? "Procesando pedido..."
                                        : "Confirmar pedido"}
                                </button>

                                <p className="mt-4 text-center text-[11px] leading-4 text-[#9695a1]">
                                    Al confirmar tu pedido aceptas las
                                    condiciones de compra de la tienda.
                                </p>
                            </div>
                        </div>
                    </aside>
                </form>
            </div>
        </main>
    );
}

/* =========================================================
   COMPONENTES AUXILIARES
========================================================= */

function SectionHeader({
    icon,
    number,
    title,
}: {
    icon: ReactNode;
    number: string;
    title: string;
}) {
    return (
        <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e9eaff] text-[#4648d4]">
                {icon}
            </div>

            <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9695a1]">
                    Paso {number}
                </p>

                <h2 className="text-base font-bold text-[#131b2e] sm:text-lg">
                    {title}
                </h2>
            </div>
        </div>
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
        <label className={`flex flex-col gap-1.5 ${className ?? ""}`}>
            <span className="text-xs font-semibold text-[#464554]">
                {label}
                {required && (
                    <span className="ml-1 text-[#4648d4]">*</span>
                )}
            </span>

            {children}
        </label>
    );
}