import { useQuery } from "@tanstack/react-query";
import {
    Mail,
    Phone,
    Store,
} from "lucide-react";

import { getStoreInfo } from "../features/store/storeApi";

export default function Footer() {
    const { data: store } = useQuery({
        queryKey: ["store-info"],
        queryFn: getStoreInfo,
        staleTime: 5 * 60 * 1000,
    });

    const year = new Date().getFullYear();

    /*
     * Normaliza el teléfono para WhatsApp.
     *
     * Si viene como:
     * 3001234567
     *
     * lo convierte en:
     * 573001234567
     *
     * Si ya viene con 57, no lo duplica.
     */
    const whatsappNumber = store?.contact_phone
        ? (() => {
              const digits =
                  store.contact_phone.replace(/\D/g, "");

              if (!digits) {
                  return "";
              }

              return digits.startsWith("57")
                  ? digits
                  : `57${digits}`;
          })()
        : "";

    const hasSocialLinks =
        store?.social_links?.facebook ||
        store?.social_links?.instagram ||
        store?.social_links?.tiktok ||
        store?.social_links?.youtube ||
        whatsappNumber;

    return (
        <footer className="border-t border-[#c7c4d7]/50 bg-[#f2f3ff] text-[#131b2e]">
            <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">

                {/* =====================================================
                    CONTENIDO PRINCIPAL
                ===================================================== */}

                <div className="grid gap-10 py-12 md:grid-cols-[1.15fr_0.85fr] md:gap-16">

                    {/* =================================================
                        TIENDA
                    ================================================= */}

                    <div className="min-w-0">

                        <div className="flex items-center gap-3">

                            {/* Logo */}

                            {store?.logo_url ? (
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#dcdce8] bg-white shadow-[0_2px_8px_rgba(35,35,60,0.04)]">
                                    <img
                                        src={store.logo_url}
                                        alt={
                                            store.name ??
                                            "Logo"
                                        }
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e9eaff] text-[#4648d4]">
                                    <Store size={19} />
                                </div>
                            )}

                            <div className="min-w-0">
                                <h3 className="truncate text-lg font-bold tracking-tight text-[#131b2e] sm:text-xl">
                                    {store?.name ?? "Tienda"}
                                </h3>

                                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9695a1]">
                                    Tienda online
                                </p>
                            </div>
                        </div>

                        <p className="mt-5 max-w-md text-sm leading-6 text-[#686777]">
                            Compra fácil, rápida y segura desde
                            cualquier lugar. Gracias por confiar
                            en nuestra tienda.
                        </p>

                        {/* =================================================
                            REDES SOCIALES
                        ================================================= */}

                        {hasSocialLinks && (
                            <div className="mt-6">

                                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9695a1]">
                                    Síguenos
                                </p>

                                <div className="mt-3 flex flex-wrap items-center gap-2">

                                    {/* Facebook */}

                                    {store?.social_links
                                        ?.facebook && (
                                        <SocialButton
                                            label="Facebook"
                                            href={
                                                store
                                                    .social_links
                                                    .facebook
                                            }
                                        >
                                            <FacebookIcon />
                                        </SocialButton>
                                    )}

                                    {/* Instagram */}

                                    {store?.social_links
                                        ?.instagram && (
                                        <SocialButton
                                            label="Instagram"
                                            href={
                                                store
                                                    .social_links
                                                    .instagram
                                            }
                                        >
                                            <InstagramIcon />
                                        </SocialButton>
                                    )}

                                    {/* TikTok */}

                                    {store?.social_links
                                        ?.tiktok && (
                                        <SocialButton
                                            label="TikTok"
                                            href={
                                                store
                                                    .social_links
                                                    .tiktok
                                            }
                                        >
                                            <TikTokIcon />
                                        </SocialButton>
                                    )}

                                    {/* YouTube */}

                                    {store?.social_links
                                        ?.youtube && (
                                        <SocialButton
                                            label="YouTube"
                                            href={
                                                store
                                                    .social_links
                                                    .youtube
                                            }
                                        >
                                            <YoutubeIcon />
                                        </SocialButton>
                                    )}

                                    {/* WhatsApp */}

                                    {whatsappNumber && (
                                        <SocialButton
                                            label="WhatsApp"
                                            href={`https://wa.me/${whatsappNumber}`}
                                        >
                                            <WhatsAppIcon />
                                        </SocialButton>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* =================================================
                        CONTACTO
                    ================================================= */}

                    <div className="md:justify-self-end md:min-w-[300px]">

                        <div className="mb-4">
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9695a1]">
                                Contacto
                            </p>

                            <h4 className="mt-1 text-base font-bold text-[#131b2e]">
                                ¿Necesitas ayuda?
                            </h4>
                        </div>

                        <div className="flex flex-col gap-2.5">

                            {/* =================================================
                                CORREO
                            ================================================= */}

                            {store?.contact_email && (
                                <a
                                    href={`mailto:${store.contact_email}`}
                                    className="group flex items-center gap-3 rounded-xl border border-[#dcdce8] bg-white/70 px-3.5 py-3 shadow-[0_2px_8px_rgba(35,35,60,0.025)] transition hover:border-[#4648d4]/30 hover:bg-white"
                                >
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e9eaff] text-[#4648d4] transition group-hover:bg-[#e1e2ff]">
                                        <Mail size={15} />
                                    </span>

                                    <span className="min-w-0">
                                        <span className="block text-[10px] font-bold uppercase tracking-wide text-[#9695a1]">
                                            Correo
                                        </span>

                                        <span className="mt-0.5 block truncate text-sm font-semibold text-[#464554] transition group-hover:text-[#4648d4]">
                                            {store.contact_email}
                                        </span>
                                    </span>
                                </a>
                            )}

                            {/* =================================================
                                WHATSAPP
                            ================================================= */}

                            {whatsappNumber && (
                                <a
                                    href={`https://wa.me/${whatsappNumber}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-3 rounded-xl border border-[#dcdce8] bg-white/70 px-3.5 py-3 shadow-[0_2px_8px_rgba(35,35,60,0.025)] transition hover:border-[#4648d4]/30 hover:bg-white"
                                >
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e9eaff] text-[#4648d4] transition group-hover:bg-[#e1e2ff]">
                                        <Phone size={15} />
                                    </span>

                                    <span className="min-w-0">
                                        <span className="block text-[10px] font-bold uppercase tracking-wide text-[#9695a1]">
                                            WhatsApp
                                        </span>

                                        <span className="mt-0.5 block text-sm font-semibold text-[#464554] transition group-hover:text-[#4648d4]">
                                            {store.contact_phone}
                                        </span>
                                    </span>
                                </a>
                            )}

                        </div>
                    </div>
                </div>

                {/* =====================================================
                    BARRA INFERIOR
                ===================================================== */}

                <div className="flex flex-col gap-3 border-t border-[#c7c4d7]/40 py-5 text-xs text-[#767586] sm:flex-row sm:items-center sm:justify-between">

                    <span>
                        © {year}{" "}

                        <span className="font-semibold text-[#686777]">
                            {store?.name ?? "Tienda"}
                        </span>

                        . Todos los derechos reservados.
                    </span>

                    <span className="font-medium">
                        Precios expresados en{" "}

                        <span className="font-bold text-[#686777]">
                            {store?.currency ?? "COP"}
                        </span>
                    </span>
                </div>
            </div>
        </footer>
    );
}

/* =========================================================
   BOTÓN DE RED SOCIAL
========================================================= */

function SocialButton({
    label,
    href,
    children,
}: {
    label: string;
    href: string;
    children: React.ReactNode;
}) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#d5d5e2] bg-white text-[#686777] shadow-[0_2px_6px_rgba(35,35,60,0.025)] transition hover:border-[#4648d4]/40 hover:bg-[#e9eaff] hover:text-[#4648d4]"
        >
            {children}
        </a>
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
            className="h-[17px] w-[17px]"
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
            className="h-[17px] w-[17px]"
            aria-hidden="true"
        >
            <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="5"
                stroke="currentColor"
                strokeWidth="2"
            />

            <circle
                cx="12"
                cy="12"
                r="4"
                stroke="currentColor"
                strokeWidth="2"
            />

            <circle
                cx="17.5"
                cy="6.5"
                r="1"
                fill="currentColor"
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
            className="h-[17px] w-[17px]"
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
            className="h-[17px] w-[17px]"
            aria-hidden="true"
        >
            <path d="M23.498 6.186a3.003 3.003 0 0 0-2.112-2.123C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.386.563A3.003 3.003 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.003 3.003 0 0 0 2.112 2.123C4.495 20.5 12 20.5 12 20.5s7.505 0 9.386-.563a3.003 3.003 0 0 0 2.112-2.123C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" />
        </svg>
    );
}

/* =========================================================
   WHATSAPP
========================================================= */

function WhatsAppIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-[17px] w-[17px]"
            aria-hidden="true"
        >
            <path d="M20.52 3.48A11.82 11.82 0 0 0 12.08 0C5.52 0 .18 5.34.18 11.9c0 2.1.55 4.15 1.6 5.96L.08 24l6.28-1.65a11.9 11.9 0 0 0 5.72 1.46h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.47-8.43ZM12.09 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.73.98 1-3.64-.23-.37a9.83 9.83 0 0 1-1.51-5.28c0-5.45 4.44-9.88 9.9-9.88 2.64 0 5.12 1.03 6.98 2.9a9.83 9.83 0 0 1 2.9 7c0 5.45-4.44 9.88-9.9 9.88Zm5.42-7.4c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.46-.88-.79-1.47-1.76-1.64-2.06-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.5 1.69.64.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
        </svg>
    );
}