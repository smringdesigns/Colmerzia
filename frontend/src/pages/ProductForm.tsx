import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import {
    getProduct,
    createProduct,
    updateProduct,
} from "../features/products/services/productsApi";

// Schema

const schema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),

    sku: z.string().min(1, "El SKU es obligatorio"),

    price: z.coerce
        .number()
        .min(0, "No puede ser negativo"),

    compare_price: z.coerce
        .number()
        .nullable()
        .optional(),

    cost_price: z.coerce
        .number()
        .nullable()
        .optional(),

    stock: z.coerce
        .number()
        .int()
        .min(0)
        .optional(),

    short_description: z.string()
        .max(500)
        .optional(),

    description: z.string()
        .optional(),

    featured: z.boolean()
        .optional(),

    is_active: z.boolean()
        .optional(),
});

type ProductFormInput = z.input<typeof schema>;
export type ProductFormData = z.output<typeof schema>;

// Helpers UI

function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div style={{ marginBottom: "20px" }}>
            <label style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "6px",
            }}>
                {label}
            </label>
            {children}
            {error && (
                <p style={{ color: "#EF4444", fontSize: "12px", marginTop: "5px" }}>
                    {error}
                </p>
            )}
        </div>
    );
}

const inputStyle = (hasError?: boolean): React.CSSProperties => ({
    width: "100%",
    padding: "10px 14px",
    fontSize: "14px",
    border: `1.5px solid ${hasError ? "#EF4444" : "#E5E7EB"}`,
    borderRadius: "8px",
    outline: "none",
    color: "#0F1117",
    background: "#FAFAFA",
    boxSizing: "border-box",
});

// Componente

