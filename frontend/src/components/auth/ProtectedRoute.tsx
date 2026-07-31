import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

/**
 * Envuelve rutas que requieren sesión activa.
 * Si no hay token, manda al login sin más.
 * El estado `replace` evita que /login quede en el historial.
 */
export default function ProtectedRoute() {
    const token = useAuthStore((state) => state.token);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}