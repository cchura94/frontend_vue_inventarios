import api from "./api";
import type { SucursalInterface } from "../types/SucursalInteface";

export default {

    index(){
        return api.get(`/sucursal`);
    },
    store(data: SucursalInterface){
        return api.post("/sucursal", data);
    },
    show(id: number){
        return api.get("/sucursal/"+id);
    },
    update(id: number, data: SucursalInterface){
        return api.put("/sucursal/"+id, data);
    },
    destroy(id: number){
        api.delete("/sucursal/"+id);
    }

}