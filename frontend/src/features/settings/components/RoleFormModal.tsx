import { useEffect, useState } from "react";

import Button from "../../../components/ui/Button";
import FormModal from "../../../components/ui/FormModal";
import TextField from "../../../components/ui/TextField";
import type { GroupedPermissions, Role, RolePayload } from "../../roles/rolesApi";

interface RoleFormModalProps {
    groupedPermissions: GroupedPermissions;
    isOpen: boolean;
    isSaving: boolean;
    onClose: () => void;
    onSubmit: (payload: RolePayload) => void;
    role: Role | null;
}

// Le da un nombre legible en español a cada módulo de permisos.
const MODULE_LABELS: Record<string, string> = {
    products: "Productos",
    customers: "Clientes",
    orders: "Pedidos",
    warehouses: "Bodegas",
    inventory: "Inventario",
    settings: "Configuración",
    users: "Usuarios",
    roles: "Roles",
};

export default function RoleFormModal({
    groupedPermissions,
    isOpen,
    isSaving,
    onClose,
    onSubmit,
    role,
}: RoleFormModalProps) {
    const isEditing = Boolean(role);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [permissionIds, setPermissionIds] = useState<number[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isOpen) return;

        setName(role?.name ?? "");
        setDescription(role?.description ?? "");
        setPermissionIds(role?.permissions.map((p) => p.id) ?? []);
        setError("");
    }, [isOpen, role]);

    function togglePermission(permissionId: number) {
        setPermissionIds((current) =>
            current.includes(permissionId)
                ? current.filter((id) => id !== permissionId)
                : [...current, permissionId]
        );
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        if (!name.trim()) {
            setError("El nombre del rol es obligatorio.");
            return;
        }

        onSubmit({
            name: name.trim(),
            description: description.trim() || null,
            permission_ids: permissionIds,
        });
    }

    return (
        <FormModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? "Editar rol" : "Nuevo rol"}
            subtitle="Define qué puede hacer este rol dentro del panel."
        >
            <form onSubmit={handleSubmit}>
                {error && (
                    <div className="auth-error" role="alert">
                        {error}
                    </div>
                )}

                <div className="form-grid single">
                    <TextField
                        label="Nombre del rol"
                        placeholder="Ej. Encargado de bodega"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isSaving}
                        required
                    />

                    <TextField
                        label="Descripción (opcional)"
                        placeholder="Para qué sirve este rol"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={isSaving}
                    />

                    <div>
                        <span className="ui-field-label">Permisos</span>

                        <div className="permission-groups" style={{ marginTop: 8 }}>
                            {Object.entries(groupedPermissions).map(([module, permissions]) => (
                                <div key={module} className="permission-group">
                                    <h4>{MODULE_LABELS[module] ?? module}</h4>
                                    <div className="permission-group-items">
                                        {permissions.map((permission) => (
                                            <label key={permission.id} className="check-row">
                                                <input
                                                    type="checkbox"
                                                    checked={permissionIds.includes(permission.id)}
                                                    onChange={() => togglePermission(permission.id)}
                                                    disabled={isSaving}
                                                />
                                                {permission.name}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <Button type="button" variant="secondary" onClick={onClose} disabled={isSaving}>
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={isSaving}>
                        {isSaving ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear rol"}
                    </Button>
                </div>
            </form>
        </FormModal>
    );
}
