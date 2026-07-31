import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Lock, Store } from "lucide-react";

import Button from "../components/ui/Button";
import TextField from "../components/ui/TextField";
import { resetPassword } from "../features/auth/authApi";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // Extraemos el token y email de la URL
    const token = searchParams.get("token") || "";
    const email = searchParams.get("email") || "";

    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [esError, setEsError] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== passwordConfirmation) {
            setEsError(true);
            setMensaje("Las contraseñas no coinciden.");
            return;
        }

        setCargando(true);
        setMensaje("");
        setEsError(false);

        try {
            await resetPassword({
                email,
                token,
                password,
                password_confirmation: passwordConfirmation,
            });
            
            setEsError(false);
            setMensaje("¡Tu contraseña ha sido restablecida con éxito!");
            
            // Redirigimos al login después de 3 segundos
            setTimeout(() => {
                navigate("/login");
            }, 3000);
            
        } catch (error: any) {
            setEsError(true);
            setMensaje(error.response?.data?.message || "Error al restablecer la contraseña.");
        } finally {
            setCargando(false);
        }
    };

    // Si el usuario entra a la ruta sin token ni email en la URL, mostramos un error
    if (!token || !email) {
        return (
            <main className="auth-page">
                <section className="auth-card auth-card-compact text-center p-6">
                    <h2>Enlace inválido</h2>
                    <p className="text-gray-600 mb-4">El enlace para restablecer la contraseña no es válido o está incompleto.</p>
                    <Link to="/forgot-password">
                        <Button>Volver a solicitar enlace</Button>
                    </Link>
                </section>
            </main>
        );
    }

    return (
        <main className="auth-page">
            <section className="auth-card auth-card-compact">
                <div className="auth-form-panel" style={{ width: '100%' }}>
                    <div className="auth-logo large mx-auto mb-4 text-center">
                        <Store size={26} />
                    </div>
                    <div className="auth-copy text-center">
                        <h2>Crea una nueva contraseña</h2>
                        <p>Ingresa tu nueva contraseña para la cuenta <strong>{email}</strong>.</p>
                    </div>

                    {mensaje && (
                        <div className={`p-3 mb-4 text-sm rounded-md border ${
                            esError ? "bg-red-50 text-red-700 border-red-200" : "bg-green-50 text-green-700 border-green-200"
                        }`}>
                            {mensaje}
                        </div>
                    )}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <TextField
                            icon={<Lock size={17} />}
                            label="Nueva contraseña"
                            placeholder="Min. 8 caracteres"
                            type="password"
                            value={password}
                            onChange={(e: any) => setPassword(e.target ? e.target.value : e)}
                            required
                        />

                        <TextField
                            icon={<Lock size={17} />}
                            label="Confirmar contraseña"
                            placeholder="Repite la contraseña"
                            type="password"
                            value={passwordConfirmation}
                            onChange={(e: any) => setPasswordConfirmation(e.target ? e.target.value : e)}
                            required
                        />

                        <Button fullWidth type="submit" disabled={cargando || !password}>
                            {cargando ? "Guardando..." : "Restablecer contraseña"}
                        </Button>
                    </form>
                </div>
            </section>
        </main>
    );
}