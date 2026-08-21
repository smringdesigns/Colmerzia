import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";

import {
    loginCustomer,
    extractErrorMessage,
} from "../features/customer/customerApi";
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
            refetchCart();

            showToast(`Hola, ${data.first_name}.`, "success");
            navigate("/cuenta");
        },

        onError: (error) => {
            showToast(
                extractErrorMessage(
                    error,
                    "Correo o contraseña incorrectos."
                ),
                "error"
            );
        },
    });

    return (
        <main className="min-h-[calc(100vh-5rem)] bg-[#faf8ff] px-4 py-10 sm:px-6 sm:py-14">
            <div className="mx-auto w-full max-w-md">

                {/* Encabezado */}
                <div className="mb-8 text-center">
                    <span className="mb-3 inline-flex items-center rounded-full bg-[#eaedff] px-3 py-1 text-xs font-semibold text-[#4648d4]">
                        Tu cuenta
                    </span>

                    <h1 className="text-3xl font-bold tracking-tight text-[#131b2e] sm:text-4xl">
                        Iniciar sesión
                    </h1>

                    <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#686777]">
                        Entra para consultar tus pedidos, gestionar tus
                        direcciones y continuar con tus compras.
                    </p>
                </div>

                {/* Tarjeta */}
                <div className="rounded-2xl border border-[#e2e1eb] bg-white p-5 shadow-[0_8px_30px_rgba(35,35,60,0.06)] sm:p-8">

                    <form
                        className="space-y-5"
                        onSubmit={(event) => {
                            event.preventDefault();
                            submit();
                        }}
                    >
                        {/* Correo */}
                        <label className="flex flex-col gap-2">
                            <span className="text-sm font-semibold text-[#343344]">
                                Correo electrónico
                            </span>

                            <input
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ejemplo@correo.com"
                                autoComplete="email"
                                className="h-12 rounded-xl border border-[#d9d8e3] bg-[#fcfcfe] px-4 text-sm text-[#131b2e] outline-none transition placeholder:text-[#a3a2ad] focus:border-[#4648d4] focus:bg-white focus:ring-4 focus:ring-[#4648d4]/10"
                            />
                        </label>

                        {/* Contraseña */}
                        <label className="flex flex-col gap-2">
                            <span className="text-sm font-semibold text-[#343344]">
                                Contraseña
                            </span>

                            <input
                                required
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                className="h-12 rounded-xl border border-[#d9d8e3] bg-[#fcfcfe] px-4 text-sm text-[#131b2e] outline-none transition placeholder:text-[#a3a2ad] focus:border-[#4648d4] focus:bg-white focus:ring-4 focus:ring-[#4648d4]/10"
                            />
                        </label>

                        {/* Botón */}
                        <button
                            type="submit"
                            disabled={isPending}
                            className="mt-2 h-12 w-full rounded-xl bg-[#4648d4] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#383ab9] hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#4648d4]/20 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isPending ? "Entrando..." : "Iniciar sesión"}
                        </button>
                    </form>

                    {/* Registro */}
                    <div className="mt-6 border-t border-[#eeeef3] pt-6 text-center">
                        <p className="text-sm text-[#686777]">
                            ¿No tienes una cuenta?{" "}
                            <Link
                                to="/registro"
                                className="font-semibold text-[#4648d4] transition hover:text-[#383ab9] hover:underline"
                            >
                                Crea tu cuenta
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}