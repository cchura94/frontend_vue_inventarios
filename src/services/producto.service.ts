import api from "./api";
import type { CategoriaInterface } from "../types/CategoriaInteface";

export default {

    listar(page=1, limit=10, buscar=""){
        return api.get(`/producto?page=${page}&limit=${limit}&q=${buscar}`);
    },
    guardar(data: CategoriaInterface){
        return api.post("/producto", data);
    },
    mostrar(id: number){
        return api.get("/producto/"+id);
    },
    modificar(id: number, data: CategoriaInterface){
        return api.put("/producto/"+id, data);
    },
    eliminar(id: number){
        api.delete("/producto/"+id);
    },
    actualizarImagenProducto(id: number, formData: FormData){
        return api.post(`/producto/${id}/actualiza-imagen`, formData);

    }

}