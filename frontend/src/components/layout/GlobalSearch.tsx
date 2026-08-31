import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Package, Search, ShoppingCart, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { globalSearch } from "../../features/topbar/topbarApi";

const SECTIONS = [
    { key: "products" as const, label: "Productos", icon: Package },
    { key: "customers" as const, label: "Clientes", icon: Users },
    { key: "orders" as const, label: "Pedidos", icon: ShoppingCart },
];

export default function GlobalSearch() {
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);

    const [rawQuery, setRawQuery] = useState("");
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    // Debounce simple: esperamos 300ms sin tipear antes de disparar
    // la búsqueda, para no pegarle al backend en cada tecla.
    useEffect(() => {
        const timer = setTimeout(() => setQuery(rawQuery.trim()), 300);
        return () => clearTimeout(timer);
    }, [rawQuery]);

    const { data, isFetching } = useQuery({
        queryKey: ["global-search", query],
        queryFn: () => globalSearch(query),
        enabled: query.length >= 2,
    });

    // Cierra el dropdown al hacer click afuera.
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

    function handleSelect(url: string) {
        navigate(url);
        setIsOpen(false);
        setRawQuery("");
        setQuery("");
    }

    const hasResults =
        data &&
        (data.products.length > 0 || data.customers.length > 0 || data.orders.length > 0);

    return (
        <div className="topbar-search" ref={containerRef}>
            <Search size={18} />
            <input
                type="search"
                placeholder="Buscar productos, clientes, pedidos..."
                value={rawQuery}
                onChange={(e) => {
                    setRawQuery(e.target.value);
                    setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                onKeyDown={(e) => {
                    if (e.key === "Escape") setIsOpen(false);
                }}
            />

            {isOpen && query.length >= 2 && (
                <div className="search-dropdown">
                    {isFetching && !data && (
                        <div className="search-dropdown-empty">Buscando...</div>
                    )}

                    {data && !hasResults && !isFetching && (
                        <div className="search-dropdown-empty">
                            Sin resultados para "{query}".
                        </div>
                    )}

                    {data &&
                        SECTIONS.map((section) => {
                            const items = data[section.key];
                            if (items.length === 0) return null;

                            return (
                                <div key={section.key} className="search-dropdown-section">
                                    <p className="search-dropdown-heading">
                                        <section.icon size={13} />
                                        {section.label}
                                    </p>

                                    {items.map((item) => (
                                        <button
                                            key={`${section.key}-${item.id}`}
                                            type="button"
                                            className="search-dropdown-item"
                                            onClick={() => handleSelect(item.url)}
                                        >
                                            <strong>{item.title}</strong>
                                            <span>{item.subtitle}</span>
                                        </button>
                                    ))}
                                </div>
                            );
                        })}
                </div>
            )}
        </div>
    );
}
