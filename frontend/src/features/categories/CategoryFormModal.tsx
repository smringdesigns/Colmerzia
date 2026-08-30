import { useEffect, useState } from "react";

import Button from "../../components/ui/Button";
import FormModal from "../../components/ui/FormModal";
import SelectField from "../../components/ui/SelectField";
import TextField from "../../components/ui/TextField";
import type { Category, CategoryPayload } from "./categoriesApi";

interface CategoryFormModalProps {
    category: Category | null;
    categories: Category[];
    isOpen: boolean;
    isSaving: boolean;
    onClose: () => void;
    onSubmit: (payload: CategoryPayload) => void;
}

export default function CategoryFormModal({
    category,
    categories,
    isOpen,
    isSaving,
    onClose,
    onSubmit,
}: CategoryFormModalProps) {
    const isEditing = Boolean(category);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [parentId, setParentId] = useState<string>("");
    const [isActive, setIsActive] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isOpen) return;

        setName(category?.name ?? "");
        setDescription(category?.description ?? "");
        setParentId(category?.parent_id ? String(category.parent_id) : "");
        setIsActive(category?.is_active ?? true);
        setError("");
    }, [isOpen, category]);

    // No podés elegirte a vos misma (al editar) como tu propia
    // categoría padre -- lo mismo que ya valida el backend, pero
    // sacarla de la lista acá evita que el usuario ni lo intente.
    const parentOptions = categories
        .filter((c) => c.id !== category?.id)
        .map((c) => ({ value: String(c.id), label: c.name }));

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        if (!name.trim()) {
            setError("El nombre de la categoría es obligatorio.");
            return;
        }

        onSubmit({
            name: name.trim(),
            description: description.trim() || null,
            parent_id: parentId ? Number(parentId) : null,
            is_active: isActive,
        });
    }

    return (
        <FormModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? "Editar categoría" : "Nueva categoría"}
            subtitle={
                isEditing
                    ? "Actualiza los datos de esta categoría."
                    : "Organiza tu catálogo agregando una nueva categoría."
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
                        placeholder="Ej. Bebidas, Entradas, Cortes de cabello..."
                        disabled={isSaving}
                        autoFocus
                        required
                    />

                    <TextField
                        label="Descripción (opcional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Una línea breve sobre qué agrupa esta categoría"
                        disabled={isSaving}
                    />

                    {parentOptions.length > 0 && (
                        <SelectField
                            label="Categoría padre (opcional)"
                            value={parentId}
                            onChange={(e) => setParentId(e.target.value)}
                            options={parentOptions}
                            placeholder="Sin categoría padre"
                            disabled={isSaving}
                        />
                    )}

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
                        {isSaving ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear categoría"}
                    </Button>
                </div>
            </form>
        </FormModal>
    );
}
