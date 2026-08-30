import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FolderTree, Pencil, Plus, Trash2 } from "lucide-react";

import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import PageHeader from "../components/ui/PageHeader";
import Panel from "../components/ui/Panel";
import { useToast } from "../components/ui/useToast";
import {
    createCategory,
    deleteCategory,
    getCategories,
    updateCategory,
    type Category,
    type CategoryPayload,
} from "../features/categories/categoriesApi";
import CategoryFormModal from "../features/categories/CategoryFormModal";

export default function Categories() {
    const queryClient = useQueryClient();
    const { notify } = useToast();

    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

    const { data: categories, isLoading, isError } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    });

    const { mutate: save, isPending: isSaving } = useMutation({
        mutationFn: (payload: CategoryPayload) =>
            editingCategory
                ? updateCategory(editingCategory.id, payload)
                : createCategory(payload),
        onSuccess: () => {
            setIsFormOpen(false);
            setEditingCategory(null);
            notify({
                title: editingCategory ? "Categoría actualizada" : "Categoría creada",
                message: "Los cambios se guardaron correctamente.",
                tone: "success",
            });
            queryClient.invalidateQueries({ queryKey: ["categories"] });
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
        mutationFn: deleteCategory,
        onSuccess: () => {
            setCategoryToDelete(null);
            notify({
                title: "Categoría eliminada",
                message: "La categoría se eliminó correctamente.",
                tone: "success",
            });
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
        onError: (error: any) => {
            notify({
                title: "No se pudo eliminar",
                message:
                    error.response?.data?.message ||
                    "Reasigná los productos de esta categoría antes de eliminarla.",
                tone: "error",
            });
        },
    });

    function openCreate() {
        setEditingCategory(null);
        setIsFormOpen(true);
    }

    function openEdit(category: Category) {
        setEditingCategory(category);
        setIsFormOpen(true);
    }

    return (
        <div className="resource-page">
            <PageHeader
                eyebrow="Catálogo"
                title="Categorías"
                subtitle="Organizá tus productos en categorías para que tu tienda y tus informes tengan sentido."
                action={
                    <Button type="button" onClick={openCreate}>
                        <Plus size={16} />
                        Nueva categoría
                    </Button>
                }
            />

            <Panel className="table-panel">
                <div className="windmill-table-wrap">
                    <table className="windmill-table">
                        <thead>
                            <tr>
                                <th>Categoría</th>
                                <th>Categoría padre</th>
                                <th>Productos</th>
                                <th>Estado</th>
                                <th aria-label="Acciones" />
                            </tr>
                        </thead>

                        <tbody>
                            {isLoading && (
                                <tr>
                                    <td colSpan={5}>
                                        <div className="empty-state">Cargando categorías...</div>
                                    </td>
                                </tr>
                            )}

                            {isError && (
                                <tr>
                                    <td colSpan={5}>
                                        <div className="empty-state danger">
                                            Error al cargar las categorías.
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {!isLoading && categories?.length === 0 && (
                                <tr>
                                    <td colSpan={5}>
                                        <div className="empty-state">
                                            Todavía no tenés categorías. Creá la primera para
                                            empezar a organizar tu catálogo.
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {categories?.map((category) => (
                                <tr key={category.id}>
                                    <td>
                                        <div className="primary-cell">
                                            <strong>{category.name}</strong>
                                            {category.description && (
                                                <span>{category.description}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        {category.parent ? (
                                            <span className="orders-count">
                                                <FolderTree size={14} />
                                                {category.parent.name}
                                            </span>
                                        ) : (
                                            "—"
                                        )}
                                    </td>
                                    <td>{category.products_count ?? 0}</td>
                                    <td>
                                        <Badge tone={category.is_active ? "success" : "neutral"}>
                                            {category.is_active ? "Activa" : "Inactiva"}
                                        </Badge>
                                    </td>
                                    <td>
                                        <div className="actions-cell">
                                            <button
                                                type="button"
                                                title="Editar"
                                                onClick={() => openEdit(category)}
                                            >
                                                <Pencil size={15} />
                                            </button>
                                            <button
                                                type="button"
                                                title={
                                                    (category.products_count ?? 0) > 0
                                                        ? "Tiene productos asignados"
                                                        : "Eliminar"
                                                }
                                                disabled={
                                                    isDeleting ||
                                                    (category.products_count ?? 0) > 0
                                                }
                                                className="danger"
                                                onClick={() => setCategoryToDelete(category)}
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

            <CategoryFormModal
                category={editingCategory}
                categories={categories ?? []}
                isOpen={isFormOpen}
                isSaving={isSaving}
                onClose={() => setIsFormOpen(false)}
                onSubmit={(payload) => save(payload)}
            />

            <ConfirmDialog
                isOpen={Boolean(categoryToDelete)}
                isPending={isDeleting}
                title="Eliminar categoría"
                description={`¿Seguro que querés eliminar la categoría "${categoryToDelete?.name}"?`}
                onClose={() => setCategoryToDelete(null)}
                onConfirm={() => categoryToDelete && remove(categoryToDelete.id)}
            />
        </div>
    );
}
