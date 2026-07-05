import { useState } from "react";
import { Bell, LogOut, Search, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logout as logoutRequest } from "../../features/auth/authApi";
import { useAuthStore } from "../../store/authStore";

export default function Header() {
    const navigate = useNavigate();
    const clearSession = useAuthStore((state) => state.logout);
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

    return (
        <header className="topbar">
            <div className="topbar-search">
                <Search size={18} />
                <input type="search" placeholder="Search products, customers, orders..." />
            </div>

            <div className="topbar-actions">
                <button className="icon-button" type="button" aria-label="Notifications">
                    <Bell size={19} />
                    <span className="notification-dot" />
                </button>

                <div className="user-chip">
                    <span className="avatar">
                        <User size={17} />
                    </span>
                    <div>
                        <strong>Admin</strong>
                        <span>Gerencia</span>
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