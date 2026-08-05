import axios from "axios";
import { getGuestToken, setGuestToken } from "../lib/guestToken";

/**
 * La tienda se identifica por SUBDOMINIO (tienda-a.midominio.com), el
 * mismo mecanismo que usa el backend (ResolveTenantBySubdomain). Por
 * eso la base URL de la API se arma a partir del hostname actual del
 * navegador, no de un valor fijo: así, visitar tienda-a.localhost:5174
 * automáticamente habla con tienda-a.localhost:8080/api.
 *
 * VITE_API_URL permite overridearlo (por ejemplo, en producción
 * detrás de un proxy con el mismo origin).
 */
const apiBaseUrl =
    import.meta.env.VITE_API_URL ??
    `${window.location.protocol}//${window.location.hostname}:8080/api`;

export const api = axios.create({
    baseURL: apiBaseUrl,
    headers: {
        Accept: "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = getGuestToken();

    if (token) {
        config.headers["X-Guest-Token"] = token;
    }

    return config;
});

// El backend puede devolver un guest_token nuevo (primera visita, o
// el carrito anterior ya no es válido) — lo persistimos siempre que
// aparezca en una respuesta.
api.interceptors.response.use((response) => {
    const token = response.data?.guest_token;

    if (token) {
        setGuestToken(token);
    }

    return response;
});
