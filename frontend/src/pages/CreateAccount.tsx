import { Lock, Mail, Store } from "lucide-react";
import { Link } from "react-router-dom";

import Button from "../components/ui/Button";
import TextField from "../components/ui/TextField";

export default function CreateAccount() {
    return (
        <main className="auth-page">
            <section className="auth-card">
                <div className="auth-media" aria-hidden="true">
                    <img src="/auth/login-office.jpeg" alt="" />
                    <div className="auth-media-overlay">
                        <div className="auth-logo large">
                            <Store size={26} />
                        </div>
                        <p>Nueva tienda</p>
                        <h1>Crea y administra tu tienda desde un solo lugar.</h1>
                        <span>
                            Configura tu negocio y comienza a gestionar productos, pedidos y usuarios.
                        </span>
                    </div>
                </div>

                <div className="auth-form-panel">
                    <div className="auth-copy">
                        <p className="eyebrow">Bienvenido</p>
                        <h2>Crear cuenta</h2>
                        <p>
                            Registra tu tienda y crea la cuenta principal para administrar tu negocio.
                        </p>
                    </div>

                    <form className="auth-form">
                        <TextField label="Nombre de la tienda" placeholder="Tienda Colmerzia" />
                        <TextField
                            icon={<Mail size={17} />}
                            label="Email"
                            placeholder="tienda@correo.com"
                            type="email"
                        />
                        <TextField
                            icon={<Lock size={17} />}
                            label="Contraseña"
                            placeholder="********"
                            type="password"
                        />

                        <label className="check-row">
                            <input type="checkbox" />
                            <span>Acepto la Política de Privacidad</span>
                        </label>

                        <Button fullWidth type="button">
                            Crear cuenta
                        </Button>
                    </form>

                    <p className="auth-footer-text">
                        ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
                    </p>
                </div>
            </section>
        </main>
    );
}
