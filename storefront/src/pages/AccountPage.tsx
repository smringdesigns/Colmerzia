import { useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate, useNavigate } from "react-router-dom";
import {
    Check,
    MapPin,
    Pencil,
    Plus,
    Trash2,
    User,
} from "lucide-react";

import {
    createCustomerAddress,
    deleteCustomerAddress,
    extractErrorMessage,
    getCustomerAddresses,
    logoutCustomer,
    updateCustomerAddress,
    type CustomerAddress,
    type SaveAddressPayload,
} from "../features/customer/customerApi";
import { useCustomerAuthStore } from "../lib/customerAuthStore";
import { useUIStore } from "../lib/uiStore";

const EMPTY_FORM: SaveAddressPayload = {
    label: "",
    recipient_name: "",
    phone: "",
    address_line_1: "",
    address_line_2: "",
    country: "Colombia",
    state: "",
    city: "",
    postal_code: "",
    is_shipping: true,
    is_billing: false,
    is_default: false,
    notes: "",
};

const INPUT_CLASS =
    "block w-full min-w-0 rounded-xl border border-[#e2e1eb] bg-white px-3.5 py-3 text-sm text-[#131b2e] outline-none transition placeholder:text-[#9695a1] focus:border-[#4648d4] focus:ring-2 focus:ring-[#4648d4]/10";

