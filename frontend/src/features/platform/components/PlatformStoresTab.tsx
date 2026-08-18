import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    LogIn,
    Search,
    ShoppingBag,
    Store as StoreIcon,
    Trash2,
    Users,
} from "lucide-react";

import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import Panel from "../../../components/ui/Panel";
import { useToast } from "../../../components/ui/useToast";
import {
    deletePlatformStore,
    getPlatformStores,
    openStorefront,
    switchToStore,
    type PlatformStore,
} from "../platformApi";

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("es-CO", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function subscriptionTone(status?: string) {
    switch (status) {
        case "active":
            return "success";
        case "trialing":
            return "purple";
        case "past_due":
        case "canceled":
            return "danger";
        default:
            return "neutral";
    }
}

const BUSINESS_TYPE_LABELS: Record<string, string> = {
    retail: "Retail",
    moda: "Moda",
    tecnologia: "Tecnología",
    restaurante: "Restaurante",
    servicios: "Servicios",
};

export default function PlatformStoresTab() {
    const queryClient = useQueryClient();
    const { notify } = useToast();

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [storeToDelete, setStoreToDelete] = useState<PlatformStore | null>(null);

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
        queryKey: ["platform-stores", debouncedSearch, page],
        queryFn: () =>
            getPlatformStores({
                page,
                per_page: 15,
                search: debouncedSearch || undefined,
            }),
    });

    const { mutate: remove, isPending: isDeleting } = useMutation({
        mutationFn: deletePlatformStore,
        onSuccess: () => {
            setStoreToDelete(null);
            notify({
                title: "Tienda eliminada",
                message: "La tienda y todo lo que le pertenecía se eliminó de forma permanente.",
                tone: "success",
            });
            queryClient.invalidateQueries({ queryKey: ["platform-stores"] });
            queryClient.invalidateQueries({ queryKey: ["platform-users"] });
        },
        onError: (error: any) => {
            notify({
                title: "No se pudo eliminar",
                message:
                    error.response?.data?.message ||
                    "Inténtalo nuevamente en unos segundos.",
                tone: "error",
            });
        },
    });

    function handleEnter(store: PlatformStore) {
        switchToStore(store.subdomain);
    }

    return (
        <div className="settings-tab-content">
            <Panel className="resource-toolbar">
                <label className="resource-search">
                    <Search size={17} />
                    <input
                        type="search"
                        placeholder="Buscar por nombre, subdominio o correo..."
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
                                <th>Tienda</th>
                                <th>Rubro</th>
                                <th>Plan</th>
                                <th>Usuarios</th>
                                <th>Productos</th>
                                <th>Creada</th>
                                <th>Estado</th>
                                <th aria-label="Acciones" />
                            </tr>
                        </thead>

                        <tbody>
                            {isLoading && (
                                <tr>
                                    <td colSpan={8}>
                                        <div className="empty-state">Cargando tiendas...</div>
                                    </td>
                                </tr>
                            )}

                            {isError && (
                                <tr>
                                    <td colSpan={8}>
                                        <div className="empty-state danger">
                                            Error al cargar las tiendas. Verifica la conexión con el backend.
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {!isLoading && data?.data.length === 0 && (
                                <tr>
                                    <td colSpan={8}>
                                        <div className="empty-state">
                                            {debouncedSearch
                                                ? `Sin resultados para "${debouncedSearch}"`
                                                : "Aún no hay tiendas registradas."}
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {data?.data.map((store) => (
                                <tr key={store.id}>
                                    <td>
                                        <div className="primary-cell">
                                            <strong>
                                                <StoreIcon
                                                    size={14}
                                                    style={{ marginRight: 6, verticalAlign: -2 }}
                                                />
                                                {store.name}
                                            </strong>
                                            <span>
                                                {store.subdomain}.colmerzia.com
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        {store.business_type ? (
                                            <Badge tone="neutral">
                                                {BUSINESS_TYPE_LABELS[store.business_type] ??
                                                    store.business_type}
                                            </Badge>
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                    <td>
                                        {store.subscription ? (
                                            <Badge tone={subscriptionTone(store.subscription.status)}>
                                                {store.subscription.plan_slug}
                                            </Badge>
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                    <td>
                                        <span className="orders-count">
                                            <Users size={14} />
                                            {store.users_count ?? 0}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="orders-count">
                                            <ShoppingBag size={14} />
                                            {store.products_count ?? 0}
                                        </span>
                                    </td>
                                    <td>{formatDate(store.created_at)}</td>
                                    <td>
                                        <Badge tone={store.is_active ? "success" : "neutral"}>
                                            {store.is_active ? "Activa" : "Inactiva"}
                                        </Badge>
                                    </td>
                                    <td>
                                        <div className="actions-cell">
                                            <button
                                                type="button"
                                                title="Entrar al panel administrativo"
                                                onClick={() => handleEnter(store)}
                                            >
                                                <LogIn size={15} />
                                            </button>
                                            <button
                                                type="button"
                                                title="Ver tienda pública"
                                                onClick={() => openStorefront(store.subdomain)}
                                            >
                                                <ExternalLink size={15} />
                                            </button>
                                            <button
                                                type="button"
                                                title="Eliminar permanentemente"
                                                disabled={isDeleting}
                                                className="danger"
                                                onClick={() => setStoreToDelete(store)}
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
                            onClick={() =>
                                setPage((current) => Math.min(data.last_page, current + 1))
                            }
                        >
                            Siguiente
                            <ChevronRight size={15} />
                        </Button>
                    </div>
                </div>
            )}

            <ConfirmDialog
                isOpen={Boolean(storeToDelete)}
                isPending={isDeleting}
                title="Eliminar tienda permanentemente"
                confirmLabel="Eliminar para siempre"
                description={`Esto borra "${storeToDelete?.name}" (${storeToDelete?.subdomain}) y TODO lo que le pertenece — usuarios, roles, categorías, productos, configuración y suscripción — de forma DEFINITIVA. Úsalo solo para corregir errores de creación, no para desactivar una tienda real.`}
                onClose={() => setStoreToDelete(null)}
                onConfirm={() => storeToDelete && remove(storeToDelete.id)}
            />
        </div>
    );
}
