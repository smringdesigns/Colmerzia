import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

/**
 * Envuelve rutas que requieren sesión activa.
 * Si no hay token, manda al login sin más.
 * El estado `replace` evita que /login quede en el historial.
 *
 * Además, si el usuario ya está logueado pero todavía no tiene
 * tienda (store_id vacío), lo manda a /onboarding antes de dejarlo
 * entrar a cualquier ruta que dependa de X-Tenant — sin esto, esas
 * peticiones fallarían con un 400 del backend ("espacio de trabajo
 * no especificado").
 */
export default function ProtectedRoute() {
    const token = useAuthStore((state) => state.token);
    const user = useAuthStore((state) => state.user);
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    const isSuperAdmin = user?.roles?.some((role) => role.slug === "super-admin");

    const exemptPaths = ["/onboarding", "/verify-email"];

    if (
        user &&
        !user.store_id &&
        !isSuperAdmin &&
        !exemptPaths.includes(location.pathname)
    ) {
        return <Navigate to="/onboarding" replace />;
    }

    return <Outlet />;
}