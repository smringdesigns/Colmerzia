import { MailCheck } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import Button from "../components/ui/Button";

export default function CheckEmail() {
    const location = useLocation();
    const email = location.state?.email || "tu correo electrónico";

    return (
        <main className="auth-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
            <section className="auth-card" style={{ maxWidth: '400px', width: '100%', padding: '2rem', textAlign: 'center', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: '#6366f1' }}>
                    <MailCheck size={64} />
                </div>

                <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    Revisa tu bandeja de entrada
                </h2>

                <p style={{ color: '#4b5563', marginBottom: '2rem' }}>
                    Hemos creado tu tienda exitosamente. Para continuar, por favor haz clic en el enlace de verificación que enviamos a <strong>{email}</strong>.
                </p>

                <Link to="/login" style={{ textDecoration: 'none' }}>
                    <Button fullWidth type="button">
                        Ir al inicio de sesión
                    </Button>
                </Link>

            </section>
        </main>
    );
}