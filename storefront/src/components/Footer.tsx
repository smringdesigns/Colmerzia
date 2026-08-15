import { useQuery } from "@tanstack/react-query";
import { Mail, Phone } from "lucide-react";

import { getStoreInfo } from "../features/store/storeApi";

export default function Footer() {
    const { data: store } = useQuery({
        queryKey: ["store-info"],
        queryFn: getStoreInfo,
        staleTime: 5 * 60 * 1000,
    });

    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-[#c7c4d7]/50 bg-[#f2f3ff] text-[#131b2e]">
            <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
                {/* Sección superior del footer */}
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="text-xl font-bold tracking-tight text-[#131b2e]">
                            {store?.name ?? "Tienda"}
                        </h3>
                        <p className="mt-1 text-sm text-[#464554]">
                            Compra fácil, rápida y segura desde cualquier lugar.
                        </p>
                    </div>

                    {/* Información de contacto */}
                    {(store?.contact_email || store?.contact_phone) && (
                        <div className="flex flex-col gap-2 sm:items-end">
                            {store?.contact_email && (
                                <a
                                    href={`mailto:${store.contact_email}`}
                                    className="inline-flex items-center text-sm font-medium text-[#464554] transition hover:text-[#4648d4]"
                                >
                                    <Mail size={15} className="mr-2 text-[#4648d4]" />
                                    {store.contact_email}
                                </a>
                            )}
                            {store?.contact_phone && (
                                <a
                                    href={`tel:${store.contact_phone}`}
                                    className="inline-flex items-center text-sm font-medium text-[#464554] transition hover:text-[#4648d4]"
                                >
                                    <Phone size={15} className="mr-2 text-[#4648d4]" />
                                    {store.contact_phone}
                                </a>
                            )}
                        </div>
                    )}
                </div>

                {/* Línea divisoria y Copyright */}
                <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[#c7c4d7]/40 pt-6 text-xs text-[#767586] sm:flex-row">
                    <span>
                        © {year} {store?.name ?? "Tienda"}. Todos los derechos reservados.
                    </span>
                    <span>
                        Todos los precios en {store?.currency ?? "COP"}
                    </span>
                </div>
            </div>
        </footer>
    );
}