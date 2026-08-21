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
            queryClient.invalidateQueries({ queryKey: ["customer-addresses"] });
            showToast("Dirección guardada.");
            setEditing(null);
        },
        onError: (error) => {
            showToast(extractErrorMessage(error, "No se pudo guardar la dirección."), "error");
        },
    });

    const { mutate: remove } = useMutation({
        mutationFn: (id: number) => deleteCustomerAddress(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customer-addresses"] });
            showToast("Dirección eliminada.");
        },
    });

    const { mutate: logout } = useMutation({
        mutationFn: logoutCustomer,
        onSuccess: () => {
            clearSession();
            navigate("/");
        },
        onError: () => {
            // Aunque falle en el servidor, limpiamos localmente —
            // no tiene sentido dejar al cliente "atascado" logueado.
            clearSession();
            navigate("/");
        },
    });

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <main className="mx-auto max-w-3xl px-5 py-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-3xl">Mi cuenta</h1>
                    {customer && (
                        <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
                            {customer.full_name} · {customer.email}
                        </p>
                    )}
                </div>
                <button
                    type="button"
                    onClick={() => logout()}
                    className="rounded-md border border-[var(--color-line)] px-4 py-2 text-sm transition hover:bg-[var(--color-ink)] hover:text-[var(--color-stone)]"
                >
                    Cerrar sesión
                </button>
            </div>

            <section className="mt-10">
                <div className="flex items-center justify-between">
                    <h2 className="font-display text-xl">Mis direcciones</h2>
                    <button
                        type="button"
                        onClick={openNew}
                        className="flex items-center gap-1 text-sm text-[var(--color-pine)] underline"
                    >
                        <Plus size={15} />
                        Agregar dirección
                    </button>
                </div>

                {isLoading && (
                    <p className="mt-4 text-sm text-[var(--color-ink-soft)]">Cargando...</p>
                )}

                {!isLoading && addresses?.length === 0 && (
                    <p className="mt-4 text-sm text-[var(--color-ink-soft)]">
                        Todavía no tienes direcciones guardadas.
                    </p>
                )}

                <ul className="mt-4 flex flex-col gap-3">
                    {addresses?.map((address) => (
                        <li
                            key={address.id}
                            className="flex items-start justify-between gap-4 rounded-md border border-[var(--color-line)] p-4"
                        >
                            <div className="text-sm">
                                <p className="font-medium">
                                    {address.label || "Dirección"}
                                    {address.is_default && (
                                        <span className="ml-2 rounded-full bg-[var(--color-ochre)]/30 px-2 py-0.5 text-[11px] uppercase tracking-wide">
                                            Predeterminada
                                        </span>
                                    )}
                                </p>
                                <p className="mt-1 text-[var(--color-ink-soft)]">
                                    {address.recipient_name} · {address.address_line_1}
                                    {address.address_line_2 ? `, ${address.address_line_2}` : ""}
                                </p>
                                <p className="text-[var(--color-ink-soft)]">
                                    {address.city}
                                    {address.state ? `, ${address.state}` : ""}
                                    {address.country ? `, ${address.country}` : ""}
                                </p>
                            </div>

                            <div className="flex shrink-0 gap-2">
                                <button
                                    type="button"
                                    title="Editar"
                                    onClick={() => openEdit(address)}
                                    className="rounded-md border border-[var(--color-line)] p-2 transition hover:bg-[var(--color-ink)] hover:text-[var(--color-stone)]"
                                >
                                    <Pencil size={14} />
                                </button>
                                <button
                                    type="button"
                                    title="Eliminar"
                                    onClick={() => remove(address.id)}
                                    className="rounded-md border border-[var(--color-line)] p-2 text-red-700 transition hover:bg-red-700 hover:text-white"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>

            {editing && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
                    <form
                        className="w-full max-w-lg rounded-lg bg-[var(--color-stone)] p-6"
                        onSubmit={(event) => {
                            event.preventDefault();
                            save();
                        }}
                    >
                        <h3 className="font-display text-xl">
                            {editing === "new" ? "Nueva dirección" : "Editar dirección"}
                        </h3>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <label className="flex flex-col gap-1 sm:col-span-2">
                                <span className="text-xs text-[var(--color-ink-soft)]">
                                    Etiqueta (ej. Casa, Oficina)
                                </span>
                                <input
                                    value={form.label ?? ""}
                                    onChange={(e) =>
                                        setForm({ ...form, label: e.target.value })
                                    }
                                    className="field-input"
                                />
                            </label>

                            <label className="flex flex-col gap-1 sm:col-span-2">
                                <span className="text-xs text-[var(--color-ink-soft)]">
                                    Nombre de quien recibe
                                </span>
                                <input
                                    required
                                    value={form.recipient_name}
                                    onChange={(e) =>
                                        setForm({ ...form, recipient_name: e.target.value })
                                    }
                                    className="field-input"
                                />
                            </label>

                            <label className="flex flex-col gap-1 sm:col-span-2">
                                <span className="text-xs text-[var(--color-ink-soft)]">
                                    Dirección
                                </span>
                                <input
                                    required
                                    value={form.address_line_1}
                                    onChange={(e) =>
                                        setForm({ ...form, address_line_1: e.target.value })
                                    }
                                    className="field-input"
                                />
                            </label>

                            <label className="flex flex-col gap-1 sm:col-span-2">
                                <span className="text-xs text-[var(--color-ink-soft)]">
                                    Complemento (opcional)
                                </span>
                                <input
                                    value={form.address_line_2 ?? ""}
                                    onChange={(e) =>
                                        setForm({ ...form, address_line_2: e.target.value })
                                    }
                                    className="field-input"
                                />
                            </label>

                            <label className="flex flex-col gap-1">
                                <span className="text-xs text-[var(--color-ink-soft)]">
                                    Ciudad
                                </span>
                                <input
                                    required
                                    value={form.city}
                                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                                    className="field-input"
                                />
                            </label>

                            <label className="flex flex-col gap-1">
                                <span className="text-xs text-[var(--color-ink-soft)]">
                                    Departamento
                                </span>
                                <input
                                    value={form.state ?? ""}
                                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                                    className="field-input"
                                />
                            </label>

                            <label className="flex flex-col gap-1">
                                <span className="text-xs text-[var(--color-ink-soft)]">
                                    Teléfono
                                </span>
                                <input
                                    value={form.phone ?? ""}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    className="field-input"
                                />
                            </label>

                            <label className="flex items-center gap-2 pt-5 text-sm">
                                <input
                                    type="checkbox"
                                    checked={form.is_default}
                                    onChange={(e) =>
                                        setForm({ ...form, is_default: e.target.checked })
                                    }
                                />
                                Usar como dirección predeterminada
                            </label>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setEditing(null)}
                                className="rounded-md border border-[var(--color-line)] px-4 py-2 text-sm"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="rounded-md bg-[var(--color-pine)] px-5 py-2 text-sm text-[var(--color-stone)] disabled:opacity-50"
                            >
                                {isSaving ? "Guardando..." : "Guardar dirección"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </main>
    );
}
