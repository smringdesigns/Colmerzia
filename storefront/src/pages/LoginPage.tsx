import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";

import { loginCustomer, extractErrorMessage } from "../features/customer/customerApi";
import { useCustomerAuthStore } from "../lib/customerAuthStore";
import { useUIStore } from "../lib/uiStore";
import { useCart } from "../features/cart/useCart";

export default function LoginPage() {
    const navigate = useNavigate();
    const setSession = useCustomerAuthStore((s) => s.setSession);
    const showToast = useUIStore((s) => s.showToast);
    const { refetch: refetchCart } = useCart();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { mutate: submit, isPending } = useMutation({
        mutationFn: () => loginCustomer({ email, password }),
        onSuccess: ({ data, token }) => {
            setSession(data, token);
            refetchCart(); // por si el carrito de invitado se reasignó al loguearse
            showToast(`Hola, ${data.first_name}.`, "success");
            navigate("/cuenta");
        },
        onError: (error) => {
            showToast(extractErrorMessage(error, "Correo o contraseña incorrectos."), "error");
        },
    });

    return (
        <main className="mx-auto max-w-md px-5 py-16">
            <h1 className="font-display text-3xl">Iniciar sesión</h1>
            <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
                Entra para ver tus pedidos y usar tus direcciones guardadas.
            </p>

            <form
                className="mt-8 flex flex-col gap-4"
                onSubmit={(event) => {
                    event.preventDefault();
                    submit();
                }}
            >
                <label className="flex flex-col gap-1">
                    <span className="text-xs text-[var(--color-ink-soft)]">
                        Correo electrónico
                    </span>
                    <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="field-input"
                    />
                </label>

                <label className="flex flex-col gap-1">
                    <span className="text-xs text-[var(--color-ink-soft)]">Contraseña</span>
                    <input
                        required
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="field-input"
                    />
                </label>

                <button
                    type="submit"
                    disabled={isPending}
                    className="mt-2 w-full rounded-md bg-[var(--color-pine)] py-3 text-sm font-medium text-[var(--color-stone)] transition hover:bg-[var(--color-pine-dark)] disabled:opacity-50"
                >
                    {isPending ? "Entrando..." : "Entrar"}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-[var(--color-ink-soft)]">
                ¿No tienes cuenta?{" "}
                <Link to="/registro" className="text-[var(--color-pine)] underline">
                    Regístrate
                </Link>
            </p>
        </main>
    );
}
