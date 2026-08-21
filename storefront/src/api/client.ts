import axios from "axios";
import { getGuestToken, setGuestToken } from "../lib/guestToken";
import { useCustomerAuthStore } from "../lib/customerAuthStore";

/**
 * La tienda se identifica por SUBDOMINIO.
 *
 * Ejemplo:
 *
 * tienda-a.localhost:5174
 *        ↓
 * tienda-a.localhost:8080/api
 *
 * VITE_API_URL permite sobrescribir esta URL en producción
 * o cuando se utiliza un proxy.
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
|
| 1. Authorization Bearer para usuarios autenticados.
| 2. X-Guest-Token para el storefront/carrito.
|
|--------------------------------------------------------------------------
*/

api.interceptors.request.use((config) => {

    /*
    |--------------------------------------------------------------------------
    | Token de autenticación
    |--------------------------------------------------------------------------
    */

    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }


    /*
    |--------------------------------------------------------------------------
    | Guest token
    |--------------------------------------------------------------------------
    */

    const guestToken = getGuestToken();

    if (guestToken) {
        config.headers["X-Guest-Token"] = guestToken;
    }


    return config;
});


/*
|--------------------------------------------------------------------------
| RESPONSE INTERCEPTOR
|--------------------------------------------------------------------------
|
| El backend puede generar un nuevo guest_token.
|
| Esto puede ocurrir:
|
| - Primera visita.
| - El carrito anterior expiró.
| - El backend renovó el token.
|
|--------------------------------------------------------------------------
*/

api.interceptors.response.use(
    (response) => {

        const guestToken = response.data?.guest_token;

        if (guestToken) {
            setGuestToken(guestToken);
        }

        return response;
    },

    (error) => {

        /*
        |--------------------------------------------------------------------------
        | Error 401
        |--------------------------------------------------------------------------
        |
        | Si el token de autenticación expiró, eliminamos el token local.
        |
        | No eliminamos el guest token porque pertenece al carrito.
        |
        |--------------------------------------------------------------------------
        */

        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            useCustomerAuthStore.getState().clearSession();
        }

        return Promise.reject(error);
    }
);