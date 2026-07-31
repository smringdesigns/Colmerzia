import { useState } from "react";
import { Mail, Store } from "lucide-react";
import { Link } from "react-router-dom";

// Asegúrate de que esta ruta apunte correctamente a donde tienes tus funciones de API
import { forgotPassword } from "../features/auth/authApi"; 

import Button from "../components/ui/Button";
import TextField from "../components/ui/TextField";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [cargando, setCargando] = useState(false);
    const [mensajeExito, setMensajeExito] = useState("");
    const [mensajeError, setMensajeError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); 
        
        if (!email) {
            setMensajeError("Por favor ingresa un correo electrónico.");
            return;
        }

        setCargando(true);
        setMensajeExito("");
        setMensajeError("");

        try {
            await forgotPassword(email); 
            setMensajeExito("Si el correo existe, te hemos enviado las instrucciones para restablecer tu contraseña.");
            setEmail(""); 
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || "Ocurrió un error al procesar tu solicitud. Intenta de nuevo.";
            setMensajeError(errorMsg);
        } finally {
            setCargando(false);
        }
    };

    return (
        <main className="auth-page">
            <section className="auth-card auth-card-compact">
                <div className="auth-media" aria-hidden="true">
                    <img src="/auth/login-office.jpeg" alt="" />
                    <div className="auth-media-overlay">
                        <div className="auth-logo large">
                            <Store size={26} />
                        </div>
                        <p>Recupera tu cuenta</p>
                        <h1>Recupera el acceso a tu espacio de trabajo.</h1>
                        <span>Te enviaremos un enlace seguro para restablecer tu contraseña.</span>
                    </div>
                </div>

                <div className="auth-form-panel">
                    <div className="auth-copy">
                        <p className="eyebrow">Recuperación de acceso</p>
                        <h2>¿Olvidaste tu contraseña?</h2>
                        <p>Ingresa el correo asociado a tu cuenta y te enviaremos instrucciones para restablecerla.</p>
                    </div>

                    {mensajeExito && (
                        <div className="p-3 mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md">
                            {mensajeExito}
                        </div>
                    )}
                    {mensajeError && (
                        <div className="p-3 mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
                            {mensajeError}
                        </div>
                    )}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <TextField
                            icon={<Mail size={17} />}
                            label="Email"
                            placeholder="tienda@correo.com"
                            type="email"
                            value={email}
                            onChange={(e: any) => setEmail(e.target ? e.target.value : e)}
                            required
                        />

                        {/* Usamos tu componente Button original manteniendo tus estilos y diseño */}
                        <Button fullWidth type="submit" disabled={cargando}>
                            {cargando ? "Enviando enlace..." : "Enviar enlace de recuperación"}
                        </Button>
                    </form>

                    <p className="auth-footer-text">
                        ¿Recordaste tu contraseña? <Link to="/login">Volver al inicio de sesión</Link>
                    </p>
                </div>
            </section>
        </main>
    );
}