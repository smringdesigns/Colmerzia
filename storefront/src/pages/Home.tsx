import { useQuery } from "@tanstack/react-query";

import { getStoreInfo } from "../features/store/storeApi";
import CatalogHome from "./CatalogHome";
import MenuHome from "./MenuHome";
import ServicesHome from "./ServicesHome";

/**
 * Qué home renderizar depende del storefront_layout que devuelve
 * GET /v1/storefront/store (calculado en el backend a partir del
 * business_type de la tienda — ver config/business_types.php).
 *
 * Mientras carga ese dato (o si por algún motivo no llega), se
 * muestra CatalogHome como default: es el layout más genérico
 * (grilla de productos), el que mejor sirve de fallback razonable
 * para cualquier tipo de negocio.
 */
export default function Home() {
    const { data: store } = useQuery({
        queryKey: ["store-info"],
        queryFn: getStoreInfo,
        staleTime: 5 * 60 * 1000,
    });

    switch (store?.storefront_layout) {
        case "menu":
            return <MenuHome />;
        case "services":
            return <ServicesHome />;
        case "catalog":
        default:
            return <CatalogHome />;
    }
}
