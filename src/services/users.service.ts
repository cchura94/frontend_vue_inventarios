import api from "./api";
import type { UserInterface } from "../types/UserInteface";

export default {

    index(){
        return api.get(`/user`);
    },
    store(data: UserInterface){
        return api.post("/user", data);
    },
    show(id: number){
        return api.get("/user/"+id);
    },
    update(id: number, data: UserInterface){
        return api.put("/user/"+id, data);
    },
    destroy(id: number){
        api.delete("/user/"+id);
    }

}