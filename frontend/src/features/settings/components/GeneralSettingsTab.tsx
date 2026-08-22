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
        social_links: {
            facebook: "",
            instagram: "",
            tiktok: "",
            youtube: "",
        },
    });

    // =========================================================
    // SINCRONIZAR FORMULARIO CON LOS DATOS DE LA TIENDA
    // =========================================================

    useEffect(() => {
        if (!data?.data) return;

        const store = data.data;

        setForm({
            name: store.name ?? "",
            contact_email: store.settings?.contact_email ?? "",
            contact_phone: store.settings?.contact_phone ?? "",
            currency: store.settings?.currency ?? "COP",
            timezone:
                store.settings?.timezone ?? "America/Bogota",

            social_links: {
                facebook:
                    store.settings?.social_links?.facebook ?? "",
                instagram:
                    store.settings?.social_links?.instagram ?? "",
                tiktok:
                    store.settings?.social_links?.tiktok ?? "",
                youtube:
                    store.settings?.social_links?.youtube ?? "",
            },
        });
    }, [data]);

    // =========================================================
    // GUARDAR CONFIGURACIÓN
    // =========================================================

    const { mutate: save, isPending } = useMutation({
        mutationFn: updateStoreSettings,

        onSuccess: () => {
            notify({
                title: "Configuración guardada",
                message:
                    "Los datos de tu tienda se actualizaron correctamente.",
                tone: "success",
            });

            // Actualizar configuración del panel
            queryClient.invalidateQueries({
                queryKey: ["settings", "store"],
            });

            // Actualizar información pública del storefront
            queryClient.invalidateQueries({
                queryKey: ["store-info"],
            });
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

    // =========================================================
    // SUBMIT
    // =========================================================

    function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        save({
            ...form,

            social_links: {
                facebook:
                    form.social_links?.facebook?.trim() || null,

                instagram:
                    form.social_links?.instagram?.trim() || null,

                tiktok:
                    form.social_links?.tiktok?.trim() || null,

                youtube:
                    form.social_links?.youtube?.trim() || null,
            },
        });
    }

    // =========================================================
    // LOADING
    // =========================================================

    if (isLoading) {
        return (
            <Panel className="table-panel">
                <div className="empty-state">
                    Cargando configuración...
                </div>
            </Panel>
        );
    }

    // =========================================================
    // ERROR
    // =========================================================

    if (isError) {
        return (
            <Panel className="table-panel">
                <div className="empty-state danger">
                    No se pudo cargar la configuración de la tienda.
                </div>
            </Panel>
        );
    }

    // =========================================================
    // FORMULARIO
    // =========================================================

    return (
        <Panel>
            <form onSubmit={handleSubmit}>

                {/* =================================================
                    CONFIGURACIÓN GENERAL
                ================================================= */}

                <div className="form-grid two">

                    {/* Nombre */}

                    <TextField
                        label="Nombre de la tienda"
                        value={form.name ?? ""}
                        onChange={(e) =>
                            setForm((f) => ({
                                ...f,
                                name: e.target.value,
                            }))
                        }
                        required
                    />

                    {/* Correo */}

                    <TextField
                        label="Correo de contacto"
                        type="email"
                        placeholder="contacto@tutienda.com"
                        value={form.contact_email ?? ""}
                        onChange={(e) =>
                            setForm((f) => ({
                                ...f,
                                contact_email: e.target.value,
                            }))
                        }
                    />

                    {/* Teléfono */}

                    <TextField
                        label="Teléfono de contacto"
                        placeholder="+57 300 000 0000"
                        value={form.contact_phone ?? ""}
                        onChange={(e) =>
                            setForm((f) => ({
                                ...f,
                                contact_phone: e.target.value,
                            }))
                        }
                    />

                    {/* Moneda */}

                    <label className="ui-field">
                        <span>Moneda</span>

                        <div className="ui-input-wrap">
                            <select
                                className="ui-input"
                                value={form.currency}
                                onChange={(e) =>
                                    setForm((f) => ({
                                        ...f,
                                        currency: e.target.value,
                                    }))
                                }
                            >
                                {CURRENCIES.map((currency) => (
                                    <option
                                        key={currency}
                                        value={currency}
                                    >
                                        {currency}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </label>

                    {/* Zona horaria */}

                    <label className="ui-field">
                        <span>Zona horaria</span>

                        <div className="ui-input-wrap">
                            <select
                                className="ui-input"
                                value={form.timezone}
                                onChange={(e) =>
                                    setForm((f) => ({
                                        ...f,
                                        timezone: e.target.value,
                                    }))
                                }
                            >
                                {TIMEZONES.map((tz) => (
                                    <option
                                        key={tz}
                                        value={tz}
                                    >
                                        {tz}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </label>
                </div>

                {/* =================================================
                    REDES SOCIALES
                ================================================= */}

                <div
                    style={{
                        marginTop: "32px",
                        paddingTop: "28px",
                        borderTop:
                            "1px solid var(--border-color, #e5e7eb)",
                    }}
                >
                    <div
                        style={{
                            marginBottom: "20px",
                        }}
                    >
                        <h3
                            style={{
                                margin: 0,
                                fontSize: "16px",
                                fontWeight: 700,
                            }}
                        >
                            Redes sociales
                        </h3>

                        <p
                            style={{
                                margin: "6px 0 0",
                                fontSize: "13px",
                                color: "#6b7280",
                            }}
                        >
                            Agrega las redes sociales que quieres
                            mostrar públicamente en tu tienda.
                        </p>
                    </div>

                    <div className="form-grid two">

                        {/* =================================================
                            FACEBOOK
                        ================================================= */}

                        <div
                            style={{
                                position: "relative",
                            }}
                        >
                            <TextField
                                label="Facebook"
                                placeholder="https://facebook.com/tu-tienda"
                                value={
                                    form.social_links?.facebook ??
                                    ""
                                }
                                onChange={(e) =>
                                    setForm((f) => ({
                                        ...f,
                                        social_links: {
                                            ...f.social_links,
                                            facebook:
                                                e.target.value,
                                        },
                                    }))
                                }
                            />

                            <FacebookIcon />
                        </div>

                        {/* =================================================
                            INSTAGRAM
                        ================================================= */}

                        <div
                            style={{
                                position: "relative",
                            }}
                        >
                            <TextField
                                label="Instagram"
                                placeholder="https://instagram.com/tu-tienda"
                                value={
                                    form.social_links?.instagram ??
                                    ""
                                }
                                onChange={(e) =>
                                    setForm((f) => ({
                                        ...f,
                                        social_links: {
                                            ...f.social_links,
                                            instagram:
                                                e.target.value,
                                        },
                                    }))
                                }
                            />

                            <InstagramIcon />
                        </div>

                        {/* =================================================
                            TIKTOK
                        ================================================= */}

                        <div
                            style={{
                                position: "relative",
                            }}
                        >
                            <TextField
                                label="TikTok"
                                placeholder="https://tiktok.com/@tu-tienda"
                                value={
                                    form.social_links?.tiktok ??
                                    ""
                                }
                                onChange={(e) =>
                                    setForm((f) => ({
                                        ...f,
                                        social_links: {
                                            ...f.social_links,
                                            tiktok:
                                                e.target.value,
                                        },
                                    }))
                                }
                            />

                            <TikTokIcon />
                        </div>

                        {/* =================================================
                            YOUTUBE
                        ================================================= */}

                        <div
                            style={{
                                position: "relative",
                            }}
                        >
                            <TextField
                                label="YouTube"
                                placeholder="https://youtube.com/@tu-tienda"
                                value={
                                    form.social_links?.youtube ??
                                    ""
                                }
                                onChange={(e) =>
                                    setForm((f) => ({
                                        ...f,
                                        social_links: {
                                            ...f.social_links,
                                            youtube:
                                                e.target.value,
                                        },
                                    }))
                                }
                            />

                            <YoutubeIcon />
                        </div>
                    </div>
                </div>

                {/* =================================================
                    GUARDAR
                ================================================= */}

                <div className="form-actions">
                    <Button
                        type="submit"
                        disabled={isPending}
                    >
                        <Save size={16} />

                        {isPending
                            ? "Guardando..."
                            : "Guardar cambios"}
                    </Button>
                </div>
            </form>
        </Panel>
    );
}

/* =========================================================
   FACEBOOK
========================================================= */

function FacebookIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            width="16"
            height="16"
            style={{
                position: "absolute",
                right: "12px",
                bottom: "12px",
                color: "#1877F2",
            }}
            aria-hidden="true"
        >
            <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.095 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.017 1.792-4.688 4.533-4.688 1.312 0 2.686.236 2.686.236v2.975h-1.515c-1.491 0-1.955.93-1.955 1.886v2.261h3.328l-.532 3.49h-2.796V24C19.612 23.095 24 18.1 24 12.073Z" />
        </svg>
    );
}

/* =========================================================
   INSTAGRAM
========================================================= */

function InstagramIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            width="16"
            height="16"
            style={{
                position: "absolute",
                right: "12px",
                bottom: "12px",
            }}
            aria-hidden="true"
        >
            <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="5"
                stroke="#E1306C"
                strokeWidth="2"
            />

            <circle
                cx="12"
                cy="12"
                r="4"
                stroke="#E1306C"
                strokeWidth="2"
            />

            <circle
                cx="17.5"
                cy="6.5"
                r="1"
                fill="#E1306C"
            />
        </svg>
    );
}

/* =========================================================
   TIKTOK
========================================================= */

function TikTokIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            width="16"
            height="16"
            style={{
                position: "absolute",
                right: "12px",
                bottom: "12px",
                color: "#111827",
            }}
            aria-hidden="true"
        >
            <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.003V2h-3.54v13.813a2.943 2.943 0 1 1-2.943-2.943c.154 0 .306.012.454.035v-3.6a6.55 6.55 0 0 0-.454-.016A6.526 6.526 0 1 0 15.862 15.8V8.79a8.284 8.284 0 0 0 3.727.886V6.686Z" />
        </svg>
    );
}

/* =========================================================
   YOUTUBE
========================================================= */

function YoutubeIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            width="16"
            height="16"
            style={{
                position: "absolute",
                right: "12px",
                bottom: "12px",
                color: "#FF0000",
            }}
            aria-hidden="true"
        >
            <path d="M23.498 6.186a3.003 3.003 0 0 0-2.112-2.123C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.386.563A3.003 3.003 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.003 3.003 0 0 0 2.112 2.123C4.495 20.5 12 20.5 12 20.5s7.505 0 9.386-.563a3.003 3.003 0 0 0 2.112-2.123C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" />
        </svg>
    );
}