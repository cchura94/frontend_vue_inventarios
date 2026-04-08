<script setup>
import { ref } from 'vue';
import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Admin',
        items: [
            {
                label: 'Administración',
                icon: 'pi pi-fw pi-home',
                to: '/admin'
            },
            {
                label: 'Perfil',
                icon: 'pi pi-fw pi-user',
                to: '/admin/perfil'
            }
        ]
    },
    {
        label: 'Usuarios',
        path: '/admin',
        items: [
            {
                label: 'Usuarios',
                icon: 'pi pi-fw pi-id-users',
                to: '/admin/users'
            },
           
        ]
    },
    {
        label: 'Inventarios',
        items: [
            {
                label: 'Categoria',
                icon: 'pi pi-fw pi-box',
                to: '/admin/categoria'
            },
            {
                label: 'Producto',
                icon: 'pi pi-fw pi-table',
                to: '/admin/producto'
            },
            {
                label: 'Sucursales',
                icon: 'pi pi-fw pi-circle',
                to: '/admin/sucursal'
            },
            {
                label: 'Almacenes',
                icon: 'pi pi-fw pi-circle',
                to: '/admin/almacen'
            }
        ]
    },
    {
        label: 'Compras & Ventas',
        items: [
            {
                label: 'Nueva Compra',
                icon: 'pi pi-fw pi-box',
                to: '/admin/notas/nueva-compra'
            },
            {
                label: 'Nueva Venta',
                icon: 'pi pi-fw pi-table',
                to: '/admin/notas/nueva-venta'
            },
            {
                label: 'Lista de Compras y Ventas',
                icon: 'pi pi-fw pi-circle',
                to: '/admin/sucursal'
            }
        ]
    },
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
