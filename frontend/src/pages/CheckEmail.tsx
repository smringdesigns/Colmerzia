import { useState } from "react";
import { MailCheck } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import Button from "../components/ui/Button";
import { sendVerificationEmail } from "../features/auth/authApi";

export default function CheckEmail() {
    const location = useLocation();

    // Recuperamos el correo enviado desde el registro.
    // Si el usuario entra directamente a esta pantalla,
    // mostramos un texto genérico.
    const email = location.state?.email || "tu correo electrónico";

    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [esError, setEsError] = useState(false);

    // Permite solicitar nuevamente el correo de verificación.
    const handleResend = async () => {
        setCargando(true);
        setMensaje("");
        setEsError(false);

        try {
            const data = await sendVerificationEmail();

            setMensaje(
                data?.message || "¡Correo de verificación reenviado!"
            );
        } catch (error: any) {
            setEsError(true);

            setMensaje(
                error.response?.data?.message ||
                    "Ocurrió un error al enviar el correo."
            );
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)] w-full p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">

                {/* Icono principal de confirmación */}
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-5">
                    <MailCheck size={28} />
                </div>

                {/* Título principal */}
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Revisa tu bandeja de entrada
                </h2>

                {/* Mensaje principal */}
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                    Hemos creado tu tienda exitosamente. Para continuar,
                    haz clic en el enlace de verificación que enviamos a{" "}
                    <strong className="text-gray-900">{email}</strong>.
                </p>

                {/* Mensaje de éxito o error al reenviar */}
                {mensaje && (
                    <div
                        className={`p-3 mb-6 text-sm rounded-lg border ${
                            esError
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}
                    >
                        {mensaje}
                    </div>
                )}

                {/* Reenviar correo */}
                <Button
                    fullWidth
                    onClick={handleResend}
                    disabled={cargando}
                >
                    {cargando
                        ? "Enviando..."
                        : "Reenviar correo de verificación"}
                </Button>

                {/* Volver al inicio de sesión */}
                <Link
                    to="/login"
                    className="block mt-4 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                    Ir al inicio de sesión
                </Link>
            </div>
        </div>
    );
}