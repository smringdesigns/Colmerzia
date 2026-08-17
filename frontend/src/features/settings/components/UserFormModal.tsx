import { useEffect, useState } from "react";

import Button from "../../../components/ui/Button";
import FormModal from "../../../components/ui/FormModal";
import TextField from "../../../components/ui/TextField";
import type { RoleSummary } from "../../roles/rolesApi";
import type { StaffUser, UserPayload } from "../../users/usersApi";

interface UserFormModalProps {
    availableRoles: RoleSummary[];
    isOpen: boolean;
    isSaving: boolean;
    onClose: () => void;
    onSubmit: (payload: UserPayload) => void;
    user: StaffUser | null;
}

export default function UserFormModal({
    availableRoles,
    isOpen,
    isSaving,
    onClose,
    onSubmit,
    user,
}: UserFormModalProps) {
    const isEditing = Boolean(user);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [roleIds, setRoleIds] = useState<number[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isOpen) return;

        setName(user?.name ?? "");
        setEmail(user?.email ?? "");
        setPassword("");
        setPasswordConfirmation("");
        setIsActive(user?.is_active ?? true);
        setRoleIds(user?.roles.map((role) => role.id) ?? []);
        setError("");
    }, [isOpen, user]);

    function toggleRole(roleId: number) {
        setRoleIds((current) =>
            current.includes(roleId)
                ? current.filter((id) => id !== roleId)
                : [...current, roleId]
        );
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        if (!isEditing && (!password || password.length < 8)) {
            setError("La contraseña debe tener al menos 8 caracteres.");
            return;
        }

        if (password && password !== passwordConfirmation) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        const payload: UserPayload = {
            name,
            email,
            is_active: isActive,
            role_ids: roleIds,
        };

        if (password) {
            payload.password = password;
            payload.password_confirmation = passwordConfirmation;
        }

        onSubmit(payload);
    }

    return (
        <FormModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? "Editar usuario" : "Nuevo usuario"}
            subtitle={
                isEditing
                    ? "Actualiza los datos y roles de este miembro del equipo."
                    : "Invita a un nuevo miembro a tu equipo y asígnale un rol."
            }
        >
            <form onSubmit={handleSubmit}>
                {error && (
                    <div className="auth-error" role="alert">
                        {error}
                    </div>
                )}

                <div className="form-grid single">
                    <TextField
                        label="Nombre completo"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isSaving}
                        required
                    />

                    <TextField
                        label="Correo electrónico"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isSaving}
                        required
                    />

                    <div className="form-grid">
                        <TextField
                            label={isEditing ? "Nueva contraseña (opcional)" : "Contraseña"}
                            type="password"
                            placeholder="Mínimo 8 caracteres"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isSaving}
                            required={!isEditing}
                        />

                        <TextField
                            label="Confirmar contraseña"
                            type="password"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            disabled={isSaving}
                            required={!isEditing || password.length > 0}
                        />
                    </div>

                    <div>
                        <span className="ui-field-label">Roles</span>
                        <div className="permission-group-items" style={{ marginTop: 8 }}>
                            {availableRoles.map((role) => (
                                <label key={role.id} className="check-row">
                                    <input
                                        type="checkbox"
                                        checked={roleIds.includes(role.id)}
                                        onChange={() => toggleRole(role.id)}
                                        disabled={isSaving}
                                    />
                                    {role.name}
                                </label>
                            ))}
                        </div>
                    </div>

                    <label className="check-row">
                        <input
                            type="checkbox"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            disabled={isSaving}
                        />
                        Usuario activo
                    </label>
                </div>

                <div className="form-actions">
                    <Button type="button" variant="secondary" onClick={onClose} disabled={isSaving}>
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={isSaving}>
                        {isSaving ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear usuario"}
                    </Button>
                </div>
            </form>
        </FormModal>
    );
}
