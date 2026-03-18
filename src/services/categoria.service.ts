import api from "./api";
import type { CategoriaInterface } from "../types/CategoriaInteface";

export default {

    index(){
        return api.get(`/categoria`);
    },
    store(data: CategoriaInterface){
        return api.post("/categoria", data);
    },
    show(id: number){
        return api.get("/categoria/"+id);
    },
    update(id: number, data: CategoriaInterface){
        return api.put("/categoria/"+id, data);
    },
    destroy(id: number){
        api.delete("/categoria/"+id);
    }

}