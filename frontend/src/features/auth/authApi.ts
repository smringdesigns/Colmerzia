import { api } from "../../api/client";

export async function login(
    email: string,
    password: string
) {
    const response = await api.post("/v1/login", {
        email,
        password,
    });

    return response.data.data;
}

export async function me() {
    const response = await api.get("/v1/me");

    return response.data.data;
}

export async function logout() {
    const response = await api.post("/v1/logout");

    return response.data;
}

// Conexión con Laravel para solicitar el correo de recuperación
export async function forgotPassword(email: string) {
    const response = await api.post("/v1/forgot-password", { email });
    return response.data;
}

// NUEVA FUNCIÓN: Conexión con Laravel para guardar la nueva contraseña
export async function resetPassword(data: { email: string; token: string; password: string; password_confirmation: string }) {
    const response = await api.post('/v1/reset-password', data);
    return response.data;
}

// NUEVA FUNCIÓN: Conexión con Laravel para reenviar el correo de verificación
export async function sendVerificationEmail() {
    const response = await api.post('/v1/email/verification-notification');
    return response.data;
}