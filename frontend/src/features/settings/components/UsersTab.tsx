import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Pencil, Plus, Search, Trash2 } from "lucide-react";

import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import Panel from "../../../components/ui/Panel";
import { useToast } from "../../../components/ui/useToast";
import { useAuthStore } from "../../../store/authStore";
import { getRoles } from "../../roles/rolesApi";
import {
    createUser,
    deleteUser,
    getUsers,
    updateUser,
    type StaffUser,
    type UserPayload,
} from "../../users/usersApi";
import UserFormModal from "./UserFormModal";

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("es-CO", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default function UsersTab() {
    const queryClient = useQueryClient();
    const { notify } = useToast();
    const currentUser = useAuthStore((state) => state.user);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [editingUser, setEditingUser] = useState<StaffUser | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<StaffUser | null>(null);

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
        queryKey: ["users", debouncedSearch, page],
        queryFn: () =>
            getUsers({ page, per_page: 15, search: debouncedSearch || undefined }),
    });

    const { data: roles } = useQuery({
        queryKey: ["roles"],
        queryFn: getRoles,
    });

    const { mutate: save, isPending: isSaving } = useMutation({
        mutationFn: (payload: UserPayload) =>
            editingUser ? updateUser(editingUser.id, payload) : createUser(payload),
        onSuccess: () => {
            setIsFormOpen(false);
            setEditingUser(null);
            notify({
                title: editingUser ? "Usuario actualizado" : "Usuario creado",
                message: editingUser
                    ? "Los cambios se guardaron correctamente."
                    : "El nuevo miembro del equipo ya puede iniciar sesión.",
                tone: "success",
            });
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error: any) => {
            notify({
                title: "No se pudo guardar",
                message:
                    error.response?.data?.message ||
                    "Revisa los datos ingresados e intenta nuevamente.",
                tone: "error",
            });
        },
    });

    const { mutate: remove, isPending: isDeleting } = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            setUserToDelete(null);
            notify({
                title: "Usuario eliminado",
                message: "El usuario se eliminó correctamente.",
                tone: "success",
            });
            queryClient.invalidateQueries({ queryKey: ["users"] });
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

    function openCreate() {
        setEditingUser(null);
        setIsFormOpen(true);
    }

    function openEdit(user: StaffUser) {
        setEditingUser(user);
        setIsFormOpen(true);
    }

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

                <Button type="button" onClick={openCreate}>
                    <Plus size={16} />
                    Nuevo usuario
                </Button>
            </Panel>

            <Panel className="table-panel">
                <div className="windmill-table-wrap">
                    <table className="windmill-table">
                        <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>Roles</th>
                                <th>Registrado</th>
                                <th>Estado</th>
                                <th aria-label="Acciones" />
                            </tr>
                        </thead>

                        <tbody>
                            {isLoading && (
                                <tr>
                                    <td colSpan={5}>
                                        <div className="empty-state">Cargando usuarios...</div>
                                    </td>
                                </tr>
                            )}

                            {isError && (
                                <tr>
                                    <td colSpan={5}>
                                        <div className="empty-state danger">
                                            Error al cargar los usuarios.
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {!isLoading && data?.data.length === 0 && (
                                <tr>
                                    <td colSpan={5}>
                                        <div className="empty-state">
                                            {debouncedSearch
                                                ? `Sin resultados para "${debouncedSearch}"`
                                                : "Aún no hay usuarios adicionales en tu equipo."}
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
                                                title="Editar"
                                                onClick={() => openEdit(user)}
                                            >
                                                <Pencil size={15} />
                                            </button>
                                            <button
                                                type="button"
                                                title="Eliminar"
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

            <UserFormModal
                availableRoles={roles ?? []}
                isOpen={isFormOpen}
                isSaving={isSaving}
                onClose={() => setIsFormOpen(false)}
                onSubmit={(payload) => save(payload)}
                user={editingUser}
            />

            <ConfirmDialog
                isOpen={Boolean(userToDelete)}
                isPending={isDeleting}
                title="Eliminar usuario"
                description={`¿Seguro que quieres eliminar a "${userToDelete?.name}"? Perderá acceso al panel de inmediato.`}
                onClose={() => setUserToDelete(null)}
                onConfirm={() => userToDelete && remove(userToDelete.id)}
            />
        </div>
    );
}
