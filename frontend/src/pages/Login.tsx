import { Lock, Mail, Store } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Button from "../components/ui/Button";
import TextField from "../components/ui/TextField";
import { login } from "../features/auth/authApi";
import { useAuthStore } from "../store/authStore";

const schema = z.object({
    email: z
        .string()
        .min(1, "El correo es obligatorio")
        .email("Ingresa un correo válido"),
    password: z.string().min(1, "La contraseña es obligatoria"),
});

type LoginForm = z.infer<typeof schema>;

export default function Login() {
    const navigate = useNavigate();
    const setUser = useAuthStore((s) => s.setUser);
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
            setError("password", {
                message: "Correo o contraseña incorrectos",
            });
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-card">
                <div className="auth-media" aria-hidden="true">
                    <img src="/auth/login-office.jpeg" alt="" />
                    <div className="auth-media-overlay">
                        <div className="auth-logo large">
                            <Store size={26} />
                        </div>
                        <p>Gestión comercial</p>
                        <h1>Administra tu tienda con control y claridad.</h1>
                        <span>Productos, clientes, inventario y pedidos en un solo lugar.</span>
                    </div>
                </div>

                <div className="auth-form-panel">
                    <div className="auth-form-heading">
                        <div className="auth-logo">
                            <Store size={22} />
                        </div>
                        <div>
                            <strong>Colmerzia</strong>
                            <span>Panel de administración</span>
                        </div>
                    </div>

                    <div className="auth-copy">
                        <p className="eyebrow">Bienvenido de vuelta</p>
                        <h2>Iniciar sesión</h2>
                        <p>Ingresa tus credenciales para continuar gestionando tu tienda.</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
                        <TextField
                            autoComplete="email"
                            error={errors.email?.message}
                            icon={<Mail size={17} />}
                            label="Email"
                            placeholder="tienda@correo.com"
                            type="email"
                            {...register("email")}
                        />

                        <TextField
                            autoComplete="current-password"
                            error={errors.password?.message}
                            icon={<Lock size={17} />}
                            label="Contraseña"
                            placeholder="********"
                            type="password"
                            {...register("password")}
                        />

                        <div className="auth-row">
                            <label className="check-row">
                                <input type="checkbox" />
                                <span>Recordarme</span>
                            </label>
                            <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
                        </div>

                        <Button fullWidth type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Checking..." : "Iniciar sesión"}
                        </Button>
                    </form>

                    <p className="auth-footer-text">
                        ¿Necesitas una cuenta de tienda? <Link to="/create-account">Crear cuenta</Link>
                    </p>
                </div>
            </section>
        </main>
    );
}
