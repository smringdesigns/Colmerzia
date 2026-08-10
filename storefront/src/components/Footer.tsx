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
        <footer className="site-footer">
            <div className="site-footer-inner">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="site-footer-brand">{store?.name ?? "Tienda"}</p>

                    {(store?.contact_email || store?.contact_phone) && (
                        <div className="site-footer-meta">
                            {store?.contact_email && (
                                <a href={`mailto:${store.contact_email}`}>
                                    <Mail size={13} className="mr-1.5 inline" />
                                    {store.contact_email}
                                </a>
                            )}
                            {store?.contact_phone && (
                                <a href={`tel:${store.contact_phone}`}>
                                    <Phone size={13} className="mr-1.5 inline" />
                                    {store.contact_phone}
                                </a>
                            )}
                        </div>
                    )}
                </div>

                <div className="site-footer-bottom">
                    <span>© {year} {store?.name ?? "Tienda"}</span>
                    <span>Todos los precios en {store?.currency ?? "COP"}</span>
                </div>
            </div>
        </footer>
    );
}
