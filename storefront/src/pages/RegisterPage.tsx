import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";

import { registerCustomer, extractErrorMessage } from "../features/customer/customerApi";
import { useCustomerAuthStore } from "../lib/customerAuthStore";
import { useUIStore } from "../lib/uiStore";
import { useCart } from "../features/cart/useCart";

export default function RegisterPage() {
    const navigate = useNavigate();
    const setSession = useCustomerAuthStore((s) => s.setSession);
    const showToast = useUIStore((s) => s.showToast);
    const { refetch: refetchCart } = useCart();

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        password: "",
        password_confirmation: "",
    });

    function update<K extends keyof typeof form>(key: K, value: string) {
        setForm((current) => ({ ...current, [key]: value }));
    }

    const { mutate: submit, isPending } = useMutation({
        mutationFn: () =>
            registerCustomer({
                first_name: form.first_name,
                last_name: form.last_name || undefined,
                email: form.email,
                phone: form.phone || undefined,
                password: form.password,
                password_confirmation: form.password_confirmation,
            }),
        onSuccess: ({ data, token }) => {
            setSession(data, token);
            refetchCart(); // el carrito de invitado, si había, ya quedó a nombre del cliente
            showToast(`Bienvenido, ${data.first_name}.`, "success");
            navigate("/cuenta");
        },
        onError: (error) => {
            showToast(extractErrorMessage(error, "No se pudo crear la cuenta."), "error");
        },
    });

    return (
        <main className="mx-auto max-w-md px-5 py-16">
            <h1 className="font-display text-3xl">Crear cuenta</h1>
            <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
                Guarda tus direcciones y revisa tus pedidos en cualquier momento.
            </p>

            <form
                className="mt-8 flex flex-col gap-4"
                onSubmit={(event) => {
                    event.preventDefault();
                    submit();
                }}
            >
                <div className="grid gap-3 sm:grid-cols-2">
                    <label className="flex flex-col gap-1">
                        <span className="text-xs text-[var(--color-ink-soft)]">Nombre</span>
                        <input
                            required
                            value={form.first_name}
                            onChange={(e) => update("first_name", e.target.value)}
                            className="field-input"
                        />
                    </label>
                    <label className="flex flex-col gap-1">
                        <span className="text-xs text-[var(--color-ink-soft)]">Apellido</span>
                        <input
                            value={form.last_name}
                            onChange={(e) => update("last_name", e.target.value)}
                            className="field-input"
                        />
                    </label>
                </div>

                <label className="flex flex-col gap-1">
                    <span className="text-xs text-[var(--color-ink-soft)]">
                        Correo electrónico
                    </span>
                    <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        className="field-input"
                    />
                </label>

                <label className="flex flex-col gap-1">
                    <span className="text-xs text-[var(--color-ink-soft)]">
                        Teléfono (opcional)
                    </span>
                    <input
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        className="field-input"
                    />
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                    <label className="flex flex-col gap-1">
                        <span className="text-xs text-[var(--color-ink-soft)]">Contraseña</span>
                        <input
                            required
                            minLength={8}
                            type="password"
                            value={form.password}
                            onChange={(e) => update("password", e.target.value)}
                            className="field-input"
                        />
                    </label>
                    <label className="flex flex-col gap-1">
                        <span className="text-xs text-[var(--color-ink-soft)]">
                            Confirmar contraseña
                        </span>
                        <input
                            required
                            minLength={8}
                            type="password"
                            value={form.password_confirmation}
                            onChange={(e) => update("password_confirmation", e.target.value)}
                            className="field-input"
                        />
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="mt-2 w-full rounded-md bg-[var(--color-pine)] py-3 text-sm font-medium text-[var(--color-stone)] transition hover:bg-[var(--color-pine-dark)] disabled:opacity-50"
                >
                    {isPending ? "Creando cuenta..." : "Crear cuenta"}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-[var(--color-ink-soft)]">
                ¿Ya tienes cuenta?{" "}
                <Link to="/login" className="text-[var(--color-pine)] underline">
                    Inicia sesión
                </Link>
            </p>
        </main>
    );
}
