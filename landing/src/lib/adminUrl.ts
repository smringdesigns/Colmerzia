// En local, el panel admin corre en el puerto 5173. En producción,
// esto se sobreescribe con VITE_ADMIN_URL=https://admin.colmerzia.com
export const ADMIN_URL = import.meta.env.VITE_ADMIN_URL ?? "http://localhost:5173";

// /create-account es el flujo público de registro (cuenta + tienda
// juntas) que ya existe en el panel admin — la landing no necesita
// su propio formulario de registro, solo enlaza a este.
export const SIGNUP_URL = `${ADMIN_URL}/create-account`;
export const LOGIN_URL = `${ADMIN_URL}/login`;
