<template>
    <div class="card">
        <h1>Gestión Categorias</h1>

    
<Button label="Nueva Categoria" @click="visibleCat = true" />

<Dialog v-model:visible="visibleCat" modal header="Gestión Categorias" :style="{ width: '25rem' }">
    <span class="text-surface-500 dark:text-surface-400 block mb-8">Ingrese Datos para categoria.</span>
    <div class="flex items-center gap-4 mb-4">
        <label for="nom" class="font-semibold w-24">Nombre</label>
        <InputText id="nom" class="flex-auto" autocomplete="off" v-model="categoria.nombre" />
    </div>
    <div class="flex items-center gap-4 mb-8">
        <label for="det" class="font-semibold w-24">Detalle</label>
        <InputText id="det" class="flex-auto" autocomplete="off" v-model="categoria.descripcion" />
    </div>
    <div class="flex justify-end gap-2">
        <Button type="button" label="Cancelar" severity="secondary" @click="visibleCat = false"></Button>
        <Button type="button" label="Guardar" @click="funGuardarCategoria()"></Button>
    </div>
</Dialog>


<DataTable :value="categorias" tableStyle="min-width: 50rem">
    <Column field="id" header="ID"></Column>
    <Column field="nombre" header="Nombre"></Column>
    <Column field="descripcion" header="DETALLE"></Column>
    <Column :exportable="false" style="min-width: 12rem">
        <template #body="slotProps">
            <Button icon="pi pi-pencil" rounded class="mr-2" @click="editCategoria(slotProps.data)" />
            <Button icon="pi pi-trash" rounded severity="danger" @click="confirmDeleteCategoria(slotProps.data)" />
        </template>
    </Column>
</DataTable>

    {{ categorias }}


    </div>
     

</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import categoriaService from '../../../../services/categoria.service';
import type { CategoriaInterface } from '../../../../types/CategoriaInteface';

const categorias = ref<CategoriaInterface[]>([]);
const visibleCat = ref<boolean>(false);
const categoria = ref<CategoriaInterface>({nombre: ""}); 
const _id_cat = ref<number>(-1)

onMounted(() => {
    getListaCategorias();
})

async function getListaCategorias(){

    try {
        const {data} = await categoriaService.index();
    
        categorias.value = data;
        
    } catch (error) {
        console.log(error);
    }

}

async function funGuardarCategoria(){
    try {
        if(_id_cat.value){
            await categoriaService.update(_id_cat.value, categoria.value);

            getListaCategorias();
    
    categoria.value = {nombre: ""}
    getListaCategorias();
    visibleCat.value = false;

        }else{

            await categoriaService.store(categoria.value);
    
            getListaCategorias();
    
            categoria.value = {nombre: ""}
            getListaCategorias();
            visibleCat.value = false;
        }
        
    } catch (error) {
        console.log(error);
    }
}

async function editCategoria(cate: CategoriaInterface){
    categoria.value = cate;
    visibleCat.value = true;

    _id_cat.value = cate.id || -1

}
    
async function confirmDeleteCategoria(prod: CategoriaInterface){

}
</script>