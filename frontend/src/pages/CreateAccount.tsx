import { useState } from "react";
import { Lock, Mail, Store } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../components/ui/Button";
import TextField from "../components/ui/TextField";
import { api } from "../api/client";

export default function CreateAccount() {
    const navigate = useNavigate();

    const [businessName, setBusinessName] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function generateSubdomain(name: string): string {
        return name
            .toLowerCase()
            .trim()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");

        if (!businessName.trim()) {
            setError("Ingresa el nombre de la tienda.");
            return;
        }

        if (!ownerName.trim()) {
            setError("Ingresa el nombre del propietario.");
            return;
        }

        if (!email.trim()) {
            setError("Ingresa un correo electrónico.");
            return;
        }

        if (password.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres.");
            return;
        }

        if (!acceptedPrivacy) {
            setError(
                "Debes aceptar la Política de Privacidad para continuar."
            );
            return;
        }

        const subdomain = generateSubdomain(businessName);

        if (!subdomain) {
            setError(
                "El nombre de la tienda no permite generar un subdominio válido."
            );
            return;
        }

        setLoading(true);

        try {
            const response = await api.post(
                "/v1/onboarding",
                {
                    business_name: businessName.trim(),
                    subdomain,
                    owner_name: ownerName.trim(),
                    email: email.trim().toLowerCase(),
                    password,
                    plan_slug: "free",
                }
            );

            const responseData = response.data?.data ?? response.data;

            const token = responseData?.token;
            const store = responseData?.store;

            if (token) {
                localStorage.setItem("token", token);
            }

            if (store?.subdomain) {
                localStorage.setItem(
                    "tenant_subdomain",
                    store.subdomain
                );
            }

            navigate("/", {
                replace: true,
            });
        } catch (err: any) {
            const validationErrors =
                err.response?.data?.errors;

            if (validationErrors) {
                const firstError = Object.values(
                    validationErrors
                )[0];

                if (
                    Array.isArray(firstError) &&
                    firstError.length > 0
                ) {
                    setError(String(firstError[0]));
                } else {
                    setError(
                        "Revisa los datos ingresados e intenta nuevamente."
                    );
                }
            } else {
                setError(
                    err.response?.data?.message ||
                    "No fue posible crear la tienda. Intenta nuevamente."
                );
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-card">

                <div
                    className="auth-media"
                    aria-hidden="true"
                >
                    <img
                        src="/auth/login-office.jpeg"
                        alt=""
                    />

                    <div className="auth-media-overlay">

                        <div className="auth-logo large">
                            <Store size={26} />
                        </div>

                        <p>Nueva tienda</p>

                        <h1>
                            Crea y administra tu tienda
                            desde un solo lugar.
                        </h1>

                        <span>
                            Configura tu negocio y comienza
                            a gestionar productos, pedidos
                            y usuarios.
                        </span>

                    </div>
                </div>


                <div className="auth-form-panel">

                    <div className="auth-copy">

                        <p className="eyebrow">
                            Bienvenido
                        </p>

                        <h2>
                            Crear cuenta
                        </h2>

                        <p>
                            Registra tu tienda y crea la
                            cuenta principal para administrar
                            tu negocio.
                        </p>

                    </div>


                    {error && (
                        <div
                            className="auth-error"
                            role="alert"
                        >
                            {error}
                        </div>
                    )}


                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                        noValidate
                    >

                        <TextField
                            label="Nombre de la tienda"
                            placeholder="Ej. Colmerzia Store"
                            value={businessName}
                            onChange={(event) =>
                                setBusinessName(
                                    event.target.value
                                )
                            }
                            disabled={loading}
                            required
                        />


                        <TextField
                            label="Nombre del propietario"
                            placeholder="Ej. Juan Pérez"
                            value={ownerName}
                            onChange={(event) =>
                                setOwnerName(
                                    event.target.value
                                )
                            }
                            disabled={loading}
                            required
                        />


                        <TextField
                            icon={<Mail size={17} />}
                            label="Email"
                            placeholder="tienda@correo.com"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                            disabled={loading}
                            required
                        />


                        <TextField
                            icon={<Lock size={17} />}
                            label="Contraseña"
                            placeholder="Mínimo 8 caracteres"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            disabled={loading}
                            required
                        />


                        <label className="check-row">

                            <input
                                type="checkbox"
                                checked={acceptedPrivacy}
                                onChange={(event) =>
                                    setAcceptedPrivacy(
                                        event.target.checked
                                    )
                                }
                                disabled={loading}
                            />

                            <span>
                                Acepto la Política de
                                Privacidad
                            </span>

                        </label>


                        <Button
                            fullWidth
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Creando tienda..."
                                : "Crear cuenta"}
                        </Button>

                    </form>


                    <p className="auth-footer-text">

                        ¿Ya tienes una cuenta?{" "}

                        <Link to="/login">
                            Inicia sesión
                        </Link>

                    </p>

                </div>

            </section>
        </main>
    );
}