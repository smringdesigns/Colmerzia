import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
    ChevronLeft,
    ChevronRight,
    Pencil,
    Plus,
    Search,
    ShoppingBag,
    Trash2,
} from "lucide-react";

import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import PageHeader from "../components/ui/PageHeader";
import Panel from "../components/ui/Panel";
import { useToast } from "../components/ui/useToast";
import {
    deleteCustomer,
    getCustomers,
    type Customer,
} from "../features/customers/customersApi";

function fullName(customer: Customer) {
    return [customer.first_name, customer.last_name].filter(Boolean).join(" ");
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("es-CO", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default function Customers() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { notify } = useToast();

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
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
        queryKey: ["customers", debouncedSearch, page],
        queryFn: () =>
            getCustomers({
                page,
                per_page: 15,
                search: debouncedSearch || undefined,
            }),
    });

    const { mutate: remove, isPending: isDeleting } = useMutation({
        mutationFn: deleteCustomer,
        onSuccess: () => {
            setCustomerToDelete(null);
            notify({
                message: "El cliente se elimino correctamente.",
                title: "Cliente eliminado",
                tone: "success",
            });
            queryClient.invalidateQueries({ queryKey: ["customers"] });
        },
        onError: () => {
            notify({
                message: "No se pudo eliminar el cliente. Intentalo nuevamente.",
                title: "Error al eliminar",
                tone: "error",
            });
        },
    });

    function confirmDelete() {
        if (customerToDelete) {
            remove(customerToDelete.id);
        }
    }

    return (
        <div className="resource-page">
            <PageHeader
                eyebrow="CRM"
                title="Clientes"
                subtitle={data ? `${data.total} clientes registrados` : "Cargando clientes..."}
                action={
                    <Button type="button" onClick={() => navigate("/customers/new")}>
                        <Plus size={16} />
                        Nuevo cliente
                    </Button>
                }
            />

            <Panel className="resource-toolbar">
                <label className="resource-search">
                    <Search size={17} />
                    <input
                        type="search"
                        placeholder="Buscar por nombre, correo o documento..."
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
                                <th>Cliente</th>
                                <th>Contacto</th>
                                <th>Documento</th>
                                <th>Pedidos</th>
                                <th>Registrado</th>
                                <th>Estado</th>
                                <th aria-label="Acciones" />
                            </tr>
                        </thead>

                        <tbody>
                            {isLoading && (
                                <tr>
                                    <td colSpan={7}>
                                        <div className="empty-state">Cargando clientes...</div>
                                    </td>
                                </tr>
                            )}

                            {isError && (
                                <tr>
                                    <td colSpan={7}>
                                        <div className="empty-state danger">
                                            Error al cargar los clientes. Verifica la conexion con el backend.
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
                                                : "Aun no hay clientes. Crea el primero."}
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {data?.data.map((customer) => (
                                <tr key={customer.id}>
                                    <td>
                                        <div className="primary-cell">
                                            <strong>{fullName(customer)}</strong>
                                            {customer.company && <span>{customer.company}</span>}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="primary-cell">
                                            <strong>{customer.email}</strong>
                                            {customer.phone && <span>{customer.phone}</span>}
                                        </div>
                                    </td>
                                    <td>
                                        {customer.document_type && customer.document_number ? (
                                            <span className="code-pill">
                                                {customer.document_type} {customer.document_number}
                                            </span>
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                    <td>
                                        <span className="orders-count">
                                            <ShoppingBag size={14} />
                                            {customer.orders_count}
                                        </span>
                                    </td>
                                    <td>{formatDate(customer.created_at)}</td>
                                    <td>
                                        <Badge tone={customer.is_active ? "success" : "neutral"}>
                                            {customer.is_active ? "Activo" : "Inactivo"}
                                        </Badge>
                                    </td>
                                    <td>
                                        <div className="actions-cell">
                                            <button
                                                type="button"
                                                title="Editar"
                                                onClick={() => navigate(`/customers/${customer.id}/edit`)}
                                            >
                                                <Pencil size={15} />
                                            </button>
                                            <button
                                                type="button"
                                                title="Eliminar"
                                                disabled={isDeleting}
                                                className="danger"
                                                onClick={() => setCustomerToDelete(customer)}
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
                isOpen={Boolean(customerToDelete)}
                isPending={isDeleting}
                title="Eliminar cliente"
                description={
                    customerToDelete
                        ? `Vas a eliminar a "${fullName(customerToDelete)}". Esta accion no se puede deshacer.`
                        : ""
                }
                onClose={() => setCustomerToDelete(null)}
                onConfirm={confirmDelete}
            />
        </div>
    );
}
