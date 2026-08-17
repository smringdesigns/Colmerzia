import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Lock, Pencil, Plus, Trash2, Users as UsersIcon } from "lucide-react";

import Button from "../../../components/ui/Button";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import Panel from "../../../components/ui/Panel";
import { useToast } from "../../../components/ui/useToast";
import {
    createRole,
    deleteRole,
    getPermissions,
    getRoles,
    updateRole,
    type Role,
    type RolePayload,
} from "../../roles/rolesApi";
import RoleFormModal from "./RoleFormModal";

export default function RolesTab() {
    const queryClient = useQueryClient();
    const { notify } = useToast();

    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

    const { data: roles, isLoading, isError } = useQuery({
        queryKey: ["roles"],
        queryFn: getRoles,
    });

    const { data: groupedPermissions } = useQuery({
        queryKey: ["permissions"],
        queryFn: getPermissions,
    });

    const { mutate: save, isPending: isSaving } = useMutation({
        mutationFn: (payload: RolePayload) =>
            editingRole ? updateRole(editingRole.id, payload) : createRole(payload),
        onSuccess: () => {
            setIsFormOpen(false);
            setEditingRole(null);
            notify({
                title: editingRole ? "Rol actualizado" : "Rol creado",
                message: "Los cambios se guardaron correctamente.",
                tone: "success",
            });
            queryClient.invalidateQueries({ queryKey: ["roles"] });
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
        mutationFn: deleteRole,
        onSuccess: () => {
            setRoleToDelete(null);
            notify({
                title: "Rol eliminado",
                message: "El rol se eliminó correctamente.",
                tone: "success",
            });
            queryClient.invalidateQueries({ queryKey: ["roles"] });
        },
        onError: (error: any) => {
            notify({
                title: "No se pudo eliminar",
                message:
                    error.response?.data?.message ||
                    "Reasigna a los usuarios de este rol antes de eliminarlo.",
                tone: "error",
            });
        },
    });

    function openCreate() {
        setEditingRole(null);
        setIsFormOpen(true);
    }

    function openEdit(role: Role) {
        setEditingRole(role);
        setIsFormOpen(true);
    }

    return (
        <div className="settings-tab-content">
            <Panel className="resource-toolbar">
                <p style={{ color: "#6b7280", fontSize: 13.5, margin: 0 }}>
                    Los roles del sistema (marcados con <Lock size={12} style={{ verticalAlign: -1 }} />)
                    no se pueden editar ni eliminar.
                </p>

                <Button type="button" onClick={openCreate}>
                    <Plus size={16} />
                    Nuevo rol
                </Button>
            </Panel>

            <Panel className="table-panel">
                <div className="windmill-table-wrap">
                    <table className="windmill-table">
                        <thead>
                            <tr>
                                <th>Rol</th>
                                <th>Permisos</th>
                                <th>Usuarios</th>
                                <th aria-label="Acciones" />
                            </tr>
                        </thead>

                        <tbody>
                            {isLoading && (
                                <tr>
                                    <td colSpan={4}>
                                        <div className="empty-state">Cargando roles...</div>
                                    </td>
                                </tr>
                            )}

                            {isError && (
                                <tr>
                                    <td colSpan={4}>
                                        <div className="empty-state danger">
                                            Error al cargar los roles.
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {roles?.map((role) => (
                                <tr key={role.id}>
                                    <td>
                                        <div className="primary-cell">
                                            <strong className="role-meta-row">
                                                {role.name}
                                                {role.is_system && <Lock size={13} />}
                                            </strong>
                                            {role.description && <span>{role.description}</span>}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="code-pill">
                                            {role.permissions.length} permiso
                                            {role.permissions.length === 1 ? "" : "s"}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="orders-count">
                                            <UsersIcon size={14} />
                                            {role.users_count ?? 0}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="actions-cell">
                                            <button
                                                type="button"
                                                title={role.is_system ? "No editable" : "Editar"}
                                                disabled={role.is_system}
                                                onClick={() => openEdit(role)}
                                            >
                                                <Pencil size={15} />
                                            </button>
                                            <button
                                                type="button"
                                                title={role.is_system ? "No editable" : "Eliminar"}
                                                disabled={
                                                    role.is_system ||
                                                    isDeleting ||
                                                    (role.users_count ?? 0) > 0
                                                }
                                                className="danger"
                                                onClick={() => setRoleToDelete(role)}
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

            <RoleFormModal
                groupedPermissions={groupedPermissions ?? {}}
                isOpen={isFormOpen}
                isSaving={isSaving}
                onClose={() => setIsFormOpen(false)}
                onSubmit={(payload) => save(payload)}
                role={editingRole}
            />

            <ConfirmDialog
                isOpen={Boolean(roleToDelete)}
                isPending={isDeleting}
                title="Eliminar rol"
                description={`¿Seguro que quieres eliminar el rol "${roleToDelete?.name}"?`}
                onClose={() => setRoleToDelete(null)}
                onConfirm={() => roleToDelete && remove(roleToDelete.id)}
            />
        </div>
    );
}
