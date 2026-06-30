import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Pencil, Trash2, ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import {
    getCustomers,
    deleteCustomer,
    type Customer,
} from "../features/customers/customersApi";

function fullName(c: Customer) {
    return [c.first_name, c.last_name].filter(Boolean).join(" ");
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("es-CO", {
        year: "numeric", month: "short", day: "numeric",
    });
}

export default function Customers() {
    const navigate    = useNavigate();
    const queryClient = useQueryClient();

    const [search,          setSearch]          = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page,            setPage]            = useState(1);

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

    const { data, isLoading, isError } = useQuery({
        queryKey: ["customers", debouncedSearch, page],
        queryFn: () => getCustomers({
            search: debouncedSearch || undefined,
            page,
            per_page: 15,
        }),
    });

    const { mutate: remove, isPending: isDeleting } = useMutation({
        mutationFn: deleteCustomer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers"] });
        },
    });

    function confirmDelete(customer: Customer) {
        if (confirm(`¿Eliminar a "${fullName(customer)}"? Esta acción no se puede deshacer.`)) {
            remove(customer.id);
        }
    }

    return (
        <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

            {/* Encabezado */}
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "24px",
            }}>
                <div>
                    <h1 style={{
                        fontSize: "22px",
                        fontWeight: "700",
                        color: "#0F1117",
                        letterSpacing: "-0.5px",
                        margin: 0,
                    }}>
                        Clientes
                    </h1>
                    <p style={{ color: "#6B7280", fontSize: "14px", margin: "4px 0 0" }}>
                        {data ? `${data.total} clientes registrados` : "Cargando..."}
                    </p>
                </div>

                <button
                    onClick={() => navigate("/customers/new")}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        background: "#6366F1",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "10px 16px",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                    }}
                >
                    <Plus size={16} />
                    Nuevo cliente
                </button>
            </div>

            {/* Búsqueda */}
            <div style={{ position: "relative", marginBottom: "20px", maxWidth: "360px" }}>
                <Search size={16} style={{
                    position: "absolute", left: "12px", top: "50%",
                    transform: "translateY(-50%)", color: "#9CA3AF",
                }} />
                <input
                    type="text"
                    placeholder="Buscar por nombre, correo o documento..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "9px 12px 9px 36px",
                        fontSize: "14px",
                        border: "1.5px solid #E5E7EB",
                        borderRadius: "8px",
                        outline: "none",
                        color: "#0F1117",
                        background: "#FAFAFA",
                        boxSizing: "border-box",
                    }}
                />
            </div>

            {/* Tabla */}
            <div style={{
                background: "#fff",
                border: "1px solid #E5E7EB",
                borderRadius: "12px",
                overflow: "hidden",
            }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "#F9FAFB" }}>
                            {["Cliente", "Contacto", "Documento", "Pedidos", "Registrado", "Estado", ""].map((h) => (
                                <th key={h} style={{
                                    padding: "12px 16px",
                                    textAlign: "left",
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    color: "#6B7280",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                    borderBottom: "1px solid #E5E7EB",
                                }}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {isLoading && (
                            <tr>
                                <td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#9CA3AF" }}>
                                    Cargando clientes...
                                </td>
                            </tr>
                        )}

                        {isError && (
                            <tr>
                                <td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#EF4444" }}>
                                    Error al cargar los clientes. Verifica la conexión con el backend.
                                </td>
                            </tr>
                        )}

                        {!isLoading && data?.data.length === 0 && (
                            <tr>
                                <td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#9CA3AF" }}>
                                    {debouncedSearch
                                        ? `Sin resultados para "${debouncedSearch}"`
                                        : "Aún no hay clientes. Crea el primero."}
                                </td>
                            </tr>
                        )}

                        {data?.data.map((customer, i) => (
                            <tr
                                key={customer.id}
                                style={{
                                    borderBottom: i < data.data.length - 1
                                        ? "1px solid #F3F4F6"
                                        : "none",
                                }}
                            >
                                {/* Nombre */}
                                <td style={{ padding: "14px 16px" }}>
                                    <div style={{ fontWeight: "500", color: "#0F1117", fontSize: "14px" }}>
                                        {fullName(customer)}
                                    </div>
                                    {customer.company && (
                                        <div style={{ color: "#9CA3AF", fontSize: "12px", marginTop: "2px" }}>
                                            {customer.company}
                                        </div>
                                    )}
                                </td>

                                {/* Contacto */}
                                <td style={{ padding: "14px 16px" }}>
                                    <div style={{ fontSize: "14px", color: "#374151" }}>
                                        {customer.email}
                                    </div>
                                    {customer.phone && (
                                        <div style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "2px" }}>
                                            {customer.phone}
                                        </div>
                                    )}
                                </td>

                                {/* Documento */}
                                <td style={{ padding: "14px 16px", fontSize: "13px", color: "#6B7280" }}>
                                    {customer.document_type && customer.document_number
                                        ? <span style={{
                                            fontFamily: "monospace",
                                            background: "#F3F4F6",
                                            padding: "2px 8px",
                                            borderRadius: "4px",
                                          }}>
                                            {customer.document_type} {customer.document_number}
                                          </span>
                                        : "—"}
                                </td>

                                {/* Pedidos */}
                                <td style={{ padding: "14px 16px" }}>
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px",
                                        fontSize: "14px",
                                        color: customer.orders_count > 0 ? "#6366F1" : "#9CA3AF",
                                        fontWeight: customer.orders_count > 0 ? "600" : "400",
                                    }}>
                                        <ShoppingBag size={14} />
                                        {customer.orders_count}
                                    </div>
                                </td>

                                {/* Registrado */}
                                <td style={{ padding: "14px 16px", fontSize: "13px", color: "#6B7280" }}>
                                    {formatDate(customer.created_at)}
                                </td>

                                {/* Estado */}
                                <td style={{ padding: "14px 16px" }}>
                                    <span style={{
                                        display: "inline-block",
                                        padding: "3px 10px",
                                        borderRadius: "999px",
                                        fontSize: "12px",
                                        fontWeight: "500",
                                        background: customer.is_active ? "#D1FAE5" : "#F3F4F6",
                                        color:      customer.is_active ? "#065F46" : "#6B7280",
                                    }}>
                                        {customer.is_active ? "Activo" : "Inactivo"}
                                    </span>
                                </td>

                                {/* Acciones */}
                                <td style={{ padding: "14px 16px" }}>
                                    <div style={{ display: "flex", gap: "8px" }}>
                                        <button
                                            onClick={() => navigate(`/customers/${customer.id}/edit`)}
                                            title="Editar"
                                            style={{
                                                padding: "6px",
                                                border: "1px solid #E5E7EB",
                                                borderRadius: "6px",
                                                background: "#fff",
                                                cursor: "pointer",
                                                color: "#6B7280",
                                                display: "flex",
                                            }}
                                        >
                                            <Pencil size={14} />
                                        </button>
                                        <button
                                            onClick={() => confirmDelete(customer)}
                                            disabled={isDeleting}
                                            title="Eliminar"
                                            style={{
                                                padding: "6px",
                                                border: "1px solid #FEE2E2",
                                                borderRadius: "6px",
                                                background: "#FFF5F5",
                                                cursor: "pointer",
                                                color: "#EF4444",
                                                display: "flex",
                                            }}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            {data && data.last_page > 1 && (
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "16px",
                    fontSize: "14px",
                    color: "#6B7280",
                }}>
                    <span>Página {data.current_page} de {data.last_page}</span>
                    <div style={{ display: "flex", gap: "8px" }}>
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={data.current_page === 1}
                            style={{
                                padding: "6px 12px",
                                border: "1px solid #E5E7EB",
                                borderRadius: "6px",
                                background: "#fff",
                                cursor: data.current_page === 1 ? "not-allowed" : "pointer",
                                opacity: data.current_page === 1 ? 0.4 : 1,
                                display: "flex", alignItems: "center", gap: "4px",
                            }}
                        >
                            <ChevronLeft size={14} /> Anterior
                        </button>
                        <button
                            onClick={() => setPage((p) => Math.min(data.last_page, p + 1))}
                            disabled={data.current_page === data.last_page}
                            style={{
                                padding: "6px 12px",
                                border: "1px solid #E5E7EB",
                                borderRadius: "6px",
                                background: "#fff",
                                cursor: data.current_page === data.last_page ? "not-allowed" : "pointer",
                                opacity: data.current_page === data.last_page ? 0.4 : 1,
                                display: "flex", alignItems: "center", gap: "4px",
                            }}
                        >
                            Siguiente <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
