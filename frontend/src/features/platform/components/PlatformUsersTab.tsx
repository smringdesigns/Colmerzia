import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Search, Trash2 } from "lucide-react";

import Badge from "../../../components/ui/Badge";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import Panel from "../../../components/ui/Panel";
import { useToast } from "../../../components/ui/useToast";
import { useAuthStore } from "../../../store/authStore";
import {
    deletePlatformUser,
    getPlatformUsers,
    type PlatformUser,
} from "../platformApi";

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("es-CO", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default function PlatformUsersTab() {
    const queryClient = useQueryClient();
    const { notify } = useToast();
    const currentUser = useAuthStore((state) => state.user);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [userToDelete, setUserToDelete] = useState<PlatformUser | null>(null);

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
        queryKey: ["platform-users", debouncedSearch, page],
        queryFn: () =>
            getPlatformUsers({
                page,
                per_page: 15,
                search: debouncedSearch || undefined,
            }),
    });

    const { mutate: remove, isPending: isDeleting } = useMutation({
        mutationFn: deletePlatformUser,
        onSuccess: () => {
            setUserToDelete(null);
            notify({
                title: "Usuario eliminado",
                message: "El usuario se eliminó de forma permanente. Su correo ya está libre para reutilizarse.",
                tone: "success",
            });
            queryClient.invalidateQueries({ queryKey: ["platform-users"] });
            queryClient.invalidateQueries({ queryKey: ["platform-stores"] });
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

    return (
        <div className="settings-tab-content">
            <Panel className="resource-toolbar">
                <label className="resource-search">
                    <Search size={17} />
                    <input
                        type="search"
                        placeholder="Buscar por nombre o correo..."
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
                                <th>Usuario</th>
                                <th>Tienda</th>
                                <th>Roles</th>
                                <th>Registrado</th>
                                <th>Estado</th>
                                <th aria-label="Acciones" />
                            </tr>
                        </thead>

                        <tbody>
                            {isLoading && (
                                <tr>
                                    <td colSpan={6}>
                                        <div className="empty-state">Cargando usuarios...</div>
                                    </td>
                                </tr>
                            )}

                            {isError && (
                                <tr>
                                    <td colSpan={6}>
                                        <div className="empty-state danger">
                                            Error al cargar los usuarios.
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {!isLoading && data?.data.length === 0 && (
                                <tr>
                                    <td colSpan={6}>
                                        <div className="empty-state">
                                            {debouncedSearch
                                                ? `Sin resultados para "${debouncedSearch}"`
                                                : "Aún no hay usuarios registrados."}
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {data?.data.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        <div className="primary-cell">
                                            <strong>{user.name}</strong>
                                            <span>{user.email}</span>
                                        </div>
                                    </td>
                                    <td>
                                        {user.store ? (
                                            <div className="primary-cell">
                                                <strong>{user.store.name}</strong>
                                                <span>{user.store.subdomain}</span>
                                            </div>
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                    <td>
                                        <div className="role-meta-row">
                                            {user.roles.length === 0 && (
                                                <span className="ui-badge neutral">Sin rol</span>
                                            )}
                                            {user.roles.map((role) => (
                                                <Badge key={role.id} tone="purple">
                                                    {role.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </td>
                                    <td>{formatDate(user.created_at)}</td>
                                    <td>
                                        <Badge tone={user.is_active ? "success" : "neutral"}>
                                            {user.is_active ? "Activo" : "Inactivo"}
                                        </Badge>
                                    </td>
                                    <td>
                                        <div className="actions-cell">
                                            <button
                                                type="button"
                                                title="Eliminar permanentemente"
                                                disabled={isDeleting || user.id === currentUser?.id}
                                                className="danger"
                                                onClick={() => setUserToDelete(user)}
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
                        <button
                            type="button"
                            disabled={data.current_page === 1}
                            onClick={() => setPage((current) => Math.max(1, current - 1))}
                        >
                            <ChevronLeft size={15} />
                            Anterior
                        </button>
                        <button
                            type="button"
                            disabled={data.current_page === data.last_page}
                            onClick={() =>
                                setPage((current) => Math.min(data.last_page, current + 1))
                            }
                        >
                            Siguiente
                            <ChevronRight size={15} />
                        </button>
                    </div>
                </div>
            )}

            <ConfirmDialog
                isOpen={Boolean(userToDelete)}
                isPending={isDeleting}
                title="Eliminar usuario permanentemente"
                confirmLabel="Eliminar para siempre"
                description={`Esto borra a "${userToDelete?.name}" (${userToDelete?.email}) de forma DEFINITIVA, sin posibilidad de recuperarlo — a diferencia del borrado normal, esto libera su correo para reutilizarlo. Úsalo solo para corregir errores, no como borrado de rutina.`}
                onClose={() => setUserToDelete(null)}
                onConfirm={() => userToDelete && remove(userToDelete.id)}
            />
        </div>
    );
}
