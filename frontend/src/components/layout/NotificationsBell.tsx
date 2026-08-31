import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell, PackageX, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getNotifications } from "../../features/topbar/topbarApi";

export default function NotificationsBell() {
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    // Refresca solo (sin que el usuario haga nada) cada 60s -- no es
    // tiempo real, pero para pedidos pendientes / stock bajo alcanza
    // de sobra y no requiere meter websockets.
    const { data } = useQuery({
        queryKey: ["notifications"],
        queryFn: getNotifications,
        refetchInterval: 60_000,
    });

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const count = data?.count ?? 0;

    return (
        <div className="notifications-wrap" ref={containerRef}>
            <button
                className="icon-button"
                type="button"
                aria-label="Notificaciones"
                onClick={() => setIsOpen((open) => !open)}
            >
                <Bell size={19} />
                {count > 0 && <span className="notification-dot" />}
            </button>

            {isOpen && (
                <div className="notifications-dropdown">
                    <p className="notifications-dropdown-title">Notificaciones</p>

                    {count === 0 && (
                        <div className="search-dropdown-empty">
                            Todo al día — sin pendientes.
                        </div>
                    )}

                    {data?.items.map((item, index) => (
                        <button
                            key={`${item.type}-${index}`}
                            type="button"
                            className="notification-item"
                            onClick={() => {
                                navigate(item.url);
                                setIsOpen(false);
                            }}
                        >
                            <span className="notification-icon">
                                {item.type === "order" ? (
                                    <ShoppingCart size={14} />
                                ) : (
                                    <PackageX size={14} />
                                )}
                            </span>
                            <span className="notification-item-text">
                                <strong>{item.title}</strong>
                                <span>{item.subtitle}</span>
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
