import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate, useNavigate } from "react-router-dom";
import { Pencil, Plus, Trash2 } from "lucide-react";

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

export default function AccountPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const showToast = useUIStore((s) => s.showToast);

    const customer = useCustomerAuthStore((s) => s.customer);
    const isAuthenticated = useCustomerAuthStore((s) => s.isAuthenticated);
    const clearSession = useCustomerAuthStore((s) => s.clearSession);

    const [editing, setEditing] = useState<CustomerAddress | "new" | null>(null);
    const [form, setForm] = useState<SaveAddressPayload>(EMPTY_FORM);

    const { data: addresses, isLoading } = useQuery({
        queryKey: ["customer-addresses"],
        queryFn: getCustomerAddresses,
        enabled: isAuthenticated,
    });

    function openNew() {
        setForm(EMPTY_FORM);
        setEditing("new");
    }

    function openEdit(address: CustomerAddress) {
        setForm({ ...address });
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

            showToast("Dirección guardada.");
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

    const { mutate: remove } = useMutation({
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

    const { mutate: logout } = useMutation({
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
        <main className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-6 lg:px-8">
            {/* =====================================================
                CABECERA
            ===================================================== */}
            <header className="flex flex-col gap-5 border-b border-[var(--color-line)] pb-7 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
                        Cuenta
                    </p>

                    <h1 className="mt-1 font-display text-3xl">
                        Mi cuenta
                    </h1>

                    {customer && (
                        <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
                            {customer.full_name} · {customer.email}
                        </p>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => logout()}
                    className="w-fit rounded-md border border-[var(--color-line)] px-4 py-2 text-sm transition hover:bg-[var(--color-ink)] hover:text-[var(--color-stone)]"
                >
                    Cerrar sesión
                </button>
            </header>

            {/* =====================================================
                DIRECCIONES
            ===================================================== */}
            <section className="mt-10">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className="font-display text-xl">
                            Mis direcciones
                        </h2>

                        <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
                            Administra las direcciones que utilizas para tus pedidos.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openNew}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-[var(--color-pine)] px-3.5 py-2 text-sm font-medium text-[var(--color-stone)] transition hover:bg-[var(--color-pine-dark)]"
                    >
                        <Plus size={15} />
                        <span className="hidden sm:inline">
                            Agregar dirección
                        </span>
                        <span className="sm:hidden">Agregar</span>
                    </button>
                </div>

                {/* Cargando */}
                {isLoading && (
                    <div className="mt-6 flex flex-col gap-3">
                        {[1, 2].map((item) => (
                            <div
                                key={item}
                                className="h-24 animate-pulse rounded-lg border border-[var(--color-line)] bg-[var(--color-stone)]"
                            />
                        ))}
                    </div>
                )}

                {/* Sin direcciones */}
                {!isLoading && addresses?.length === 0 && (
                    <div className="mt-6 rounded-lg border border-dashed border-[var(--color-line)] px-6 py-10 text-center">
                        <p className="text-sm text-[var(--color-ink-soft)]">
                            Todavía no tienes direcciones guardadas.
                        </p>

                        <button
                            type="button"
                            onClick={openNew}
                            className="mt-3 text-sm font-medium text-[var(--color-pine)] underline underline-offset-2"
                        >
                            Agregar mi primera dirección
                        </button>
                    </div>
                )}

                {/* Lista */}
                {!isLoading && addresses && addresses.length > 0 && (
                    <ul className="mt-6 flex flex-col gap-3">
                        {addresses.map((address) => (
                            <li
                                key={address.id}
                                className="group flex items-start justify-between gap-4 rounded-lg border border-[var(--color-line)] bg-[var(--color-stone)] p-4 transition hover:border-[var(--color-pine)]"
                            >
                                <div className="min-w-0 text-sm">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="font-medium text-[var(--color-ink)]">
                                            {address.label || "Dirección"}
                                        </p>

                                        {address.is_default && (
                                            <span className="rounded-full bg-[var(--color-ochre)]/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--color-ink)]">
                                                Predeterminada
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-2 text-[var(--color-ink-soft)]">
                                        {address.recipient_name}
                                    </p>

                                    <p className="mt-0.5 text-[var(--color-ink-soft)]">
                                        {address.address_line_1}
                                        {address.address_line_2
                                            ? `, ${address.address_line_2}`
                                            : ""}
                                    </p>

                                    <p className="mt-0.5 text-[var(--color-ink-soft)]">
                                        {address.city}
                                        {address.state
                                            ? `, ${address.state}`
                                            : ""}
                                        {address.country
                                            ? `, ${address.country}`
                                            : ""}
                                    </p>
                                </div>

                                <div className="flex shrink-0 gap-2">
                                    <button
                                        type="button"
                                        title="Editar dirección"
                                        aria-label="Editar dirección"
                                        onClick={() => openEdit(address)}
                                        className="rounded-md border border-[var(--color-line)] p-2 text-[var(--color-ink-soft)] transition hover:border-[var(--color-pine)] hover:bg-[var(--color-pine)] hover:text-[var(--color-stone)]"
                                    >
                                        <Pencil size={14} />
                                    </button>

                                    <button
                                        type="button"
                                        title="Eliminar dirección"
                                        aria-label="Eliminar dirección"
                                        onClick={() => remove(address.id)}
                                        className="rounded-md border border-[var(--color-line)] p-2 text-red-700 transition hover:border-red-700 hover:bg-red-700 hover:text-white"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* =====================================================
                MODAL
            ===================================================== */}
            {editing && (
                <div className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-black/40 px-4 py-6">
                    <form
                        className="w-full max-w-xl rounded-lg border border-[var(--color-line)] bg-[var(--color-stone)] p-6 shadow-xl"
                        onSubmit={(event) => {
                            event.preventDefault();
                            save();
                        }}
                    >
                        <div className="border-b border-[var(--color-line)] pb-4">
                            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
                                Dirección
                            </p>

                            <h3 className="mt-1 font-display text-xl">
                                {editing === "new"
                                    ? "Nueva dirección"
                                    : "Editar dirección"}
                            </h3>
                        </div>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            {/* Etiqueta */}
                            <Field
                                label="Etiqueta"
                                hint="Ej. Casa, Oficina"
                                className="sm:col-span-2"
                            >
                                <input
                                    value={form.label ?? ""}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            label: e.target.value,
                                        })
                                    }
                                    className="field-input"
                                />
                            </Field>

                            {/* Destinatario */}
                            <Field
                                label="Nombre de quien recibe"
                                required
                                className="sm:col-span-2"
                            >
                                <input
                                    required
                                    value={form.recipient_name}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            recipient_name: e.target.value,
                                        })
                                    }
                                    className="field-input"
                                />
                            </Field>

                            {/* Dirección */}
                            <Field
                                label="Dirección"
                                required
                                className="sm:col-span-2"
                            >
                                <input
                                    required
                                    value={form.address_line_1}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            address_line_1: e.target.value,
                                        })
                                    }
                                    className="field-input"
                                />
                            </Field>

                            {/* Complemento */}
                            <Field
                                label="Complemento"
                                hint="Opcional"
                                className="sm:col-span-2"
                            >
                                <input
                                    value={form.address_line_2 ?? ""}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            address_line_2: e.target.value,
                                        })
                                    }
                                    className="field-input"
                                />
                            </Field>

                            {/* Ciudad */}
                            <Field label="Ciudad" required>
                                <input
                                    required
                                    value={form.city}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            city: e.target.value,
                                        })
                                    }
                                    className="field-input"
                                />
                            </Field>

                            {/* Departamento */}
                            <Field label="Departamento">
                                <input
                                    value={form.state ?? ""}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            state: e.target.value,
                                        })
                                    }
                                    className="field-input"
                                />
                            </Field>

                            {/* Teléfono */}
                            <Field label="Teléfono">
                                <input
                                    value={form.phone ?? ""}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            phone: e.target.value,
                                        })
                                    }
                                    className="field-input"
                                />
                            </Field>

                            {/* País */}
                            <Field label="País">
                                <input
                                    value={form.country ?? ""}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            country: e.target.value,
                                        })
                                    }
                                    className="field-input"
                                />
                            </Field>

                            {/* Predeterminada */}
                            <label className="flex items-center gap-2 pt-2 text-sm sm:col-span-2">
                                <input
                                    type="checkbox"
                                    checked={form.is_default}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            is_default: e.target.checked,
                                        })
                                    }
                                    className="h-4 w-4 accent-[var(--color-pine)]"
                                />

                                <span>
                                    Usar como dirección predeterminada
                                </span>
                            </label>
                        </div>

                        {/* Acciones */}
                        <div className="mt-7 flex justify-end gap-3 border-t border-[var(--color-line)] pt-5">
                            <button
                                type="button"
                                onClick={() => setEditing(null)}
                                className="rounded-md border border-[var(--color-line)] px-4 py-2 text-sm transition hover:bg-[var(--color-ink)] hover:text-[var(--color-stone)]"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={isSaving}
                                className="rounded-md bg-[var(--color-pine)] px-5 py-2 text-sm font-medium text-[var(--color-stone)] transition hover:bg-[var(--color-pine-dark)] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSaving
                                    ? "Guardando..."
                                    : "Guardar dirección"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </main>
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
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <label className={`flex flex-col gap-1.5 ${className ?? ""}`}>
            <span className="text-xs font-medium text-[var(--color-ink)]">
                {label}
                {required && " *"}
                {hint && (
                    <span className="ml-1 font-normal text-[var(--color-ink-soft)]">
                        ({hint})
                    </span>
                )}
            </span>

            {children}
        </label>
    );
}