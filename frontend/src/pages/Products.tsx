import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Pencil, Plus, Search, Trash2 } from "lucide-react";

import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import PageHeader from "../components/ui/PageHeader";
import Panel from "../components/ui/Panel";
import { useToast } from "../components/ui/useToast";
import {
    deleteProduct,
    getProducts,
    type Product,
} from "../features/products/services/productsApi";

function formatPrice(value: string | null) {
    if (!value) return "-";

    return new Intl.NumberFormat("es-CO", {
        currency: "COP",
        minimumFractionDigits: 0,
        style: "currency",
    }).format(Number(value));
}

export default function Products() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { notify } = useToast();

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
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
        queryKey: ["products", debouncedSearch, page],
        queryFn: () =>
            getProducts({
                page,
                per_page: 15,
                search: debouncedSearch || undefined,
            }),
    });

    const { mutate: remove, isPending: isDeleting } = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            setProductToDelete(null);
            notify({
                message: "El producto se elimino correctamente.",
                title: "Producto eliminado",
                tone: "success",
            });
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
        onError: () => {
            notify({
                message: "No se pudo eliminar el producto. Intentalo nuevamente.",
                title: "Error al eliminar",
                tone: "error",
            });
        },
    });

    function confirmDelete() {
        if (productToDelete) {
            remove(productToDelete.id);
        }
    }

    return (
        <div className="resource-page">
            <PageHeader
                eyebrow="Catalog"
                title="Productos"
                subtitle={data ? `${data.total} productos en total` : "Cargando inventario..."}
                action={
                    <Button type="button" onClick={() => navigate("/products/new")}>
                        <Plus size={16} />
                        Nuevo producto
                    </Button>
                }
            />

            <Panel className="resource-toolbar">
                <label className="resource-search">
                    <Search size={17} />
                    <input
                        type="search"
                        placeholder="Buscar por nombre o SKU..."
                        value={search}
                        onChange={(event) => handleSearch(event.target.value)}
                    />
                </label>
            </Panel>

            <Panel className="table-panel">
                <div className="windmill-table-wrap">
                    <table className="windmill-table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>SKU</th>
                                <th>Categoria</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Estado</th>
                                <th aria-label="Acciones" />
                            </tr>
                        </thead>

                        <tbody>
                            {isLoading && (
                                <tr>
                                    <td colSpan={7}>
                                        <div className="empty-state">Cargando productos...</div>
                                    </td>
                                </tr>
                            )}

                            {isError && (
                                <tr>
                                    <td colSpan={7}>
                                        <div className="empty-state danger">
                                            Error al cargar los productos. Verifica la conexion con el backend.
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {!isLoading && data?.data.length === 0 && (
                                <tr>
                                    <td colSpan={7}>
                                        <div className="empty-state">
                                            {debouncedSearch
                                                ? `Sin resultados para "${debouncedSearch}"`
                                                : "Aun no hay productos. Crea el primero."}
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {data?.data.map((product) => (
                                <tr key={product.id}>
                                    <td>
                                        <div className="primary-cell">
                                            <strong>{product.name}</strong>
                                            {product.short_description && (
                                                <span>{product.short_description}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="code-pill">{product.sku}</span>
                                    </td>
                                    <td>{product.category?.name ?? "-"}</td>
                                    <td>
                                        <div className="price-cell">
                                            <strong>{formatPrice(product.price)}</strong>
                                            {product.compare_price && (
                                                <span>{formatPrice(product.compare_price)}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={product.stock === 0 ? "stock-alert" : ""}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td>
                                        <Badge tone={product.is_active ? "success" : "neutral"}>
                                            {product.is_active ? "Activo" : "Inactivo"}
                                        </Badge>
                                    </td>
                                    <td>
                                        <div className="actions-cell">
                                            <button
                                                type="button"
                                                title="Editar"
                                                onClick={() => navigate(`/products/${product.id}/edit`)}
                                            >
                                                <Pencil size={15} />
                                            </button>
                                            <button
                                                type="button"
                                                title="Eliminar"
                                                disabled={isDeleting}
                                                className="danger"
                                                onClick={() => setProductToDelete(product)}
                                            >
                                                <Trash2 size={15} />
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
                        Pagina {data.current_page} de {data.last_page}
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

            <ConfirmDialog
                isOpen={Boolean(productToDelete)}
                isPending={isDeleting}
                title="Eliminar producto"
                description={
                    productToDelete
                        ? `Vas a eliminar "${productToDelete.name}". Esta accion no se puede deshacer.`
                        : ""
                }
                onClose={() => setProductToDelete(null)}
                onConfirm={confirmDelete}
            />
        </div>
    );
}
