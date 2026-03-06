import api from "./api";

export async function loginLaravel(email: string, password: string){
    const respuesta = await api.post("/v1/auth/login", {email, password});
    return respuesta;
}

export async function loginNest(email: string, password: string){
    const respuesta = await api.post("/auth/login", {email, password});
    return respuesta.data;
}

export async function getProfile() {
    const respuesta = await api.get("/v1/auth/profile");
    return respuesta.data;
}

export async function funSalir() {
    const respuesta = await api.post("/v1/auth/logout");
    return respuesta.data;
}