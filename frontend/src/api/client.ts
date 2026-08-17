import axios from "axios";

/**
 * URL base de la API.
 *
 * Desarrollo:
 * VITE_API_URL=http://localhost:8080/api
 *
 * Producción:
 * VITE_API_URL=https://api.colmerzia.com/api
 *
 * Si VITE_API_URL no está definida, usamos la URL local
 * como fallback para no romper el entorno actual.
 */
const apiBaseUrl =
    import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";

export const api = axios.create({
    baseURL: apiBaseUrl,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

/**
 * Rutas que no deben enviar X-Tenant.
 *
 * Estas rutas pertenecen al flujo de autenticación/onboarding
 * y algunas se ejecutan desde el dominio principal.
 *
 * Es especialmente importante /register porque durante el
 * registro se está creando una tienda nueva.
 */
const publicRoutes = [
    "/login",
    "/register",
    "/onboarding",
    "/forgot-password",
    "/reset-password",
    "/email/verify",
];

/**
 * Determina si la petición corresponde a una ruta pública.
 */
const isPublicRoute = (url?: string): boolean => {
    if (!url) {
        return false;
    }

    return publicRoutes.some((route) => url.includes(route));
};

/**
 * Determina el tenant actual.
 *
 * Prioridad:
 *
 * 1. Tenant obtenido del subdominio.
 * 2. tenant_subdomain almacenado en localStorage.
 *
 * IMPORTANTE:
 * admin.colmerzia.com NO debe convertirse en:
 *
 * tenant = "admin"
 *
 * porque "admin" es el panel administrativo, no una tienda.
 */
const getCurrentTenant = (): string | null => {
    const hostname = window.location.hostname.toLowerCase();

    /*
     * Dominios que no representan directamente una tienda.
     */
    const ignoredHosts = [
        "localhost",
        "127.0.0.1",
        "::1",
    ];

    /*
     * Si estamos en localhost puro o IP local,
     * usamos posteriormente el fallback de localStorage.
     */
    if (!ignoredHosts.includes(hostname)) {
        const parts = hostname.split(".");

        /*
         * Ejemplos:
         *
         * lemarc.localhost
         *     → lemarc
         *
         * lemarc.colmerzia.localhost
         *     → lemarc
         *
         * lemarc.colmerzia.com
         *     → lemarc
         *
         * admin.colmerzia.com
         *     → NO debe ser admin
         */
        const firstPart = parts[0];

        if (
            firstPart &&
            firstPart !== "www" &&
            firstPart !== "admin" &&
            firstPart !== "api"
        ) {
            return firstPart;
        }
    }

    /*
     * Fallback para:
     *
     * - localhost
     * - panel administrativo
     * - desarrollo
     * - tenant seleccionado manualmente
     */
    return localStorage.getItem("tenant_subdomain");
};

/**
 * Interceptor de peticiones.
 *
 * Se ejecuta antes de enviar cada request a Laravel.
 */
api.interceptors.request.use(
    (config) => {
        /*
         * ---------------------------------------------------------
         * 1. TOKEN DE AUTENTICACIÓN
         * ---------------------------------------------------------
         *
         * Si existe un token, lo enviamos como Bearer.
         */
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.set(
                "Authorization",
                `Bearer ${token}`
            );
        }

        /*
         * ---------------------------------------------------------
         * 2. RUTAS PÚBLICAS
         * ---------------------------------------------------------
         *
         * Login, registro, onboarding, recuperación de contraseña,
         * etc. no deben recibir X-Tenant.
         */
        const isPublic = isPublicRoute(config.url);

        /*
         * ---------------------------------------------------------
         * 3. TENANT
         * ---------------------------------------------------------
         */
        const tenant = getCurrentTenant();

        /*
         * ---------------------------------------------------------
         * 4. X-TENANT
         * ---------------------------------------------------------
         *
         * Solo lo agregamos cuando:
         *
         * - existe un tenant
         * - la ruta no es pública
         */
        if (tenant && !isPublic) {
            config.headers.set("X-Tenant", tenant);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Interceptor de respuestas.
 *
 * Centralizamos aquí el manejo de sesiones expiradas.
 */
api.interceptors.response.use(
    (response) => response,

    (error) => {
        /*
         * HTTP 401 = token inválido, expirado
         * o usuario no autenticado.
         */
        if (error.response?.status === 401) {
            localStorage.removeItem("token");

            /*
             * No eliminamos tenant_subdomain.
             *
             * El tenant puede seguir siendo necesario para
             * que el usuario pueda volver a autenticarse en
             * la misma tienda.
             */
            const currentPath = window.location.pathname;

            /*
             * Evitamos redirecciones repetitivas.
             */
            if (currentPath !== "/login") {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);