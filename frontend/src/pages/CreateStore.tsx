import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store, Globe } from "lucide-react";
import Button from "../components/ui/Button";
import TextField from "../components/ui/TextField";
import { createStore } from "../features/stores/storeApi";

export default function CreateStore() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [subdomain, setSubdomain] = useState("");
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");

    // Generar el subdominio automáticamente a partir del nombre comercial
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setName(newName);

        // Convertir a minúsculas, reemplazar espacios/caracteres especiales por guiones
        const autoSubdomain = newName
            .toLowerCase()
            .trim()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Remueve acentos
            .replace(/[\s_]+/g, "-")
            .replace(/[^\w-]+/g, "");

        setSubdomain(autoSubdomain);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setCargando(true);
        setError("");

        try {
            const response = await createStore({ name, subdomain });

            // 1. Guardar el subdominio en localStorage para el interceptor Header X-Tenant de Axios
            if (response.data?.subdomain) {
                localStorage.setItem("tenant_subdomain", response.data.subdomain);
            }

            // 2. Redirigir al Dashboard de la tienda recién creada
            navigate("/");
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                "Ocurrió un error al crear la tienda. Intenta con otro subdominio."
            );
        } finally {
            setCargando(false);
        }
    };

    return (
        <main className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <section className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-5">
                    <Store size={28} />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                    Crea tu espacio de trabajo
                </h2>
                <p className="text-gray-600 text-sm text-center mb-6">
                    Ingresa el nombre de tu negocio y elige un subdominio único para acceder a tu plataforma.
                </p>

                {error && (
                    <div className="p-3 mb-6 text-sm bg-red-50 text-red-700 border border-red-200 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <TextField
                        label="Nombre de tu empresa o tienda"
                        placeholder="Ej. Comercializadora ABC"
                        value={name}
                        onChange={handleNameChange}
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Dirección web (Subdominio)
                        </label>
                        <div className="flex shadow-sm rounded-md">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                <Globe size={16} className="mr-1" /> https://
                            </span>
                            <input
                                type="text"
                                value={subdomain}
                                onChange={(e) =>
                                    setSubdomain(
                                        e.target.value
                                            .toLowerCase()
                                            .replace(/[^a-z0-9-]/g, "")
                                    )
                                }
                                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                placeholder="mi-tienda"
                                required
                            />
                            <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                .colmerzia.com
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                            Solo se permiten letras minúsculas, números y guiones.
                        </p>
                    </div>

                    <div className="pt-2">
                        <Button fullWidth type="submit" disabled={cargando || !name || !subdomain}>
                            {cargando ? "Creando espacio..." : "Crear mi tienda y continuar"}
                        </Button>
                    </div>
                </form>
            </section>
        </main>
    );
}