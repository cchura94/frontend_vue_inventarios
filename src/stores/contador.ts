import { defineStore } from 'pinia'

export const useContadorStore = defineStore('contador', {
    state: () => {
        return {
            cont:1
        }
    },
    actions: {
        incrementar(){
            this.cont++;
        },
        decrementar(){
            this.cont--;
        }
    }
});