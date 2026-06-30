import { Bell, LogOut, Search, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export default function Header() {
    const navigate = useNavigate();
    const clearSession = useAuthStore((state) => state.logout);

    function logout() {
        clearSession();
        navigate("/login", { replace: true });
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
                        <span>Store manager</span>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="logout-button"
                    type="button"
                >
                    <LogOut size={16} />
                    Logout
                </button>
            </div>
        </header>
    );
}
