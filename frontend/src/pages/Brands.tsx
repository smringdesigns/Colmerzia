import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";

import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import PageHeader from "../components/ui/PageHeader";
import Panel from "../components/ui/Panel";
import { useToast } from "../components/ui/useToast";
import {
    createBrand,
    deleteBrand,
    getBrands,
    updateBrand,
    type Brand,
    type BrandPayload,
} from "../features/brands/brandsApi";
import BrandFormModal from "../features/brands/BrandFormModal";

export default function Brands() {
    const queryClient = useQueryClient();
    const { notify } = useToast();

    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);

    const { data: brands, isLoading, isError } = useQuery({
        queryKey: ["brands"],
        queryFn: getBrands,
    });

    const { mutate: save, isPending: isSaving } = useMutation({
        mutationFn: (payload: BrandPayload) =>
            editingBrand ? updateBrand(editingBrand.id, payload) : createBrand(payload),
        onSuccess: () => {
            setIsFormOpen(false);
            setEditingBrand(null);
            notify({
                title: editingBrand ? "Marca actualizada" : "Marca creada",
                message: "Los cambios se guardaron correctamente.",
                tone: "success",
            });
            queryClient.invalidateQueries({ queryKey: ["brands"] });
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
        mutationFn: deleteBrand,
        onSuccess: () => {
            setBrandToDelete(null);
            notify({
                title: "Marca eliminada",
                message: "La marca se eliminó correctamente.",
                tone: "success",
            });
            queryClient.invalidateQueries({ queryKey: ["brands"] });
        },
        onError: (error: any) => {
            notify({
                title: "No se pudo eliminar",
                message:
                    error.response?.data?.message ||
                    "Reasigná los productos de esta marca antes de eliminarla.",
                tone: "error",
            });
        },
    });

    function openCreate() {
        setEditingBrand(null);
        setIsFormOpen(true);
    }

    function openEdit(brand: Brand) {
        setEditingBrand(brand);
        setIsFormOpen(true);
    }

    return (
        <div className="resource-page">
            <PageHeader
                eyebrow="Catálogo"
                title="Marcas"
                subtitle="Administrá las marcas que podés asignarle a tus productos."
                action={
                    <Button type="button" onClick={openCreate}>
                        <Plus size={16} />
                        Nueva marca
                    </Button>
                }
            />

            <Panel className="table-panel">
                <div className="windmill-table-wrap">
                    <table className="windmill-table">
                        <thead>
                            <tr>
                                <th>Marca</th>
                                <th>Productos</th>
                                <th>Estado</th>
                                <th aria-label="Acciones" />
                            </tr>
                        </thead>

                        <tbody>
                            {isLoading && (
                                <tr>
                                    <td colSpan={4}>
                                        <div className="empty-state">Cargando marcas...</div>
                                    </td>
                                </tr>
                            )}

                            {isError && (
                                <tr>
                                    <td colSpan={4}>
                                        <div className="empty-state danger">
                                            Error al cargar las marcas.
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {!isLoading && brands?.length === 0 && (
                                <tr>
                                    <td colSpan={4}>
                                        <div className="empty-state">
                                            Todavía no tenés marcas cargadas.
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {brands?.map((brand) => (
                                <tr key={brand.id}>
                                    <td>
                                        <div className="primary-cell">
                                            <strong>{brand.name}</strong>
                                            {brand.description && (
                                                <span>{brand.description}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td>{brand.products_count ?? 0}</td>
                                    <td>
                                        <Badge tone={brand.is_active ? "success" : "neutral"}>
                                            {brand.is_active ? "Activa" : "Inactiva"}
                                        </Badge>
                                    </td>
                                    <td>
                                        <div className="actions-cell">
                                            <button
                                                type="button"
                                                title="Editar"
                                                onClick={() => openEdit(brand)}
                                            >
                                                <Pencil size={15} />
                                            </button>
                                            <button
                                                type="button"
                                                title={
                                                    (brand.products_count ?? 0) > 0
                                                        ? "Tiene productos asignados"
                                                        : "Eliminar"
                                                }
                                                disabled={
                                                    isDeleting || (brand.products_count ?? 0) > 0
                                                }
                                                className="danger"
                                                onClick={() => setBrandToDelete(brand)}
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

            <BrandFormModal
                brand={editingBrand}
                isOpen={isFormOpen}
                isSaving={isSaving}
                onClose={() => setIsFormOpen(false)}
                onSubmit={(payload) => save(payload)}
            />

            <ConfirmDialog
                isOpen={Boolean(brandToDelete)}
                isPending={isDeleting}
                title="Eliminar marca"
                description={`¿Seguro que querés eliminar la marca "${brandToDelete?.name}"?`}
                onClose={() => setBrandToDelete(null)}
                onConfirm={() => brandToDelete && remove(brandToDelete.id)}
            />
        </div>
    );
}
