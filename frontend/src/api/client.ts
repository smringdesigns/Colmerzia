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
        // Usamos .set() para mayor seguridad en versiones recientes de Axios
        config.headers.set('Authorization', `Bearer ${token}`);
    }

    // 2. Validar si es una ruta de autenticación pública
    const isAuthRoute = 
        config.url?.includes('/login') || 
        config.url?.includes('/register');

    // 3. Determinar el Tenant (Tienda) dinámicamente
    let tenant = null;
    const hostname = window.location.hostname; // Ej: "colmerzia.localhost" o "lemarc.localhost"
    const parts = hostname.split('.'); 
    
    // a. Si estás usando una URL con subdominio (ej: lemarc.localhost o lemarc.colmerzia.localhost)
    // Ignoramos "localhost" puro o la IP local.
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        // Tomamos siempre la primera parte de la URL antes del primer punto
        if (parts[0] !== 'www') {
            tenant = parts[0]; 
        }
    }

    // b. Fallback al localStorage (útil si entras por localhost puro o estás en el Panel Admin)
    if (!tenant) {
        tenant = localStorage.getItem("tenant_subdomain");
    }

    // --- LOGS PARA DEPURACIÓN ---
    console.log("Petición a:", config.url);
    console.log("Tenant detectado por React:", tenant);

    // 4. Inyectar el X-Tenant si lo encontramos y no es ruta de auth
    if (tenant && !isAuthRoute) {
        // Usamos .set() para inyectar la cabecera de forma segura
        config.headers.set('X-Tenant', tenant);
        console.log("✅ Header X-Tenant inyectado correctamente.");
    } else {
        console.warn("⚠️ No se inyectó X-Tenant.");
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("tenant_subdomain");

            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);