import api from "./api";
import type { CategoriaInterface } from "../types/CategoriaInteface";

export default {

    listar(page=1, limit=10, buscar=""){
        return api.get(`/cliente-proveedor?page=${page}&limit=${limit}&search=${buscar}`);
    },
    guardar(data: CategoriaInterface){
        return api.post("/cliente-proveedor", data);
    },
    mostrar(id: number){
        return api.get("/cliente-proveedor/"+id);
    },
    modificar(id: number, data: CategoriaInterface){
        return api.put("/cliente-proveedor/"+id, data);
    },
    eliminar(id: number){
        api.delete("/cliente-proveedor/"+id);
    },
    actualizarImagenProducto(id: number, formData: FormData){
        return api.post(`/cliente-proveedor/${id}/actualiza-imagen`, formData);

    }

}