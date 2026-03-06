import api from "./api";

export async function loginLaravel(email: string, password: string){
    const respuesta = await api.post("/v1/auth/login", {email, password});
    return respuesta.data;
}

export async function loginNest(email: string, password: string){
    const respuesta = await api.post("/auth/login", {email, password});
    return respuesta.data;
}