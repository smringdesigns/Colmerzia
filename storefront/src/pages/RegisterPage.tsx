import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";

import {
    registerCustomer,
    extractErrorMessage,
} from "../features/customer/customerApi";
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
        setForm((current) => ({
            ...current,
            [key]: value,
        }));
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
            refetchCart();

            showToast(`Bienvenido, ${data.first_name}.`, "success");
            navigate("/cuenta");
        },

        onError: (error) => {
            showToast(
                extractErrorMessage(error, "No se pudo crear la cuenta."),
                "error"
            );
        },
    });

    return (
        <main className="min-h-[calc(100vh-5rem)] bg-[#faf8ff] px-4 py-10 sm:px-6 sm:py-14">
            <div className="mx-auto w-full max-w-xl">

                {/* Encabezado */}
                <div className="mb-8 text-center">
                    <span className="mb-3 inline-flex items-center rounded-full bg-[#eaedff] px-3 py-1 text-xs font-semibold text-[#4648d4]">
                        Tu cuenta
                    </span>

                    <h1 className="text-3xl font-bold tracking-tight text-[#131b2e] sm:text-4xl">
                        Crear cuenta
                    </h1>

                    <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#686777]">
                        Crea tu cuenta para guardar tus datos, consultar tus
                        pedidos y disfrutar una experiencia más cómoda.
                    </p>
                </div>

                {/* Formulario */}
                <div className="rounded-2xl border border-[#e2e1eb] bg-white p-5 shadow-[0_8px_30px_rgba(35,35,60,0.06)] sm:p-8">
                    <form
                        className="space-y-5"
                        onSubmit={(event) => {
                            event.preventDefault();
                            submit();
                        }}
                    >
                        {/* Nombre y apellido */}
                        <div className="grid gap-5 sm:grid-cols-2">
                            <label className="flex flex-col gap-2">
                                <span className="text-sm font-semibold text-[#343344]">
                                    Nombre
                                </span>

                                <input
                                    required
                                    value={form.first_name}
                                    onChange={(e) =>
                                        update("first_name", e.target.value)
                                    }
                                    placeholder="Tu nombre"
                                    autoComplete="given-name"
                                    className="h-12 rounded-xl border border-[#d9d8e3] bg-[#fcfcfe] px-4 text-sm text-[#131b2e] outline-none transition placeholder:text-[#a3a2ad] focus:border-[#4648d4] focus:bg-white focus:ring-4 focus:ring-[#4648d4]/10"
                                />
                            </label>

                            <label className="flex flex-col gap-2">
                                <span className="text-sm font-semibold text-[#343344]">
                                    Apellido
                                </span>

                                <input
                                    value={form.last_name}
                                    onChange={(e) =>
                                        update("last_name", e.target.value)
                                    }
                                    placeholder="Tu apellido"
                                    autoComplete="family-name"
                                    className="h-12 rounded-xl border border-[#d9d8e3] bg-[#fcfcfe] px-4 text-sm text-[#131b2e] outline-none transition placeholder:text-[#a3a2ad] focus:border-[#4648d4] focus:bg-white focus:ring-4 focus:ring-[#4648d4]/10"
                                />
                            </label>
                        </div>

                        {/* Correo */}
                        <label className="flex flex-col gap-2">
                            <span className="text-sm font-semibold text-[#343344]">
                                Correo electrónico
                            </span>

                            <input
                                required
                                type="email"
                                value={form.email}
                                onChange={(e) =>
                                    update("email", e.target.value)
                                }
                                placeholder="ejemplo@correo.com"
                                autoComplete="email"
                                className="h-12 rounded-xl border border-[#d9d8e3] bg-[#fcfcfe] px-4 text-sm text-[#131b2e] outline-none transition placeholder:text-[#a3a2ad] focus:border-[#4648d4] focus:bg-white focus:ring-4 focus:ring-[#4648d4]/10"
                            />
                        </label>

                        {/* Teléfono */}
                        <label className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-[#343344]">
                                    Teléfono
                                </span>

                                <span className="text-xs text-[#9695a1]">
                                    Opcional
                                </span>
                            </div>

                            <input
                                value={form.phone}
                                onChange={(e) =>
                                    update("phone", e.target.value)
                                }
                                placeholder="300 123 4567"
                                autoComplete="tel"
                                className="h-12 rounded-xl border border-[#d9d8e3] bg-[#fcfcfe] px-4 text-sm text-[#131b2e] outline-none transition placeholder:text-[#a3a2ad] focus:border-[#4648d4] focus:bg-white focus:ring-4 focus:ring-[#4648d4]/10"
                            />
                        </label>

                        {/* Contraseñas */}
                        <div className="border-t border-[#eeeef3] pt-5">
                            <div className="mb-4">
                                <h2 className="text-sm font-semibold text-[#343344]">
                                    Seguridad de tu cuenta
                                </h2>

                                <p className="mt-1 text-xs text-[#858491]">
                                    Usa una contraseña de al menos 8 caracteres.
                                </p>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <label className="flex flex-col gap-2">
                                    <span className="text-sm font-semibold text-[#343344]">
                                        Contraseña
                                    </span>

                                    <input
                                        required
                                        minLength={8}
                                        type="password"
                                        value={form.password}
                                        onChange={(e) =>
                                            update("password", e.target.value)
                                        }
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                        className="h-12 rounded-xl border border-[#d9d8e3] bg-[#fcfcfe] px-4 text-sm text-[#131b2e] outline-none transition placeholder:text-[#a3a2ad] focus:border-[#4648d4] focus:bg-white focus:ring-4 focus:ring-[#4648d4]/10"
                                    />
                                </label>

                                <label className="flex flex-col gap-2">
                                    <span className="text-sm font-semibold text-[#343344]">
                                        Confirmar contraseña
                                    </span>

                                    <input
                                        required
                                        minLength={8}
                                        type="password"
                                        value={form.password_confirmation}
                                        onChange={(e) =>
                                            update(
                                                "password_confirmation",
                                                e.target.value
                                            )
                                        }
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                        className="h-12 rounded-xl border border-[#d9d8e3] bg-[#fcfcfe] px-4 text-sm text-[#131b2e] outline-none transition placeholder:text-[#a3a2ad] focus:border-[#4648d4] focus:bg-white focus:ring-4 focus:ring-[#4648d4]/10"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Botón */}
                        <button
                            type="submit"
                            disabled={isPending}
                            className="mt-2 h-12 w-full rounded-xl bg-[#4648d4] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#383ab9] hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#4648d4]/20 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isPending
                                ? "Creando cuenta..."
                                : "Crear mi cuenta"}
                        </button>
                    </form>

                    {/* Login */}
                    <div className="mt-6 border-t border-[#eeeef3] pt-6 text-center">
                        <p className="text-sm text-[#686777]">
                            ¿Ya tienes una cuenta?{" "}
                            <Link
                                to="/login"
                                className="font-semibold text-[#4648d4] transition hover:text-[#383ab9] hover:underline"
                            >
                                Inicia sesión
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}