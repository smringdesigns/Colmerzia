import axios from "axios";
import { getGuestToken, setGuestToken } from "../lib/guestToken";

/**
 * La tienda se identifica por SUBDOMINIO.
 * 
 * Si usas un proxy en vite.config.ts o VITE_API_URL, se respeta.
 * De lo contrario, construye la URL base conservando el puerto o apuntando al backend.
 */
const apiBaseUrl =
    import.meta.env.VITE_API_URL ??
    `${window.location.protocol}//${window.location.hostname}:8080/api`;

export const api = axios.create({
    baseURL: apiBaseUrl,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

/*
|--------------------------------------------------------------------------
| REQUEST INTERCEPTOR
|--------------------------------------------------------------------------
|
| Agrega automáticamente:
| 1. Authorization Bearer para usuarios autenticados.
| 2. X-Guest-Token para el storefront/carrito.
| 3. X-Tenant detectado dinámicamente por subdominio o localStorage.
|
|--------------------------------------------------------------------------
*/

api.interceptors.request.use((config) => {
    // 1. Token de autenticación
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
    }

    // 2. Guest token para el carrito
    const guestToken = getGuestToken();
    if (guestToken) {
        config.headers["X-Guest-Token"] = guestToken;
    }

    // 3. Rutas públicas que no deben llevar X-Tenant
    const publicRoutes = [
        '/login',
        '/register',
        '/onboarding',
        '/forgot-password',
        '/reset-password',
        '/email/verify',
    ];

    const isAuthRoute = publicRoutes.some((route) =>
        config.url?.includes(route)
    );

    // 4. Determinar el Tenant (Tienda) dinámicamente por subdominio
    let tenant = null;
    const hostname = window.location.hostname; // Ej: "lemarc.localhost"
    const parts = hostname.split('.');

    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        if (parts[0] !== 'www') {
            tenant = parts[0];
        }
    }

    // Fallback al localStorage
    if (!tenant) {
        tenant = localStorage.getItem("tenant_subdomain");
    }

    // 5. Inyectar el X-Tenant si aplica y no es ruta pública
    if (tenant && !isAuthRoute) {
        config.headers.set('X-Tenant', tenant);
    }

    return config;
});

/*
|--------------------------------------------------------------------------
| RESPONSE INTERCEPTOR
|--------------------------------------------------------------------------
*/

api.interceptors.response.use(
    (response) => {
        // Capturar o actualizar el guest_token emitido por el backend
        const guestToken = response.data?.guest_token;
        if (guestToken) {
            setGuestToken(guestToken);
        }

        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            // No eliminamos el guest token del carrito

            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);