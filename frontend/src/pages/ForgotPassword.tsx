import { Mail, Store } from "lucide-react";
import { Link } from "react-router-dom";

import Button from "../components/ui/Button";
import TextField from "../components/ui/TextField";

export default function ForgotPassword() {
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

                    <form className="auth-form">
                        <TextField
                            icon={<Mail size={17} />}
                            label="Email"
                            placeholder="tienda@correo.com"
                            type="email"
                        />

                        <Button fullWidth type="button">
                            Enviar enlace de recuperación
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
