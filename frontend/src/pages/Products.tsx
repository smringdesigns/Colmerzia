import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import {
    getProducts,
    deleteProduct,
    type Product,
} from "../features/products/services/productsApi";

// ── Helpers ───────────────────────────────────────────────

function formatPrice(value: string | null) {
    if (!value) return "—";
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
    }).format(Number(value));
}

// ── Componente ────────────────────────────────────────────

export default function Products() {
    const navigate     = useNavigate();
    const queryClient  = useQueryClient();

    const [search,  setSearch]  = useState("");
    const [page,    setPage]    = useState(1);

    // Búsqueda con debounce manual (500ms)
    const [debouncedSearch, setDebouncedSearch] = useState("");
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
        queryKey: ["products", debouncedSearch, page],
        queryFn: () => getProducts({
            search: debouncedSearch || undefined,
            page,
            per_page: 15,
        }),
    });

    const { mutate: remove, isPending: isDeleting } = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });

    function confirmDelete(product: Product) {
        if (confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) {
            remove(product.id);
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
                        Productos
                    </h1>
                    <p style={{ color: "#6B7280", fontSize: "14px", margin: "4px 0 0" }}>
                        {data ? `${data.total} productos en total` : "Cargando..."}
                    </p>
                </div>

                <button
                    onClick={() => navigate("/products/new")}
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
                    Nuevo producto
                </button>
            </div>

            {/* Barra de búsqueda */}
            <div style={{
                position: "relative",
                marginBottom: "20px",
                maxWidth: "360px",
            }}>
                <Search
                    size={16}
                    style={{
                        position: "absolute",
                        left: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#9CA3AF",
                    }}
                />
                <input
                    type="text"
                    placeholder="Buscar por nombre o SKU..."
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
                            {["Producto", "SKU", "Categoría", "Precio", "Stock", "Estado", ""].map((h) => (
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
                                    Cargando productos...
                                </td>
                            </tr>
                        )}

                        {isError && (
                            <tr>
                                <td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#EF4444" }}>
                                    Error al cargar los productos. Verifica la conexión con el backend.
                                </td>
                            </tr>
                        )}

                        {!isLoading && data?.data.length === 0 && (
                            <tr>
                                <td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#9CA3AF" }}>
                                    {debouncedSearch
                                        ? `Sin resultados para "${debouncedSearch}"`
                                        : "Aún no hay productos. Crea el primero."}
                                </td>
                            </tr>
                        )}

                        {data?.data.map((product, i) => (
                            <tr
                                key={product.id}
                                style={{
                                    borderBottom: i < data.data.length - 1
                                        ? "1px solid #F3F4F6"
                                        : "none",
                                }}
                            >
                                {/* Nombre */}
                                <td style={{ padding: "14px 16px" }}>
                                    <div style={{
                                        fontWeight: "500",
                                        color: "#0F1117",
                                        fontSize: "14px",
                                    }}>
                                        {product.name}
                                    </div>
                                    {product.short_description && (
                                        <div style={{
                                            color: "#9CA3AF",
                                            fontSize: "12px",
                                            marginTop: "2px",
                                            maxWidth: "240px",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}>
                                            {product.short_description}
                                        </div>
                                    )}
                                </td>

                                {/* SKU */}
                                <td style={{ padding: "14px 16px" }}>
                                    <span style={{
                                        fontFamily: "monospace",
                                        fontSize: "13px",
                                        color: "#6B7280",
                                        background: "#F3F4F6",
                                        padding: "2px 8px",
                                        borderRadius: "4px",
                                    }}>
                                        {product.sku}
                                    </span>
                                </td>

                                {/* Categoría */}
                                <td style={{ padding: "14px 16px", fontSize: "14px", color: "#6B7280" }}>
                                    {product.category?.name ?? "—"}
                                </td>

                                {/* Precio */}
                                <td style={{ padding: "14px 16px" }}>
                                    <div style={{ fontWeight: "600", fontSize: "14px", color: "#0F1117" }}>
                                        {formatPrice(product.price)}
                                    </div>
                                    {product.compare_price && (
                                        <div style={{
                                            fontSize: "12px",
                                            color: "#9CA3AF",
                                            textDecoration: "line-through",
                                        }}>
                                            {formatPrice(product.compare_price)}
                                        </div>
                                    )}
                                </td>

                                {/* Stock */}
                                <td style={{ padding: "14px 16px" }}>
                                    <span style={{
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        color: product.stock === 0 ? "#EF4444" : "#0F1117",
                                    }}>
                                        {product.stock}
                                    </span>
                                </td>

                                {/* Estado */}
                                <td style={{ padding: "14px 16px" }}>
                                    <span style={{
                                        display: "inline-block",
                                        padding: "3px 10px",
                                        borderRadius: "999px",
                                        fontSize: "12px",
                                        fontWeight: "500",
                                        background: product.is_active ? "#D1FAE5" : "#F3F4F6",
                                        color:      product.is_active ? "#065F46" : "#6B7280",
                                    }}>
                                        {product.is_active ? "Activo" : "Inactivo"}
                                    </span>
                                </td>

                                {/* Acciones */}
                                <td style={{ padding: "14px 16px" }}>
                                    <div style={{ display: "flex", gap: "8px" }}>
                                        <button
                                            onClick={() => navigate(`/products/${product.id}/edit`)}
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
                                            onClick={() => confirmDelete(product)}
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
                    <span>
                        Página {data.current_page} de {data.last_page}
                    </span>
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
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
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
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
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
