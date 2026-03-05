import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import Inicio from "../views/web/Inicio.vue";
import Nosotros from "../views/web/Nosotros.vue";
import Servicios from "../views/web/Servicios.vue";
import Login from "../views/auth/Login.vue";

const routes: Array<RouteRecordRaw>  = [
    {
        path: '/',
        component: Inicio
    },
    { path: '/acerca-de-nosotros', component: Nosotros },
    { path: '/servicios', component: Servicios },
    { path: '/auth/login', component: Login }
];

const router = createRouter({
    history: createWebHistory(),
    routes: routes
});


export default router;