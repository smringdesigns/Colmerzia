import { useEffect, useState } from "react";

import Button from "../../components/ui/Button";
import FormModal from "../../components/ui/FormModal";
import TextField from "../../components/ui/TextField";
import type { Brand, BrandPayload } from "./brandsApi";

interface BrandFormModalProps {
    brand: Brand | null;
    isOpen: boolean;
    isSaving: boolean;
    onClose: () => void;
    onSubmit: (payload: BrandPayload) => void;
}

export default function BrandFormModal({
    brand,
    isOpen,
    isSaving,
    onClose,
    onSubmit,
}: BrandFormModalProps) {
    const isEditing = Boolean(brand);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isOpen) return;

        setName(brand?.name ?? "");
        setDescription(brand?.description ?? "");
        setIsActive(brand?.is_active ?? true);
        setError("");
    }, [isOpen, brand]);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        if (!name.trim()) {
            setError("El nombre de la marca es obligatorio.");
            return;
        }

        onSubmit({
            name: name.trim(),
            description: description.trim() || null,
            is_active: isActive,
        });
    }

    return (
        <FormModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? "Editar marca" : "Nueva marca"}
            subtitle={
                isEditing
                    ? "Actualiza los datos de esta marca."
                    : "Agrega una marca para asociarla a tus productos."
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
                        label="Nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej. Samsung, Nike, Genérica..."
                        disabled={isSaving}
                        autoFocus
                        required
                    />

                    <TextField
                        label="Descripción (opcional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Una línea breve sobre esta marca"
                        disabled={isSaving}
                    />

                    <label className="check-row">
                        <input
                            type="checkbox"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            disabled={isSaving}
                        />
                        Activa (visible en tu tienda)
                    </label>
                </div>

                <div className="form-actions">
                    <Button type="button" variant="secondary" onClick={onClose} disabled={isSaving}>
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={isSaving}>
                        {isSaving ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear marca"}
                    </Button>
                </div>
            </form>
        </FormModal>
    );
}