export default function ProductForm() {
    const { id }      = useParams<{ id: string }>();
    const isEditing   = Boolean(id);
    const navigate    = useNavigate();
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ProductFormInput, unknown, ProductFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            is_active: true,
            featured:  false,
            stock:     0,
        },
    });

    // Carga el producto si estamos editando
    const { data: product, isLoading } = useQuery({
        queryKey: ["product", id],
        queryFn:  () => getProduct(Number(id)),
        enabled:  isEditing,
    });

    // Cuando llegan los datos del producto, rellena el form
    useEffect(() => {
        if (product) {
            reset({
                name:              product.name,
                sku:               product.sku,
                price:             Number(product.price),
                compare_price:     product.compare_price ? Number(product.compare_price) : null,
                cost_price:        product.cost_price    ? Number(product.cost_price)    : null,
                stock:             product.stock,
                short_description: product.short_description ?? "",
                description:       product.description       ?? "",
                featured:          product.featured,
                is_active:         product.is_active,
            });
        }
    }, [product, reset]);

    const { mutateAsync: create } = useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });

    const { mutateAsync: update } = useMutation({
        mutationFn: ({ id, data }: { id: number; data: ProductFormData }) =>
            updateProduct(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["product", id] });
        },
    });

    async function onSubmit(data: ProductFormData) {
        try {
            if (isEditing) {
                await update({ id: Number(id), data });
            } else {
                await create(data);
            }
            navigate("/products");
        } catch (err: unknown) {
            // Errores de validación del servidor (422)
            const error = err as { response?: { data?: { errors?: Record<string, string[]> } } };
            const serverErrors = error?.response?.data?.errors;
            if (serverErrors) {
                console.error("Errores del servidor:", serverErrors);
            }
        }
    }

    if (isEditing && isLoading) {
        return (
            <div style={{ padding: "40px", color: "#9CA3AF", fontFamily: "'Inter', system-ui, sans-serif" }}>
                Cargando producto...
            </div>
        );
    }

    return (
        <div style={{ fontFamily: "'Inter', system-ui, sans-serif", maxWidth: "720px" }}>

            {/* Encabezado */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
                <button
                    onClick={() => navigate("/products")}
                    style={{
                        padding: "8px",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                        background: "#fff",
                        cursor: "pointer",
                        display: "flex",
                        color: "#6B7280",
                    }}
                >
                    <ArrowLeft size={16} />
                </button>
                <div>
                    <h1 style={{
                        fontSize: "22px",
                        fontWeight: "700",
                        color: "#0F1117",
                        letterSpacing: "-0.5px",
                        margin: 0,
                    }}>
                        {isEditing ? "Editar producto" : "Nuevo producto"}
                    </h1>
                    <p style={{ color: "#6B7280", fontSize: "14px", margin: "4px 0 0" }}>
                        {isEditing ? `Editando: ${product?.name}` : "Completa los datos del producto"}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>

                {/* Sección: Información básica */}
                <section style={{
                    background: "#fff",
                    border: "1px solid #E5E7EB",
                    borderRadius: "12px",
                    padding: "24px",
                    marginBottom: "20px",
                }}>
                    <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#0F1117", marginBottom: "20px", marginTop: 0 }}>
                        Información básica
                    </h2>

                    <Field label="Nombre *" error={errors.name?.message}>
                        <input
                            {...register("name")}
                            placeholder="Ej: Camiseta manga corta negra"
                            style={inputStyle(!!errors.name)}
                        />
                    </Field>

                    <Field label="SKU *" error={errors.sku?.message}>
                        <input
                            {...register("sku")}
                            placeholder="Ej: CAM-001-NEG"
                            style={inputStyle(!!errors.sku)}
                        />
                    </Field>

                    <Field label="Descripción corta" error={errors.short_description?.message}>
                        <input
                            {...register("short_description")}
                            placeholder="Máximo 500 caracteres"
                            style={inputStyle(!!errors.short_description)}
                        />
                    </Field>

                    <Field label="Descripción completa">
                        <textarea
                            {...register("description")}
                            rows={4}
                            placeholder="Descripción detallada del producto..."
                            style={{
                                ...inputStyle(),
                                resize: "vertical",
                                fontFamily: "inherit",
                            }}
                        />
                    </Field>
                </section>

                {/* Sección: Precios */}
                <section style={{
                    background: "#fff",
                    border: "1px solid #E5E7EB",
                    borderRadius: "12px",
                    padding: "24px",
                    marginBottom: "20px",
                }}>
                    <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#0F1117", marginBottom: "20px", marginTop: 0 }}>
                        Precios e inventario
                    </h2>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                        <Field label="Precio de venta *" error={errors.price?.message}>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                {...register("price")}
                                placeholder="0"
                                style={inputStyle(!!errors.price)}
                            />
                        </Field>

                        <Field label="Precio comparado" error={errors.compare_price?.message}>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                {...register("compare_price")}
                                placeholder="0"
                                style={inputStyle(!!errors.compare_price)}
                            />
                        </Field>

                        <Field label="Costo" error={errors.cost_price?.message}>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                {...register("cost_price")}
                                placeholder="0"
                                style={inputStyle(!!errors.cost_price)}
                            />
                        </Field>
                    </div>

                    <Field label="Stock" error={errors.stock?.message}>
                        <input
                            type="number"
                            min="0"
                            {...register("stock")}
                            placeholder="0"
                            style={{ ...inputStyle(!!errors.stock), maxWidth: "160px" }}
                        />
                    </Field>
                </section>

                {/* Sección: Opciones */}
                <section style={{
                    background: "#fff",
                    border: "1px solid #E5E7EB",
                    borderRadius: "12px",
                    padding: "24px",
                    marginBottom: "28px",
                }}>
                    <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#0F1117", marginBottom: "20px", marginTop: 0 }}>
                        Opciones
                    </h2>

                    <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", marginBottom: "12px" }}>
                        <input type="checkbox" {...register("is_active")} />
                        <span style={{ fontSize: "14px", color: "#374151" }}>Producto activo (visible en tienda)</span>
                    </label>

                    <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                        <input type="checkbox" {...register("featured")} />
                        <span style={{ fontSize: "14px", color: "#374151" }}>Destacar en portada</span>
                    </label>
                </section>

                {/* Acciones */}
                <div style={{ display: "flex", gap: "12px" }}>
                    <button
                        type="button"
                        onClick={() => navigate("/products")}
                        style={{
                            padding: "10px 20px",
                            border: "1.5px solid #E5E7EB",
                            borderRadius: "8px",
                            background: "#fff",
                            fontSize: "14px",
                            fontWeight: "500",
                            cursor: "pointer",
                            color: "#374151",
                        }}
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{
                            padding: "10px 24px",
                            background: isSubmitting ? "#818CF8" : "#6366F1",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "14px",
                            fontWeight: "600",
                            cursor: isSubmitting ? "not-allowed" : "pointer",
                        }}
                    >
                        {isSubmitting
                            ? "Guardando..."
                            : isEditing ? "Guardar cambios" : "Crear producto"}
                    </button>
                </div>
            </form>
        </div>
    );
}
