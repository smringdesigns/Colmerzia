import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { login } from "../features/auth/authApi";
import { useAuthStore } from "../store/authStore";

// ── Schema ────────────────────────────────────────────────
const schema = z.object({
    email: z
        .string()
        .min(1, "El correo es obligatorio")
        .email("Ingresa un correo válido"),
    password: z
        .string()
        .min(1, "La contraseña es obligatoria"),
});

type LoginForm = z.infer<typeof schema>;

// ── Componente ────────────────────────────────────────────
export default function Login() {
    const navigate = useNavigate();
    const setUser  = useAuthStore((s) => s.setUser);
    const setToken = useAuthStore((s) => s.setToken);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<LoginForm>({
        resolver: zodResolver(schema),
    });

    async function onSubmit(data: LoginForm) {
        try {
            const res = await login(data.email, data.password);
            setUser(res.user);
            setToken(res.token);
            navigate("/", { replace: true });
        } catch {
            // Error del servidor — lo mostramos en el campo password
            // para no revelar si el email existe o no
            setError("password", {
                message: "Correo o contraseña incorrectos",
            });
        }
    }

    return (
        <div style={{
            display: "flex",
            minHeight: "100vh",
            fontFamily: "'Inter', system-ui, sans-serif",
        }}>

            {/* Panel izquierdo — branding */}
            <div style={{
                flex: "0 0 45%",
                background: "#0F1117",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "64px",
                position: "relative",
                overflow: "hidden",
            }}>

                {/* Textura de puntos */}
                <div style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: "radial-gradient(circle, #ffffff12 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                    pointerEvents: "none",
                }} />

                {/* Acento superior */}
                <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    background: "linear-gradient(90deg, #6366F1, #818CF8)",
                }} />

                <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "48px",
                    }}>
                        <div style={{
                            width: "36px",
                            height: "36px",
                            background: "#6366F1",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                                <line x1="3" y1="6" x2="21" y2="6"/>
                                <path d="M16 10a4 4 0 01-8 0"/>
                            </svg>
                        </div>
                        <span style={{
                            color: "#FFFFFF",
                            fontSize: "22px",
                            fontWeight: "700",
                            letterSpacing: "-0.5px",
                        }}>
                            Commerzia
                        </span>
                    </div>

                    <h1 style={{
                        color: "#FFFFFF",
                        fontSize: "36px",
                        fontWeight: "700",
                        lineHeight: "1.2",
                        letterSpacing: "-1px",
                        marginBottom: "16px",
                    }}>
                        Tu tienda,<br />
                        bajo control.
                    </h1>

                    <p style={{
                        color: "#6B7280",
                        fontSize: "15px",
                        lineHeight: "1.6",
                        maxWidth: "320px",
                    }}>
                        Panel de administración para gestionar productos,
                        pedidos e inventario en un solo lugar.
                    </p>
                </div>
            </div>

            {/* Panel derecho — formulario */}
            <div style={{
                flex: 1,
                background: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "64px",
            }}>
                <div style={{ width: "100%", maxWidth: "380px" }}>

                    <h2 style={{
                        color: "#0F1117",
                        fontSize: "24px",
                        fontWeight: "700",
                        letterSpacing: "-0.5px",
                        marginBottom: "8px",
                    }}>
                        Iniciar sesión
                    </h2>

                    <p style={{
                        color: "#6B7280",
                        fontSize: "14px",
                        marginBottom: "36px",
                    }}>
                        Ingresa tus credenciales para continuar
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} noValidate>

                        {/* Campo email */}
                        <div style={{ marginBottom: "20px" }}>
                            <label style={{
                                display: "block",
                                fontSize: "13px",
                                fontWeight: "500",
                                color: "#374151",
                                marginBottom: "6px",
                            }}>
                                Correo electrónico
                            </label>
                            <input
                                type="email"
                                placeholder="admin@tienda.com"
                                {...register("email")}
                                style={{
                                    width: "100%",
                                    padding: "10px 14px",
                                    fontSize: "14px",
                                    border: `1.5px solid ${errors.email ? "#EF4444" : "#E5E7EB"}`,
                                    borderRadius: "8px",
                                    outline: "none",
                                    color: "#0F1117",
                                    background: "#FAFAFA",
                                    boxSizing: "border-box",
                                    transition: "border-color 0.15s",
                                }}
                            />
                            {errors.email && (
                                <p style={{
                                    color: "#EF4444",
                                    fontSize: "12px",
                                    marginTop: "5px",
                                }}>
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Campo password */}
                        <div style={{ marginBottom: "28px" }}>
                            <label style={{
                                display: "block",
                                fontSize: "13px",
                                fontWeight: "500",
                                color: "#374151",
                                marginBottom: "6px",
                            }}>
                                Contraseña
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                {...register("password")}
                                style={{
                                    width: "100%",
                                    padding: "10px 14px",
                                    fontSize: "14px",
                                    border: `1.5px solid ${errors.password ? "#EF4444" : "#E5E7EB"}`,
                                    borderRadius: "8px",
                                    outline: "none",
                                    color: "#0F1117",
                                    background: "#FAFAFA",
                                    boxSizing: "border-box",
                                    transition: "border-color 0.15s",
                                }}
                            />
                            {errors.password && (
                                <p style={{
                                    color: "#EF4444",
                                    fontSize: "12px",
                                    marginTop: "5px",
                                }}>
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Botón */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            style={{
                                width: "100%",
                                padding: "11px",
                                background: isSubmitting ? "#818CF8" : "#6366F1",
                                color: "#FFFFFF",
                                fontSize: "14px",
                                fontWeight: "600",
                                border: "none",
                                borderRadius: "8px",
                                cursor: isSubmitting ? "not-allowed" : "pointer",
                                transition: "background 0.15s",
                                letterSpacing: "0.1px",
                            }}
                        >
                            {isSubmitting ? "Verificando..." : "Entrar al panel"}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}
