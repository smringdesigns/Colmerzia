import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Globe, Store } from "lucide-react";

import Button from "../components/ui/Button";
import TextField from "../components/ui/TextField";
import SelectField from "../components/ui/SelectField";
import { createStore } from "../features/stores/storeApi";
import {
    getBusinessTypes,
    type BusinessTypeOption,
} from "../features/stores/businessTypeApi";
import { useAuthStore } from "../store/authStore";

/**
 * Un usuario puede llegar acá autenticado pero sin store_id (por
 * ejemplo, una cuenta creada por soporte antes de tener tienda
 * asignada). Login.tsx lo redirige aquí automáticamente. A
 * diferencia de CreateAccount.tsx (onboarding público, cuenta +
 * tienda juntas), esta pantalla solo crea la tienda para una cuenta
 * que ya existe.
 */
export default function CreateStore() {
    const navigate = useNavigate();
    const setUser = useAuthStore((state) => state.setUser);
    const user = useAuthStore((state) => state.user);

    const [name, setName] = useState("");
    const [subdomain, setSubdomain] = useState("");
    const [subdomainEdited, setSubdomainEdited] = useState(false);
    const [businessType, setBusinessType] = useState("");

    const [businessTypes, setBusinessTypes] = useState<BusinessTypeOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        getBusinessTypes()
            .then((types) => {
                if (active) {
                    setBusinessTypes(types);
                }
            })
            .catch(() => {
                // Igual que en CreateAccount: si falla, el select
                // queda vacío pero no bloqueamos el resto del form.
            });

        return () => {
            active = false;
        };
    }, []);

    function slugify(value: string): string {
        return value
            .toLowerCase()
            .trim()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        setName(value);

        // Autogenera el subdominio a partir del nombre, salvo que el
        // usuario ya lo haya tocado a mano.
        if (!subdomainEdited) {
            setSubdomain(slugify(value));
        }
    }

    function handleSubdomainChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSubdomainEdited(true);
        setSubdomain(slugify(event.target.value));
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        if (!name.trim()) {
            setError("Ingresa el nombre de tu tienda.");
            return;
        }

        if (!subdomain) {
            setError("El nombre ingresado no permite generar un subdominio válido.");
            return;
        }

        if (!businessType) {
            setError("Selecciona el tipo de negocio.");
            return;
        }

        setLoading(true);

        try {
            const response = await createStore({
                name: name.trim(),
                subdomain,
                business_type: businessType,
            });

            const store = response.data;

            if (store?.subdomain) {
                localStorage.setItem("tenant_subdomain", store.subdomain);
            }

            // Refleja el store_id nuevo en el usuario en memoria para
            // que ProtectedRoute/Sidebar dejen de pensar que no tiene
            // tienda todavía.
            if (user) {
                setUser({ ...user, store_id: store.id, store });
            }

            navigate("/", { replace: true });
        } catch (err: any) {
            const validationErrors = err.response?.data?.errors;

            if (validationErrors) {
                const firstError = Object.values(validationErrors)[0];

                setError(
                    Array.isArray(firstError) && firstError.length > 0
                        ? String(firstError[0])
                        : "Revisa los datos ingresados e intenta nuevamente."
                );
            } else {
                setError(
                    err.response?.data?.message ||
                    "No fue posible crear tu tienda. Intenta nuevamente."
                );
            }
        } finally {
            setLoading(false);
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

                        <p>Último paso</p>

                        <h1>Crea tu espacio de trabajo.</h1>

                        <span>
                            Tu cuenta ya existe, solo falta ponerle nombre a tu
                            tienda para empezar a administrarla.
                        </span>
                    </div>
                </div>

                <div className="auth-form-panel">

                    <div className="auth-copy">
                        <p className="eyebrow">Bienvenido de nuevo</p>

                        <h2>Crea tu tienda</h2>

                        <p>
                            Tu cuenta todavía no tiene una tienda asociada.
                            Elige un nombre y un subdominio único para continuar.
                        </p>
                    </div>

                    {error && (
                        <div className="auth-error" role="alert">
                            {error}
                        </div>
                    )}

                    <form className="auth-form" onSubmit={handleSubmit} noValidate>

                        <TextField
                            label="Nombre de tu empresa o tienda"
                            placeholder="Ej. Comercializadora ABC"
                            value={name}
                            onChange={handleNameChange}
                            disabled={loading}
                            required
                        />

                        <TextField
                            icon={<Globe size={17} />}
                            label="Subdominio"
                            placeholder="mi-tienda"
                            value={subdomain}
                            onChange={handleSubdomainChange}
                            disabled={loading}
                            required
                        />

                        <SelectField
                            label="Tipo de negocio"
                            placeholder="Selecciona una opción"
                            value={businessType}
                            onChange={(event) =>
                                setBusinessType(event.target.value)
                            }
                            options={businessTypes.map((type) => ({
                                value: type.slug,
                                label: type.name,
                            }))}
                            disabled={loading || businessTypes.length === 0}
                            required
                        />

                        <p className="auth-hint">
                            Tu tienda quedará disponible en{" "}
                            <strong>{subdomain || "mi-tienda"}.colmerzia.com</strong>.
                            Solo letras minúsculas, números y guiones.
                        </p>

                        <Button
                            type="submit"
                            fullWidth
                            disabled={loading}
                        >
                            {loading ? "Creando tienda..." : "Crear mi tienda"}
                        </Button>

                    </form>

                </div>

            </section>
        </main>
    );
}
