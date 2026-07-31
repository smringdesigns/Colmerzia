import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";

import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import Panel from "../components/ui/Panel";
import TextField from "../components/ui/TextField";
import { useToast } from "../components/ui/useToast";
import {
    createProduct,
    getProduct,
    updateProduct,
} from "../features/products/services/productsApi";

const schema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    sku: z.string().min(1, "El SKU es obligatorio"),
    price: z.coerce.number().min(0, "No puede ser negativo"),
    compare_price: z.coerce.number().nullable().optional(),
    cost_price: z.coerce.number().nullable().optional(),
    stock: z.coerce.number().int().min(0).optional(),
    short_description: z.string().max(500).optional(),
    description: z.string().optional(),
    featured: z.boolean().optional(),
    is_active: z.boolean().optional(),
});

type ProductFormInput = z.input<typeof schema>;
export type ProductFormData = z.output<typeof schema>;

export default function ProductForm() {
    const { id } = useParams<{ id: string }>();
    const isEditing = Boolean(id);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { notify } = useToast();

    const {
        formState: { errors, isSubmitting },
        handleSubmit,
        register,
        reset,
    } = useForm<ProductFormInput, unknown, ProductFormData>({
        defaultValues: {
            featured: false,
            is_active: true,
            stock: 0,
        },
        resolver: zodResolver(schema),
    });

    const { data: product, isLoading } = useQuery({
        enabled: isEditing,
        queryFn: () => getProduct(Number(id)),
        queryKey: ["product", id],
    });

    useEffect(() => {
        if (!product) return;

        reset({
            compare_price: product.compare_price ? Number(product.compare_price) : null,
            cost_price: product.cost_price ? Number(product.cost_price) : null,
            description: product.description ?? "",
            featured: product.featured,
            is_active: product.is_active,
            name: product.name,
            price: Number(product.price),
            short_description: product.short_description ?? "",
            sku: product.sku,
            stock: product.stock,
        });
    }, [product, reset]);

    const { mutateAsync: create } = useMutation({
        mutationFn: createProduct,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
    });

    const { mutateAsync: update } = useMutation({
        mutationFn: ({ data, id }: { data: ProductFormData; id: number }) =>
            updateProduct(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["product", id] });
        },
    });

    async function onSubmit(data: ProductFormData) {
        try {
            if (isEditing) {
                await update({ data, id: Number(id) });
            } else {
                await create(data);
            }

            notify({
                message: isEditing
                    ? "Los cambios del producto se guardaron correctamente."
                    : "El producto fue creado correctamente.",
                title: isEditing ? "Producto actualizado" : "Producto creado",
                tone: "success",
            });
            navigate("/products");
        } catch (err: unknown) {
            const error = err as { response?: { data?: { errors?: Record<string, string[]> } } };
            console.error("Errores del servidor:", error?.response?.data?.errors);
            notify({
                message: "Revisa los datos e intentalo nuevamente.",
                title: "No se pudo guardar",
                tone: "error",
            });
        }
    }

    if (isEditing && isLoading) {
        return <div className="empty-state">Cargando producto...</div>;
    }

    return (
        <div className="form-page">
            <PageHeader
                eyebrow="Catalog"
                title={isEditing ? "Editar producto" : "Nuevo producto"}
                subtitle={
                    isEditing
                        ? `Editando: ${product?.name ?? ""}`
                        : "Completa los datos principales del producto."
                }
                action={
                    <Button type="button" variant="secondary" onClick={() => navigate("/products")}>
                        <ArrowLeft size={16} />
                        Volver
                    </Button>
                }
            />

            <form className="stack-form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <Panel className="form-section">
                    <div className="form-section-heading">
                        <h2>Informacion basica</h2>
                        <p>Nombre, SKU y descripcion comercial.</p>
                    </div>

                    <div className="form-grid two">
                        <TextField
                            error={errors.name?.message}
                            label="Nombre *"
                            placeholder="Ej: Camiseta manga corta negra"
                            {...register("name")}
                        />
                        <TextField
                            error={errors.sku?.message}
                            label="SKU *"
                            placeholder="Ej: CAM-001-NEG"
                            {...register("sku")}
                        />
                    </div>

                    <TextField
                        error={errors.short_description?.message}
                        label="Descripcion corta"
                        placeholder="Maximo 500 caracteres"
                        {...register("short_description")}
                    />

                    <label className="ui-field">
                        <span>Descripcion completa</span>
                        <textarea
                            className="ui-textarea"
                            rows={4}
                            placeholder="Descripcion detallada del producto..."
                            {...register("description")}
                        />
                    </label>
                </Panel>

                <Panel className="form-section">
                    <div className="form-section-heading">
                        <h2>Precios e inventario</h2>
                        <p>Valores de venta, costo y disponibilidad.</p>
                    </div>

                    <div className="form-grid three">
                        <TextField
                            error={errors.price?.message}
                            label="Precio de venta *"
                            min="0"
                            placeholder="0"
                            step="0.01"
                            type="number"
                            {...register("price")}
                        />
                        <TextField
                            error={errors.compare_price?.message}
                            label="Precio comparado"
                            min="0"
                            placeholder="0"
                            step="0.01"
                            type="number"
                            {...register("compare_price")}
                        />
                        <TextField
                            error={errors.cost_price?.message}
                            label="Costo"
                            min="0"
                            placeholder="0"
                            step="0.01"
                            type="number"
                            {...register("cost_price")}
                        />
                    </div>

                    <TextField
                        error={errors.stock?.message}
                        label="Stock"
                        min="0"
                        placeholder="0"
                        type="number"
                        {...register("stock")}
                    />
                </Panel>

                <Panel className="form-section">
                    <div className="form-section-heading">
                        <h2>Opciones</h2>
                        <p>Visibilidad del producto y presencia en portada.</p>
                    </div>

                    <div className="check-list">
                        <label className="check-row">
                            <input type="checkbox" {...register("is_active")} />
                            <span>Producto activo visible en tienda</span>
                        </label>
                        <label className="check-row">
                            <input type="checkbox" {...register("featured")} />
                            <span>Destacar en portada</span>
                        </label>
                    </div>
                </Panel>

                <div className="form-actions">
                    <Button type="button" variant="secondary" onClick={() => navigate("/products")}>
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        <Save size={16} />
                        {isSubmitting
                            ? "Guardando..."
                            : isEditing
                              ? "Guardar cambios"
                              : "Crear producto"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