export default function AccountPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const showToast = useUIStore((s) => s.showToast);

    const customer = useCustomerAuthStore((s) => s.customer);
    const isAuthenticated = useCustomerAuthStore(
        (s) => s.isAuthenticated
    );
    const clearSession = useCustomerAuthStore((s) => s.clearSession);

    const [editing, setEditing] = useState<CustomerAddress | "new" | null>(
        null
    );

    const [form, setForm] =
        useState<SaveAddressPayload>(EMPTY_FORM);

    const { data: addresses, isLoading } = useQuery({
        queryKey: ["customer-addresses"],
        queryFn: getCustomerAddresses,
        enabled: isAuthenticated,
    });

    function openNew() {
        setForm({
            ...EMPTY_FORM,
        });

        setEditing("new");
    }

    function openEdit(address: CustomerAddress) {
        setForm({
            label: address.label ?? "",
            recipient_name: address.recipient_name ?? "",
            phone: address.phone ?? "",
            address_line_1: address.address_line_1 ?? "",
            address_line_2: address.address_line_2 ?? "",
            country: address.country ?? "Colombia",
            state: address.state ?? "",
            city: address.city ?? "",
            postal_code: address.postal_code ?? "",
            is_shipping: address.is_shipping ?? true,
            is_billing: address.is_billing ?? false,
            is_default: address.is_default ?? false,
            notes: address.notes ?? "",
        });

        setEditing(address);
    }

    const { mutate: save, isPending: isSaving } = useMutation({
        mutationFn: () =>
            editing === "new" || !editing
                ? createCustomerAddress(form)
                : updateCustomerAddress(editing.id, form),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["customer-addresses"],
            });

            showToast("Dirección guardada correctamente.");
            setEditing(null);
        },

        onError: (error) => {
            showToast(
                extractErrorMessage(
                    error,
                    "No se pudo guardar la dirección."
                ),
                "error"
            );
        },
    });

    const { mutate: remove, isPending: isDeleting } = useMutation({
        mutationFn: (id: number) => deleteCustomerAddress(id),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["customer-addresses"],
            });

            showToast("Dirección eliminada.");
        },

        onError: (error) => {
            showToast(
                extractErrorMessage(
                    error,
                    "No se pudo eliminar la dirección."
                ),
                "error"
            );
        },
    });

    const { mutate: logout, isPending: isLoggingOut } = useMutation({
        mutationFn: logoutCustomer,

        onSuccess: () => {
            clearSession();
            navigate("/");
        },

        onError: () => {
            clearSession();
            navigate("/");
        },
    });

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <main className="min-h-screen bg-[#faf8ff]">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">

                {/* =====================================================
                    ENCABEZADO
                ===================================================== */}

                <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9695a1]">
                            Cuenta
                        </p>

                        <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#131b2e] sm:text-4xl">
                            Mi cuenta
                        </h1>

                        <p className="mt-2 text-sm text-[#686777]">
                            Administra tu información y las direcciones
                            utilizadas para tus pedidos.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => logout()}
                        disabled={isLoggingOut}
                        className="inline-flex h-11 w-fit items-center justify-center rounded-xl border border-[#e2e1eb] bg-white px-5 text-sm font-semibold text-[#464554] shadow-sm transition hover:border-[#4648d4] hover:text-[#4648d4] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isLoggingOut
                            ? "Cerrando sesión..."
                            : "Cerrar sesión"}
                    </button>
                </div>

                <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.65fr)]">

                    {/* =================================================
                        COLUMNA PRINCIPAL
                    ================================================= */}

                    <div className="flex flex-col gap-5">

                        {/* PERFIL */}

                        <section className="rounded-2xl border border-[#e2e1eb] bg-white p-5 shadow-[0_8px_30px_rgba(35,35,60,0.04)] sm:p-6">
                            <SectionHeader
                                icon={<User size={17} />}
                                number="01"
                                title="Información de cuenta"
                            />

                            <div className="rounded-xl border border-[#e2e1eb] bg-[#faf8ff] p-4 sm:p-5">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e9eaff] text-[#4648d4]">
                                        <User size={21} />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-base font-bold text-[#131b2e]">
                                            {customer?.full_name}
                                        </p>

                                        <p className="mt-1 break-words text-sm text-[#686777]">
                                            {customer?.email}
                                        </p>

                                        {customer?.phone && (
                                            <p className="mt-0.5 text-sm text-[#686777]">
                                                {customer.phone}
                                            </p>
                                        )}

                                        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#e9eaff] px-3 py-1 text-xs font-semibold text-[#4648d4]">
                                            <Check size={13} />
                                            Sesión iniciada
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* =================================================
                            DIRECCIONES
                        ================================================= */}

                        <section className="rounded-2xl border border-[#e2e1eb] bg-white p-5 shadow-[0_8px_30px_rgba(35,35,60,0.04)] sm:p-6">

                            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <SectionHeader
                                    icon={<MapPin size={17} />}
                                    number="02"
                                    title="Mis direcciones"
                                    marginBottom={false}
                                />

                                <button
                                    type="button"
                                    onClick={openNew}
                                    className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#4648d4] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#383ab9]"
                                >
                                    <Plus size={16} />
                                    <span>
                                        Agregar dirección
                                    </span>
                                </button>
                            </div>

                            <p className="mb-5 text-sm leading-6 text-[#686777]">
                                Guarda tus direcciones para utilizarlas
                                rápidamente al momento de realizar tus
                                pedidos.
                            </p>

                            {/* CARGANDO */}

                            {isLoading && (
                                <div className="flex flex-col gap-3">
                                    {[1, 2].map((item) => (
                                        <div
                                            key={item}
                                            className="h-28 animate-pulse rounded-xl bg-[#eaedff]"
                                        />
                                    ))}
                                </div>
                            )}

                            {/* SIN DIRECCIONES */}

                            {!isLoading &&
                                addresses?.length === 0 && (
                                    <div className="rounded-xl border border-dashed border-[#d9d8e3] bg-[#faf8ff] px-6 py-10 text-center">
                                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#e9eaff] text-[#4648d4]">
                                            <MapPin size={20} />
                                        </div>

                                        <h3 className="mt-4 text-sm font-bold text-[#131b2e]">
                                            No tienes direcciones guardadas
                                        </h3>

                                        <p className="mt-1 text-sm text-[#686777]">
                                            Agrega una dirección para
                                            facilitar tus próximos pedidos.
                                        </p>

                                        <button
                                            type="button"
                                            onClick={openNew}
                                            className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-[#4648d4] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#383ab9]"
                                        >
                                            <Plus size={15} />
                                            Agregar dirección
                                        </button>
                                    </div>
                                )}

                            {/* LISTA */}

                            {!isLoading &&
                                addresses &&
                                addresses.length > 0 && (
                                    <ul className="flex flex-col gap-3">
                                        {addresses.map((address) => (
                                            <li
                                                key={address.id}
                                                className="group rounded-xl border border-[#e2e1eb] bg-white p-4 transition hover:border-[#aaa9b8] hover:shadow-sm sm:p-5"
                                            >
                                                <div className="flex items-start justify-between gap-4">

                                                    <div className="flex min-w-0 gap-3">
                                                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e9eaff] text-[#4648d4]">
                                                            <MapPin size={16} />
                                                        </div>

                                                        <div className="min-w-0 text-sm">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <p className="font-bold text-[#131b2e]">
                                                                    {address.label ||
                                                                        "Dirección"}
                                                                </p>

                                                                {address.is_default && (
                                                                    <span className="inline-flex items-center gap-1 rounded-full bg-[#e9eaff] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#4648d4]">
                                                                        <Check
                                                                            size={
                                                                                11
                                                                            }
                                                                        />
                                                                        Predeterminada
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <p className="mt-2 text-[#686777]">
                                                                {
                                                                    address.recipient_name
                                                                }
                                                            </p>

                                                            <p className="mt-0.5 break-words leading-5 text-[#686777]">
                                                                {
                                                                    address.address_line_1
                                                                }

                                                                {address.address_line_2
                                                                    ? `, ${address.address_line_2}`
                                                                    : ""}
                                                            </p>

                                                            <p className="mt-0.5 text-[#686777]">
                                                                {address.city}

                                                                {address.state
                                                                    ? `, ${address.state}`
                                                                    : ""}

                                                                {address.country
                                                                    ? `, ${address.country}`
                                                                    : ""}
                                                            </p>

                                                            {address.phone && (
                                                                <p className="mt-1 text-xs text-[#9695a1]">
                                                                    Tel.{" "}
                                                                    {
                                                                        address.phone
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* ACCIONES */}

                                                    <div className="flex shrink-0 gap-2">
                                                        <button
                                                            type="button"
                                                            title="Editar dirección"
                                                            aria-label="Editar dirección"
                                                            onClick={() =>
                                                                openEdit(
                                                                    address
                                                                )
                                                            }
                                                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e2e1eb] bg-white text-[#686777] transition hover:border-[#4648d4] hover:bg-[#e9eaff] hover:text-[#4648d4]"
                                                        >
                                                            <Pencil
                                                                size={14}
                                                            />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            title="Eliminar dirección"
                                                            aria-label="Eliminar dirección"
                                                            disabled={
                                                                isDeleting
                                                            }
                                                            onClick={() =>
                                                                remove(
                                                                    address.id
                                                                )
                                                            }
                                                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e2e1eb] bg-white text-[#686777] transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            <Trash2
                                                                size={14}
                                                            />
                                                        </button>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                        </section>
                    </div>

                    {/* =================================================
                        COLUMNA DERECHA
                    ================================================= */}

                    <aside className="lg:sticky lg:top-24">
                        <div className="rounded-2xl border border-[#e2e1eb] bg-white p-5 shadow-[0_8px_30px_rgba(35,35,60,0.04)] sm:p-6">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e9eaff] text-[#4648d4]">
                                <MapPin size={19} />
                            </div>

                            <h2 className="mt-4 text-base font-bold text-[#131b2e]">
                                Tus direcciones
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-[#686777]">
                                Puedes guardar varias direcciones y
                                seleccionar una como predeterminada para
                                agilizar tus compras.
                            </p>

                            <div className="my-5 border-t border-dashed border-[#d9d8e3]" />

                            <div className="space-y-4">
                                <InfoItem
                                    title="Dirección predeterminada"
                                    description="Se utilizará automáticamente durante el proceso de compra."
                                />

                                <InfoItem
                                    title="Varias direcciones"
                                    description="Puedes guardar tu casa, oficina u otros lugares habituales."
                                />

                                <InfoItem
                                    title="Datos protegidos"
                                    description="Tus direcciones permanecen asociadas a tu cuenta."
                                />
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* =========================================================
                MODAL
            ========================================================= */}

            {editing && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-[#131b2e]/40 p-4 backdrop-blur-[2px]"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="address-modal-title"
                >
                    <form
                        className="flex max-h-[calc(100vh-32px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#e2e1eb] bg-white shadow-[0_20px_60px_rgba(35,35,60,0.18)]"
                        onSubmit={(event) => {
                            event.preventDefault();
                            save();
                        }}
                    >
                        {/* CABECERA */}

                        <div className="shrink-0 border-b border-[#eeeef3] px-5 py-5 sm:px-6">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e9eaff] text-[#4648d4]">
                                    <MapPin size={18} />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9695a1]">
                                        Dirección
                                    </p>

                                    <h2
                                        id="address-modal-title"
                                        className="mt-1 text-lg font-bold text-[#131b2e] sm:text-xl"
                                    >
                                        {editing === "new"
                                            ? "Agregar nueva dirección"
                                            : "Editar dirección"}
                                    </h2>

                                    <p className="mt-1 text-sm text-[#686777]">
                                        Completa los datos de entrega.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* CONTENIDO */}

                        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
                            <div className="grid gap-4 sm:grid-cols-2">

                                <Field
                                    label="Etiqueta"
                                    hint="Ej. Casa, Oficina"
                                    className="sm:col-span-2"
                                >
                                    <input
                                        type="text"
                                        value={form.label ?? ""}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                label: e.target.value,
                                            })
                                        }
                                        className={INPUT_CLASS}
                                        placeholder="Casa"
                                    />
                                </Field>

                                <Field
                                    label="Nombre de quien recibe"
                                    required
                                    className="sm:col-span-2"
                                >
                                    <input
                                        type="text"
                                        required
                                        value={form.recipient_name}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                recipient_name:
                                                    e.target.value,
                                            })
                                        }
                                        className={INPUT_CLASS}
                                        placeholder="Nombre completo"
                                    />
                                </Field>

                                <Field
                                    label="Dirección"
                                    required
                                    className="sm:col-span-2"
                                >
                                    <input
                                        type="text"
                                        required
                                        value={form.address_line_1}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                address_line_1:
                                                    e.target.value,
                                            })
                                        }
                                        className={INPUT_CLASS}
                                        placeholder="Calle, carrera, número..."
                                    />
                                </Field>

                                <Field
                                    label="Complemento"
                                    hint="Opcional"
                                    className="sm:col-span-2"
                                >
                                    <input
                                        type="text"
                                        value={form.address_line_2 ?? ""}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                address_line_2:
                                                    e.target.value,
                                            })
                                        }
                                        className={INPUT_CLASS}
                                        placeholder="Apartamento, piso, referencia..."
                                    />
                                </Field>

                                <Field label="Ciudad" required>
                                    <input
                                        type="text"
                                        required
                                        value={form.city}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                city: e.target.value,
                                            })
                                        }
                                        className={INPUT_CLASS}
                                        placeholder="Ciudad"
                                    />
                                </Field>

                                <Field label="Departamento">
                                    <input
                                        type="text"
                                        value={form.state ?? ""}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                state: e.target.value,
                                            })
                                        }
                                        className={INPUT_CLASS}
                                        placeholder="Departamento"
                                    />
                                </Field>

                                <Field label="Teléfono">
                                    <input
                                        type="tel"
                                        value={form.phone ?? ""}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                phone: e.target.value,
                                            })
                                        }
                                        className={INPUT_CLASS}
                                        placeholder="300 000 0000"
                                    />
                                </Field>

                                <Field label="País" required>
                                    <input
                                        type="text"
                                        required
                                        value={form.country ?? ""}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                country: e.target.value,
                                            })
                                        }
                                        className={INPUT_CLASS}
                                        placeholder="Colombia"
                                    />
                                </Field>

                                <Field label="Código postal">
                                    <input
                                        type="text"
                                        value={form.postal_code ?? ""}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                postal_code:
                                                    e.target.value,
                                            })
                                        }
                                        className={INPUT_CLASS}
                                        placeholder="Opcional"
                                    />
                                </Field>

                                {/* PREDETERMINADA */}

                                <label className="sm:col-span-2">
                                    <div
                                        className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                                            form.is_default
                                                ? "border-[#4648d4] bg-[#f7f7ff]"
                                                : "border-[#e2e1eb] bg-white hover:border-[#aaa9b8]"
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={
                                                form.is_default
                                            }
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    is_default:
                                                        e.target.checked,
                                                })
                                            }
                                            className="h-4 w-4 shrink-0 accent-[#4648d4]"
                                        />

                                        <span>
                                            <span className="block text-sm font-bold text-[#131b2e]">
                                                Usar como dirección
                                                predeterminada
                                            </span>

                                            <span className="mt-0.5 block text-xs leading-5 text-[#686777]">
                                                Se seleccionará automáticamente
                                                durante tus próximas compras.
                                            </span>
                                        </span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* ACCIONES */}

                        <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-[#eeeef3] bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                            <button
                                type="button"
                                onClick={() => setEditing(null)}
                                disabled={isSaving}
                                className="h-11 w-full rounded-xl border border-[#e2e1eb] bg-white px-5 text-sm font-semibold text-[#464554] transition hover:border-[#aaa9b8] hover:bg-[#faf8ff] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={isSaving}
                                className="h-11 w-full rounded-xl bg-[#4648d4] px-6 text-sm font-bold text-white shadow-sm transition hover:bg-[#383ab9] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                            >
                                {isSaving
                                    ? "Guardando..."
                                    : editing === "new"
                                    ? "Guardar dirección"
                                    : "Guardar cambios"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
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
    marginBottom = true,
}: {
    icon: ReactNode;
    number: string;
    title: string;
    marginBottom?: boolean;
}) {
    return (
        <div
            className={`flex items-center gap-3 ${
                marginBottom ? "mb-5" : ""
            }`}
        >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e9eaff] text-[#4648d4]">
                {icon}
            </div>

            <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9695a1]">
                    Sección {number}
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
    hint,
    children,
    className,
}: {
    label: string;
    required?: boolean;
    hint?: string;
    children: ReactNode;
    className?: string;
}) {
    return (
        <label
            className={`flex min-w-0 flex-col gap-1.5 ${
                className ?? ""
            }`}
        >
            <span className="text-xs font-semibold text-[#464554]">
                {label}

                {required && (
                    <span className="ml-1 text-[#4648d4]">
                        *
                    </span>
                )}

                {hint && (
                    <span className="ml-1 font-normal text-[#9695a1]">
                        ({hint})
                    </span>
                )}
            </span>

            {children}
        </label>
    );
}

function InfoItem({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="flex gap-3">
            <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4648d4]" />

            <div>
                <p className="text-sm font-bold text-[#131b2e]">
                    {title}
                </p>

                <p className="mt-1 text-xs leading-5 text-[#686777]">
                    {description}
                </p>
            </div>
        </div>
    );
}