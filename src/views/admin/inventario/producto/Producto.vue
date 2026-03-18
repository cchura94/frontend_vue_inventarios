<template>
    <h1>Gestión Productos</h1>
    {{ productos }}

    
<DataTable :value="productos" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem">
    <Column field="id" header="ID" style="width: 25%"></Column>
    <Column field="nombre" header="Country" style="width: 25%"></Column>
    <Column field="marca" header="Company" style="width: 25%"></Column>
    <Column field="categoria.nombre" header="Representative" style="width: 25%"></Column>
</DataTable>

</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import productoService from '../../../../services/producto.service';

const productos = ref<any[]>([]);

onMounted(() => {
    funListaProductos()
});

async function funListaProductos(){
    const {data} = await productoService.listar(1, 10);
    console.log("DATA: ", data);
    productos.value = data.data;

}
</script>