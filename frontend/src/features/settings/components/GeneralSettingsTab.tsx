import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Save } from "lucide-react";

import Button from "../../../components/ui/Button";
import Panel from "../../../components/ui/Panel";
import TextField from "../../../components/ui/TextField";
import { useToast } from "../../../components/ui/useToast";
import {
    getMyStore,
    updateStoreSettings,
    type UpdateStoreSettingsPayload,
} from "../../stores/storeApi";

const TIMEZONES = [
    "America/Bogota",
    "America/Mexico_City",
    "America/Lima",
    "America/Santiago",
    "America/Buenos_Aires",
    "America/New_York",
    "UTC",
];

const CURRENCIES = ["COP", "USD", "MXN", "PEN", "CLP", "ARS", "EUR"];

export default function GeneralSettingsTab() {
    const queryClient = useQueryClient();
    const { notify } = useToast();

    const { data, isLoading, isError } = useQuery({
        queryKey: ["settings", "store"],
        queryFn: getMyStore,
    });

    const [form, setForm] = useState<UpdateStoreSettingsPayload>({
        name: "",
        contact_email: "",
        contact_phone: "",
        currency: "COP",
        timezone: "America/Bogota",
    });

    // Sincroniza el formulario cuando llegan los datos del servidor.
    useEffect(() => {
        if (!data?.data) return;

        const store = data.data;

        setForm({
            name: store.name ?? "",
            contact_email: store.settings?.contact_email ?? "",
            contact_phone: store.settings?.contact_phone ?? "",
            currency: store.settings?.currency ?? "COP",
            timezone: store.settings?.timezone ?? "America/Bogota",
        });
    }, [data]);

    const { mutate: save, isPending } = useMutation({
        mutationFn: updateStoreSettings,
        onSuccess: () => {
            notify({
                title: "Configuración guardada",
                message: "Los datos de tu tienda se actualizaron correctamente.",
                tone: "success",
            });
            queryClient.invalidateQueries({ queryKey: ["settings", "store"] });
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

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        save(form);
    }

    if (isLoading) {
        return (
            <Panel className="table-panel">
                <div className="empty-state">Cargando configuración...</div>
            </Panel>
        );
    }

    if (isError) {
        return (
            <Panel className="table-panel">
                <div className="empty-state danger">
                    No se pudo cargar la configuración de la tienda.
                </div>
            </Panel>
        );
    }

    return (
        <Panel>
            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                    <TextField
                        label="Nombre de la tienda"
                        value={form.name ?? ""}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        required
                    />

                    <TextField
                        label="Correo de contacto"
                        type="email"
                        placeholder="contacto@tutienda.com"
                        value={form.contact_email ?? ""}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, contact_email: e.target.value }))
                        }
                    />

                    <TextField
                        label="Teléfono de contacto"
                        placeholder="+57 300 000 0000"
                        value={form.contact_phone ?? ""}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, contact_phone: e.target.value }))
                        }
                    />

                    <label className="ui-field">
                        <span>Moneda</span>
                        <div className="ui-input-wrap">
                            <select
                                className="ui-input"
                                value={form.currency}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, currency: e.target.value }))
                                }
                            >
                                {CURRENCIES.map((currency) => (
                                    <option key={currency} value={currency}>
                                        {currency}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </label>

                    <label className="ui-field">
                        <span>Zona horaria</span>
                        <div className="ui-input-wrap">
                            <select
                                className="ui-input"
                                value={form.timezone}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, timezone: e.target.value }))
                                }
                            >
                                {TIMEZONES.map((tz) => (
                                    <option key={tz} value={tz}>
                                        {tz}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </label>
                </div>

                <div className="form-actions">
                    <Button type="submit" disabled={isPending}>
                        <Save size={16} />
                        {isPending ? "Guardando..." : "Guardar cambios"}
                    </Button>
                </div>
            </form>
        </Panel>
    );
}
