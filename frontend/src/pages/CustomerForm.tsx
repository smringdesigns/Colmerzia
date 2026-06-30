import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import {
    getCustomer,
    createCustomer,
    updateCustomer,
} from "../features/customers/customersApi";

// Schema

const schema = z.object({
    first_name:      z.string().min(1, "El nombre es obligatorio"),
    last_name:       z.string().optional(),
    email:           z.string().min(1, "El correo es obligatorio").email("Correo inválido"),
    phone:           z.string().optional(),
    document_type:   z.enum(["CC", "CE", "NIT", "PPN", "TI", ""]).optional(),
    document_number: z.string().optional(),
    company:         z.string().optional(),
    birth_date:      z.string().optional(),
    notes:           z.string().optional(),
    is_active:       z.boolean().optional(),
});

type CustomerFormData = z.infer<typeof schema>;

// UI helpers

function Field({ label, error, children }: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div style={{ marginBottom: "20px" }}>
            <label style={{
                display: "block", fontSize: "13px",
                fontWeight: "500", color: "#374151", marginBottom: "6px",
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

export default function CustomerForm() {
    const { id }      = useParams<{ id: string }>();
    const isEditing   = Boolean(id);
    const navigate    = useNavigate();
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CustomerFormData>({
        resolver: zodResolver(schema),
        defaultValues: { is_active: true },
    });

    const { data: customer, isLoading } = useQuery({
        queryKey: ["customer", id],
        queryFn:  () => getCustomer(Number(id)),
        enabled:  isEditing,
    });

    useEffect(() => {
        if (customer) {
            reset({
                first_name:      customer.first_name,
                last_name:       customer.last_name       ?? "",
                email:           customer.email,
                phone:           customer.phone           ?? "",
                document_type:   (customer.document_type as CustomerFormData["document_type"]) ?? "",
                document_number: customer.document_number ?? "",
                company:         customer.company         ?? "",
                birth_date:      customer.birth_date      ?? "",
                notes:           customer.notes           ?? "",
                is_active:       customer.is_active,
            });
        }
    }, [customer, reset]);

    const { mutateAsync: create } = useMutation({
        mutationFn: createCustomer,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customers"] }),
    });

    const { mutateAsync: update } = useMutation({
        mutationFn: ({ id, data }: { id: number; data: CustomerFormData }) =>
            updateCustomer(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers"] });
            queryClient.invalidateQueries({ queryKey: ["customer", id] });
        },
    });

    async function onSubmit(data: CustomerFormData) {
        try {
            if (isEditing) {
                await update({ id: Number(id), data });
            } else {
                await create(data);
            }
            navigate("/customers");
        } catch (err: unknown) {
            const error = err as { response?: { data?: { errors?: Record<string, string[]> } } };
            console.error("Errores del servidor:", error?.response?.data?.errors);
        }
    }

    if (isEditing && isLoading) {
        return (
            <div style={{ padding: "40px", color: "#9CA3AF", fontFamily: "'Inter', system-ui, sans-serif" }}>
                Cargando cliente...
            </div>
        );
    }

    return (
        <div style={{ fontFamily: "'Inter', system-ui, sans-serif", maxWidth: "720px" }}>

            {/* Encabezado */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
                <button
                    onClick={() => navigate("/customers")}
                    style={{
                        padding: "8px", border: "1px solid #E5E7EB", borderRadius: "8px",
                        background: "#fff", cursor: "pointer", display: "flex", color: "#6B7280",
                    }}
                >
                    <ArrowLeft size={16} />
                </button>
                <div>
                    <h1 style={{
                        fontSize: "22px", fontWeight: "700", color: "#0F1117",
                        letterSpacing: "-0.5px", margin: 0,
                    }}>
                        {isEditing ? "Editar cliente" : "Nuevo cliente"}
                    </h1>
                    <p style={{ color: "#6B7280", fontSize: "14px", margin: "4px 0 0" }}>
                        {isEditing
                            ? `Editando: ${customer?.first_name} ${customer?.last_name ?? ""}`
                            : "Completa los datos del cliente"}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>

                {/* Información personal */}
                <section style={{
                    background: "#fff", border: "1px solid #E5E7EB",
                    borderRadius: "12px", padding: "24px", marginBottom: "20px",
                }}>
                    <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#0F1117", marginBottom: "20px", marginTop: 0 }}>
                        Información personal
                    </h2>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <Field label="Nombre *" error={errors.first_name?.message}>
                            <input {...register("first_name")} placeholder="Ej: María" style={inputStyle(!!errors.first_name)} />
                        </Field>
                        <Field label="Apellido" error={errors.last_name?.message}>
                            <input {...register("last_name")} placeholder="Ej: García" style={inputStyle(!!errors.last_name)} />
                        </Field>
                    </div>

                    <Field label="Correo electrónico *" error={errors.email?.message}>
                        <input type="email" {...register("email")} placeholder="cliente@correo.com" style={inputStyle(!!errors.email)} />
                    </Field>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <Field label="Teléfono">
                            <input {...register("phone")} placeholder="3001234567" style={inputStyle()} />
                        </Field>
                        <Field label="Empresa">
                            <input {...register("company")} placeholder="Nombre de la empresa" style={inputStyle()} />
                        </Field>
                    </div>

                    <Field label="Fecha de nacimiento">
                        <input type="date" {...register("birth_date")} style={inputStyle()} />
                    </Field>
                </section>

                {/* Documento */}
                <section style={{
                    background: "#fff", border: "1px solid #E5E7EB",
                    borderRadius: "12px", padding: "24px", marginBottom: "20px",
                }}>
                    <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#0F1117", marginBottom: "20px", marginTop: 0 }}>
                        Documento de identidad
                    </h2>

                    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "16px" }}>
                        <Field label="Tipo">
                            <select {...register("document_type")} style={{ ...inputStyle(), cursor: "pointer" }}>
                                <option value="">— Selecciona —</option>
                                <option value="CC">Cédula (CC)</option>
                                <option value="CE">Cédula extranjería (CE)</option>
                                <option value="NIT">NIT</option>
                                <option value="PPN">Pasaporte (PPN)</option>
                                <option value="TI">Tarjeta identidad (TI)</option>
                            </select>
                        </Field>
                        <Field label="Número">
                            <input {...register("document_number")} placeholder="Número de documento" style={inputStyle()} />
                        </Field>
                    </div>
                </section>

                {/* Notas y opciones */}
                <section style={{
                    background: "#fff", border: "1px solid #E5E7EB",
                    borderRadius: "12px", padding: "24px", marginBottom: "28px",
                }}>
                    <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#0F1117", marginBottom: "20px", marginTop: 0 }}>
                        Notas y opciones
                    </h2>

                    <Field label="Notas internas">
                        <textarea
                            {...register("notes")}
                            rows={3}
                            placeholder="Observaciones visibles solo para el equipo..."
                            style={{ ...inputStyle(), resize: "vertical", fontFamily: "inherit" }}
                        />
                    </Field>

                    <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                        <input type="checkbox" {...register("is_active")} />
                        <span style={{ fontSize: "14px", color: "#374151" }}>Cliente activo</span>
                    </label>
                </section>

                {/* Acciones */}
                <div style={{ display: "flex", gap: "12px" }}>
                    <button
                        type="button"
                        onClick={() => navigate("/customers")}
                        style={{
                            padding: "10px 20px", border: "1.5px solid #E5E7EB", borderRadius: "8px",
                            background: "#fff", fontSize: "14px", fontWeight: "500",
                            cursor: "pointer", color: "#374151",
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
                            color: "#fff", border: "none", borderRadius: "8px",
                            fontSize: "14px", fontWeight: "600",
                            cursor: isSubmitting ? "not-allowed" : "pointer",
                        }}
                    >
                        {isSubmitting
                            ? "Guardando..."
                            : isEditing ? "Guardar cambios" : "Crear cliente"}
                    </button>
                </div>
            </form>
        </div>
    );
}
