import { useState } from "react";
import { Mail } from "lucide-react";
import Button from "../../components/ui/Button";
import { sendVerificationEmail } from "./authApi";

export default function VerifyEmail() {
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [esError, setEsError] = useState(false);

    const handleResend = async () => {
        setCargando(true);
        setMensaje("");
        setEsError(false);
        try {
            const data = await sendVerificationEmail();
            setMensaje(data?.message || "¡Correo de verificación reenviado!");
        } catch (error: any) {
            setEsError(true);
            setMensaje(
                error.response?.data?.message || "Ocurrió un error al enviar el correo."
            );
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)] w-full p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-5">
                    <Mail size={28} />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Verifica tu correo electrónico
                </h2>
                
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                    Hemos enviado un enlace de confirmación a tu dirección de correo. Por favor, revísalo en tu bandeja de entrada para activar completamente tu espacio de trabajo.
                </p>

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

                <Button fullWidth onClick={handleResend} disabled={cargando}>
                    {cargando ? "Enviando..." : "Reenviar correo de verificación"}
                </Button>
            </div>
        </div>
    );
}