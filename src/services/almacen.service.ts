import api from "./api";
import type { AlmacenInterface } from "../types/AlmacenInterface";

export default {
    index() {
        return api.get(`/almacen`);
    },
    // Filtro por sucursal
    getBySucursal(sucursalId: number) {
        return api.get(`/almacen?sucursal=${sucursalId}`);
    },
    store(data: AlmacenInterface) {
        return api.post("/almacen", data);
    },
    update(id: number, data: AlmacenInterface) {
        return api.put("/almacen/" + id, data);
    },
    destroy(id: number) {
        return api.delete("/almacen/" + id);
    }
}