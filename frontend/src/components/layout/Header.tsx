import { useState } from "react";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logout as logoutRequest } from "../../features/auth/authApi";
import { useAuthStore } from "../../store/authStore";
import GlobalSearch from "./GlobalSearch";
import NotificationsBell from "./NotificationsBell";

export default function Header() {
    const navigate = useNavigate();
    const { user, logout: clearSession } = useAuthStore();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    async function logout() {
        setIsLoggingOut(true);

        try {
            // Revoca el token en el backend (borra el personal access token).
            // Si falla (token ya vencido, sin red, etc.) igual cerramos la
            // sesion localmente para no dejar al usuario atascado.
            await logoutRequest();
        } catch (error) {
            console.error("No se pudo revocar el token en el servidor:", error);
        } finally {
            clearSession();
            navigate("/login", { replace: true });
        }
    }

    const roleName = user?.roles?.[0]?.name ?? "Usuario";

    return (
        <header className="topbar">
            <GlobalSearch />

            <div className="topbar-actions">
                <NotificationsBell />

                <div className="user-chip">
                    <span className="avatar">
                        <User size={17} />
                    </span>
                    <div>
                        <strong>{user?.name ?? "Usuario"}</strong>
                        <span>{roleName}</span>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="logout-button"
                    type="button"
                    disabled={isLoggingOut}
                >
                    <LogOut size={16} />
                    {isLoggingOut ? "Cerrando..." : "Cerrar Sesión"}
                </button>
            </div>
        </header>
    );
}