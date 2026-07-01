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
    createCustomer,
    getCustomer,
    updateCustomer,
    type CustomerPayload,
} from "../features/customers/customersApi";

const schema = z.object({
    birth_date: z.string().optional(),
    company: z.string().optional(),
    document_number: z.string().optional(),
    document_type: z.enum(["CC", "CE", "NIT", "PPN", "TI", ""]).optional(),
    email: z.string().min(1, "El correo es obligatorio").email("Correo invalido"),
    first_name: z.string().min(1, "El nombre es obligatorio"),
    is_active: z.boolean().optional(),
    last_name: z.string().optional(),
    notes: z.string().optional(),
    phone: z.string().optional(),
});

type CustomerFormData = z.infer<typeof schema>;

function cleanCustomerPayload(data: CustomerFormData): CustomerPayload {
    return {
        birth_date: data.birth_date || undefined,
        company: data.company || undefined,
        document_number: data.document_number || undefined,
        document_type: data.document_type || undefined,
        email: data.email,
        first_name: data.first_name,
        is_active: data.is_active,
        last_name: data.last_name || undefined,
        notes: data.notes || undefined,
        phone: data.phone || undefined,
    };
}

export default function CustomerForm() {
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
    } = useForm<CustomerFormData>({
        defaultValues: { is_active: true },
        resolver: zodResolver(schema),
    });

    const { data: customer, isLoading } = useQuery({
        enabled: isEditing,
        queryFn: () => getCustomer(Number(id)),
        queryKey: ["customer", id],
    });

    useEffect(() => {
        if (!customer) return;

        reset({
            birth_date: customer.birth_date ?? "",
            company: customer.company ?? "",
            document_number: customer.document_number ?? "",
            document_type: (customer.document_type as CustomerFormData["document_type"]) ?? "",
            email: customer.email,
            first_name: customer.first_name,
            is_active: customer.is_active,
            last_name: customer.last_name ?? "",
            notes: customer.notes ?? "",
            phone: customer.phone ?? "",
        });
    }, [customer, reset]);

    const { mutateAsync: create } = useMutation({
        mutationFn: createCustomer,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customers"] }),
    });

    const { mutateAsync: update } = useMutation({
        mutationFn: ({ data, id }: { data: CustomerPayload; id: number }) =>
            updateCustomer(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers"] });
            queryClient.invalidateQueries({ queryKey: ["customer", id] });
        },
    });

    async function onSubmit(data: CustomerFormData) {
        const payload = cleanCustomerPayload(data);

        try {
            if (isEditing) {
                await update({ data: payload, id: Number(id) });
            } else {
                await create(payload);
            }

            notify({
                message: isEditing
                    ? "Los cambios del cliente se guardaron correctamente."
                    : "El cliente fue creado correctamente.",
                title: isEditing ? "Cliente actualizado" : "Cliente creado",
                tone: "success",
            });
            navigate("/customers");
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
        return <div className="empty-state">Cargando cliente...</div>;
    }

    return (
        <div className="form-page">
            <PageHeader
                eyebrow="CRM"
                title={isEditing ? "Editar cliente" : "Nuevo cliente"}
                subtitle={
                    isEditing
                        ? `Editando: ${customer?.first_name ?? ""} ${customer?.last_name ?? ""}`
                        : "Completa los datos principales del cliente."
                }
                action={
                    <Button type="button" variant="secondary" onClick={() => navigate("/customers")}>
                        <ArrowLeft size={16} />
                        Volver
                    </Button>
                }
            />

            <form className="stack-form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <Panel className="form-section">
                    <div className="form-section-heading">
                        <h2>Informacion personal</h2>
                        <p>Datos de contacto y perfil comercial.</p>
                    </div>

                    <div className="form-grid two">
                        <TextField
                            error={errors.first_name?.message}
                            label="Nombre *"
                            placeholder="Ej: Maria"
                            {...register("first_name")}
                        />
                        <TextField
                            error={errors.last_name?.message}
                            label="Apellido"
                            placeholder="Ej: Garcia"
                            {...register("last_name")}
                        />
                    </div>

                    <TextField
                        error={errors.email?.message}
                        label="Correo electronico *"
                        placeholder="cliente@correo.com"
                        type="email"
                        {...register("email")}
                    />

                    <div className="form-grid two">
                        <TextField label="Telefono" placeholder="3001234567" {...register("phone")} />
                        <TextField label="Empresa" placeholder="Nombre de la empresa" {...register("company")} />
                    </div>

                    <TextField label="Fecha de nacimiento" type="date" {...register("birth_date")} />
                </Panel>

                <Panel className="form-section">
                    <div className="form-section-heading">
                        <h2>Documento de identidad</h2>
                        <p>Ingrese su documento de identidad o NIT.</p>
                    </div>

                    <div className="form-grid document">
                        <label className="ui-field">
                            <span>Tipo</span>
                            <select className="ui-select" {...register("document_type")}>
                                <option value="">Selecciona</option>
                                <option value="CC">Cedula (CC)</option>
                                <option value="CE">Cedula extranjeria (CE)</option>
                                <option value="NIT">NIT</option>
                                <option value="PPN">Pasaporte (PPN)</option>
                                <option value="TI">Tarjeta identidad (TI)</option>
                            </select>
                        </label>
                        <TextField
                            label="Numero"
                            placeholder="Numero de documento"
                            {...register("document_number")}
                        />
                    </div>
                </Panel>

                <Panel className="form-section">
                    <div className="form-section-heading">
                        <h2>Notas y opciones</h2>
                        <p>Observaciones internas y estado del cliente.</p>
                    </div>

                    <label className="ui-field">
                        <span>Notas internas</span>
                        <textarea
                            className="ui-textarea"
                            rows={3}
                            placeholder="Observaciones visibles solo para el equipo..."
                            {...register("notes")}
                        />
                    </label>

                    <label className="check-row">
                        <input type="checkbox" {...register("is_active")} />
                        <span>Cliente activo</span>
                    </label>
                </Panel>

                <div className="form-actions">
                    <Button type="button" variant="secondary" onClick={() => navigate("/customers")}>
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        <Save size={16} />
                        {isSubmitting
                            ? "Guardando..."
                            : isEditing
                              ? "Guardar cambios"
                              : "Crear cliente"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
