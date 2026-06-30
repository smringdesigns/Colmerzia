import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

/**
 * Envuelve rutas que solo deben verse sin sesión (login, registro).
 * Si el usuario ya está autenticado, lo manda directo al dashboard.
 */
export default function PublicRoute() {
    const token = useAuthStore((state) => state.token);

    if (token) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
