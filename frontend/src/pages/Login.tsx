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
                        <p>Commerce operations</p>
                        <h1>Manage your store with calm, clear control.</h1>
                        <span>Products, customers, inventory and orders in one workspace.</span>
                    </div>
                </div>

                <div className="auth-form-panel">
                    <div className="auth-form-heading">
                        <div className="auth-logo">
                            <Store size={22} />
                        </div>
                        <div>
                            <strong>Commerzia</strong>
                            <span>Admin dashboard</span>
                        </div>
                    </div>

                    <div className="auth-copy">
                        <p className="eyebrow">Welcome back</p>
                        <h2>Login</h2>
                        <p>Enter your credentials to continue managing your store.</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
                        <TextField
                            autoComplete="email"
                            error={errors.email?.message}
                            icon={<Mail size={17} />}
                            label="Email"
                            placeholder="admin@commerzia.com"
                            type="email"
                            {...register("email")}
                        />

                        <TextField
                            autoComplete="current-password"
                            error={errors.password?.message}
                            icon={<Lock size={17} />}
                            label="Password"
                            placeholder="********"
                            type="password"
                            {...register("password")}
                        />

                        <div className="auth-row">
                            <label className="check-row">
                                <input type="checkbox" />
                                <span>Remember me</span>
                            </label>
                            <Link to="/forgot-password">Forgot password?</Link>
                        </div>

                        <Button fullWidth type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Checking..." : "Log in"}
                        </Button>
                    </form>

                    <p className="auth-footer-text">
                        Need a store account? <Link to="/create-account">Create account</Link>
                    </p>
                </div>
            </section>
        </main>
    );
}
