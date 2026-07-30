import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Eye, Search } from "lucide-react";

import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import Panel from "../components/ui/Panel";
import { getOrders, type OrderStatus } from "../features/orders/ordersApi";
import {
    ORDER_STATUS_LABELS,
    ORDER_STATUS_OPTIONS,
    ORDER_STATUS_TONES,
} from "../features/orders/statusLabels";

function formatMoney(value: string) {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
    }).format(Number(value));
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("es-CO", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default function Orders() {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [status, setStatus] = useState<OrderStatus | "">("");
    const [page, setPage] = useState(1);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    function handleSearch(value: string) {
        setSearch(value);

        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
            setDebouncedSearch(value);
            setPage(1);
        }, 500);
    }

    const { data, isError, isLoading } = useQuery({
        queryKey: ["orders", debouncedSearch, status, page],
        queryFn: () =>
            getOrders({
                page,
                per_page: 15,
                search: debouncedSearch || undefined,
                status: status || undefined,
            }),
    });

    return (
        <div className="resource-page">
            <PageHeader
                eyebrow="Ventas"
                title="Pedidos"
                subtitle={data ? `${data.total} pedidos` : "Cargando pedidos..."}
            />

            <Panel className="resource-toolbar">
                <label className="resource-search">
                    <Search size={17} />
                    <input
                        type="search"
                        placeholder="Buscar por número de pedido..."
                        value={search}
                        onChange={(event) => handleSearch(event.target.value)}
                    />
                </label>

                <select
                    className="ui-select"
                    value={status}
                    onChange={(event) => {
                        setStatus(event.target.value as OrderStatus | "");
                        setPage(1);
                    }}
                >
                    <option value="">Todos los estados</option>
                    {ORDER_STATUS_OPTIONS.map(([value, label]) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>
            </Panel>

            <Panel className="table-panel">
                <div className="windmill-table-wrap">
                    <table className="windmill-table">
                        <thead>
                            <tr>
                                <th>Pedido</th>
                                <th>Cliente</th>
                                <th>Fecha</th>
                                <th>Estado</th>
                                <th>Total</th>
                                <th aria-label="Acciones" />
                            </tr>
                        </thead>

                        <tbody>
                            {isLoading && (
                                <tr>
                                    <td colSpan={6}>
                                        <div className="empty-state">Cargando pedidos...</div>
                                    </td>
                                </tr>
                            )}

                            {isError && (
                                <tr>
                                    <td colSpan={6}>
                                        <div className="empty-state danger">
                                            Error al cargar los pedidos. Verifica la conexión con el backend.
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {!isLoading && data?.data.length === 0 && (
                                <tr>
                                    <td colSpan={6}>
                                        <div className="empty-state">
                                            {debouncedSearch || status
                                                ? "Sin resultados para ese filtro."
                                                : "Todavía no hay pedidos."}
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {data?.data.map((order) => (
                                <tr key={order.id}>
                                    <td>
                                        <div className="primary-cell">
                                            <strong>{order.order_number}</strong>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="primary-cell">
                                            <strong>{order.customer_snapshot?.name ?? "-"}</strong>
                                            {order.customer_snapshot?.email && (
                                                <span>{order.customer_snapshot.email}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td>{formatDate(order.created_at)}</td>
                                    <td>
                                        <Badge tone={ORDER_STATUS_TONES[order.status]}>
                                            {ORDER_STATUS_LABELS[order.status]}
                                        </Badge>
                                    </td>
                                    <td>{formatMoney(order.total)}</td>
                                    <td>
                                        <div className="actions-cell">
                                            <button
                                                type="button"
                                                title="Ver detalle"
                                                onClick={() => navigate(`/orders/${order.id}`)}
                                            >
                                                <Eye size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Panel>

            {data && data.last_page > 1 && (
                <div className="pagination-bar">
                    <span>
                        Página {data.current_page} de {data.last_page}
                    </span>
                    <div>
                        <Button
                            type="button"
                            variant="secondary"
                            disabled={data.current_page === 1}
                            onClick={() => setPage((current) => Math.max(1, current - 1))}
                        >
                            <ChevronLeft size={15} />
                            Anterior
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            disabled={data.current_page === data.last_page}
                            onClick={() => setPage((current) => Math.min(data.last_page, current + 1))}
                        >
                            Siguiente
                            <ChevronRight size={15} />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}