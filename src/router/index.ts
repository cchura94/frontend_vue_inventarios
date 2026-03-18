import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import Inicio from "../views/web/Inicio.vue";
import Nosotros from "../views/web/Nosotros.vue";
import Servicios from "../views/web/Servicios.vue";
import Login from "../views/auth/Login.vue";
import Perfil from "../views/admin/Perfil.vue";
import Users from "../views/admin/users/Users.vue";
import AppLayout from "../layout/AppLayout.vue";
import WebLayout from "../components/WebLayout.vue";
import Categoria from "../views/admin/inventario/categoria/Categoria.vue";
import Producto from "../views/admin/inventario/producto/Producto.vue";


const routes: Array<RouteRecordRaw>  = [
    {
        path: '/',
        component: WebLayout,
        children: [
            {
                path: '/',
                component: Inicio
            },
            { path: '/acerca-de-nosotros', component: Nosotros },
            { path: '/servicios', component: Servicios },
            { path: '/auth/login', component: Login, name: 'Login', meta: {redirectIfAuth: true} },
        ]
    },    
    {
        path: '/admin',
        component: AppLayout,
        children: [
            {
                path: 'perfil', component: Perfil, name: 'Perfil', meta: {requireAuth: true},
            },
            {
                path: 'users', component: Users, name: 'Users', meta: {requireAuth: true},
            },
            {
                path: 'categoria', component: Categoria, name: 'Categoria', meta: {requireAuth: true},
            },
            {
                path: 'producto', component: Producto, name: 'Producto', meta: {requireAuth: true},
            },
        ]
    }

    
];

const router = createRouter({
    history: createWebHistory(),
    routes: routes
});


router.beforeEach((to, from, next) => {
    const token = localStorage.getItem("access_token");

    if(to.meta.requireAuth){
        if(!token){
            return next({name: 'Login'})
        }else{
            return next();
        }
    }

    if(to.meta.redirectIfAuth && token){
        return next({name: 'Perfil'});
    }

    return next();
})


export default router;