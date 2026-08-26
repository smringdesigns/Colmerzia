/**
 * Contenido de la landing reflejado a mano desde la config del
 * backend (config/business_types.php y config/plans.php), no
 * traído por API: es una página estática de marketing, no tiene
 * sentido que dependa de que el backend esté levantado para
 * renderizar.
 *
 * OJO: si agregás/cambiás tipos de negocio o límites de planes en
 * el backend, actualizá esto a mano también. Son pocos datos y
 * cambian poco, así que mantenerlos sincronizados manualmente es
 * más simple que armar un endpoint público solo para esto — pero
 * si en algún momento se desincroniza mucho, avisame y armamos ese
 * endpoint.
 */

export interface BusinessType {
    slug: string;
    name: string;
    layout: string;
}

export const businessTypes: BusinessType[] = [
    { slug: "retail", name: "Retail / Tienda general", layout: "Catálogo" },
    { slug: "moda", name: "Moda y accesorios", layout: "Catálogo" },
    { slug: "tecnologia", name: "Tecnología y electrónica", layout: "Catálogo" },
    { slug: "restaurante", name: "Restaurante / Comida", layout: "Menú" },
    { slug: "servicios", name: "Servicios", layout: "Servicios" },
];

export interface PlanTier {
    slug: string;
    name: string;
    trialDays: number | null;
    highlight?: boolean;
    limits: {
        products: string;
        staff: string;
        warehouses: string;
    };
    features: string[];
}

export const plans: PlanTier[] = [
    {
        slug: "free",
        name: "Free",
        trialDays: 60,
        limits: {
            products: "Hasta 50 productos",
            staff: "Hasta 2 usuarios",
            warehouses: "1 bodega",
        },
        features: ["Catálogo e inventario", "Pedidos y clientes", "Panel de ventas"],
    },
    {
        slug: "starter",
        name: "Starter",
        trialDays: null,
        limits: {
            products: "Hasta 500 productos",
            staff: "Hasta 5 usuarios",
            warehouses: "1 bodega",
        },
        features: ["Todo lo del plan Free", "Cupones de descuento"],
    },
    {
        slug: "pro",
        name: "Pro",
        trialDays: null,
        highlight: true,
        limits: {
            products: "Hasta 5.000 productos",
            staff: "Hasta 20 usuarios",
            warehouses: "Hasta 5 bodegas",
        },
        features: ["Todo lo del plan Starter", "Reglas de descuento", "Multi-bodega"],
    },
    {
        slug: "business",
        name: "Business",
        trialDays: null,
        limits: {
            products: "Productos ilimitados",
            staff: "Usuarios ilimitados",
            warehouses: "Bodegas ilimitadas",
        },
        features: ["Todo lo del plan Pro", "Sin límites de catálogo ni equipo"],
    },
];
