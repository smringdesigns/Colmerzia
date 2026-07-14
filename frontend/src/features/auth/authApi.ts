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