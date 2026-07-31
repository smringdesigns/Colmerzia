import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
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

            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);