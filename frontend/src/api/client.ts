import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    // 1. Inyectar el Token de autenticación si existe
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. NUEVO: Validar si es una ruta de autenticación pública
    // Las rutas de login o registro NUNCA deben llevar el header de la tienda (X-Tenant)
    const isAuthRoute = 
        config.url?.includes('/login') || 
        config.url?.includes('/register');

    // 3. Inyectar el subdominio de la tienda (Tenant) solo si existe Y NO es una ruta de auth
    const tenant = localStorage.getItem("tenant_subdomain");
    if (tenant && !isAuthRoute) {
        config.headers["X-Tenant"] = tenant;
    }

    return config;
});

// Si el token guardado ya no sirve (expiró, se borró en el backend,
// o simplemente es inválido), el backend responde 401. Sin este
// interceptor, la app se queda "colgada": cree que hay sesión activa
// (porque existe un token en localStorage) pero ninguna petición
// funciona y no hay forma de volver al login.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            
            // Opcional: También podemos limpiar el tenant por seguridad al cerrar sesión
            localStorage.removeItem("tenant_subdomain");

            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);