import { api } from "../../api/client";

export interface BusinessTypeOption {
    slug: string;
    name: string;
}

interface BusinessTypesResponse {
    data: BusinessTypeOption[];
}

/**
 * Catálogo de tipos de negocio disponibles (retail, moda, restaurante,
 * servicios, etc.), usado para poblar el <select> en los formularios
 * de creación de tienda. Endpoint público, no requiere tenant ni
 * sesión — ver GET /v1/business-types.
 */
export async function getBusinessTypes(): Promise<BusinessTypeOption[]> {
    const res = await api.get<BusinessTypesResponse>("/v1/business-types");
    return res.data?.data ?? [];
}
