<template>
    
    <div>
        <div class="card">

            <Toolbar class="mb-6">
                <template #start>
                    <Button label="Nuevo Producto" icon="pi pi-plus" class="mr-2" @click="abrirNuevo" />
                </template>
            
                <template #end>
                    <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" customUpload chooseLabel="Import" class="mr-2" auto :chooseButtonProps="{ severity: 'secondary' }" />
                    <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template>
            </Toolbar>
            
            <DataTable ref="dt" :value="productos" paginator lazy :loading="cargando" :totalRecords="totalRecords" :rows="10" @page="onPage($event)" :rowsPerPageOptions="[2,3,5, 10, 20, 50]" paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" currentPageReportTemplate="Mostrando {first} al {last} de {totalRecords} productos">
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Gestión Productos</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="buscar" placeholder="Buscar..." @keyup.enter="funListaProductos()" />
                        </IconField>
                    </div>
                </template>

                <Column field="id" header="ID" style="width: 2%"></Column>
                <Column field="nombre" header="Nombre" style="width: 25%"></Column>
                <Column field="marca" header="Marca" style="width: 12%"></Column>
                <Column header="Imagen">
                    <template #body="slotProps">
                        <Image :src="`${BASE_URL}/${slotProps.data.imagen}`" :alt="slotProps.data.imagen" width="250" class="w-24 rounded" preview />
                    </template>
                </Column>
            
            
                <Column field="precio_venta" header="P. Venta" style="width: 8%"></Column>
                <Column field="categoria.nombre" header="Representative" style="width: 10%"></Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-image" severity="warn" @click="funOpenDialogImage(slotProps.data)" />


                        <Button icon="pi pi-pencil" rounded class="mr-2" @click="editProduct(slotProps.data)" />
                        <!--<Button icon="pi pi-trash" variant="outlined" rounded severity="danger" @click="confirmDeleteProduct(slotProps.data)" />-->
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="Detalle Producto" :modal="true">
            <div class="flex flex-col gap-6">
                <img v-if="product.imagen" :src="`${BASE_URL}/${product.imagen}`" :alt="product.imagen" class="block m-auto pb-4" width="100" />
                <div>
                    <label for="name" class="block font-bold mb-3">Nombre</label>
                    <InputText id="name" v-model.trim="product.nombre" required="true" autofocus :invalid="submitted && !product.nombre" fluid />
                    <small v-if="submitted && !product.nombre" class="text-red-500">El nombre es obligatorio.</small>
                </div>
                <div>
                    <label for="description" class="block font-bold mb-3">Descripción</label>
                    <Textarea id="description" v-model="product.descripcion" required="true" rows="3" cols="20" fluid />
                </div>

                <div>
                    <span class="block font-bold mb-4">Categoria</span>
                    <div class="grid grid-cols-12 gap-4">

                        <div class="flex items-center gap-2 col-span-6" v-for="cat in categorias">
                            <RadioButton :id="`categoria${cat.id}`" v-model="product.categoria_id" name="categoria_id" :value="cat.id" />
                            <label :for="`categoria${cat.id}`">{{cat.nombre}}</label>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-6">
                        <label for="price" class="block font-bold mb-3">Precio Venta</label>
                        <InputNumber id="price" v-model="product.precio_venta" mode="currency" currency="USD" locale="en-US" fluid />
                    </div>
                    <div class="col-span-6">
                        <label for="marca" class="block font-bold mb-3">Marca</label>
                        <InputText id="marca" v-model.trim="product.marca" required="true" autofocus fluid />
                    </div>
                </div>
            </div>

            <template #footer>
                <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Guardar Producto" icon="pi pi-check" @click="saveProduct" />
            </template>
        </Dialog>


<Dialog v-model:visible="visibleDialogImage" modal header="Actualizar Imagen" :style="{ width: '25rem' }">
    <span class="text-surface-500 dark:text-surface-400 block mb-8">Update your information.</span>
    <FileUpload name="demo[]" customUpload @select="onFileSelect" :multiple="false" accept="image/*" :maxFileSize="1000000">
        <template #empty>
            <span>Arrastrar y soltar aquí.</span>
        </template>
    </FileUpload>
    <div class="flex justify-end gap-2">
        <Button type="button" label="Cancelar" severity="secondary" @click="visibleDialogImage = false"></Button>
    </div>
</Dialog>

    </div>

</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import productoService from '../../../../services/producto.service';
import categoriaService from '../../../../services/categoria.service';
import type { CategoriaInterface } from '../../../../types/CategoriaInteface';
import { BASE_URL } from '../../../../services/api';


const productos = ref<any[]>([]);

const cargando = ref<boolean>(true);
const totalRecords =ref<number>(0);
const lazyParams = ref<any>({}) ;
const dt = ref();
const buscar = ref<string>("");
const productDialog =ref(false);
const product = ref<any>({});
const submitted = ref<boolean>(false);
const categorias =ref<CategoriaInterface[]>([]);
const visibleDialogImage = ref<boolean>(false);
const imagenSeleccionada = ref()

onMounted(() => {
    lazyParams.value = {
        page: 0,
        first: 0,
        rows: 10
    }
    funListaProductos()
    funGetCategorias()
});

async function funListaProductos(){
    const {data} = await productoService.listar(lazyParams.value.page + 1, lazyParams.value.rows, buscar.value);
    console.log("DATA: ", data);
    productos.value = data.data;
    totalRecords.value = data.total
    cargando.value = false

}

async function funGetCategorias(){
    const {data} = await categoriaService.index();
    categorias.value = data;
}
const onPage = (event: any) => {
    lazyParams.value = event;
    funListaProductos()
}

const exportCSV = (event: any) => {
    dt.value.exportCSV();
};

const abrirNuevo = () =>{
    productDialog.value = true
}

const saveProduct = async () => {
    if(product.value.id){
        // editar
        product.value.estado = true;
        const {data} = await productoService.modificar(product.value.id, product.value);
        productDialog.value = false;
        funListaProductos()
        product.value = {};
    }else{
        product.value.estado = true;
        const {data} = await productoService.guardar(product.value);
        productDialog.value = false;
        funListaProductos()
        product.value = {};

    }
}

const hideDialog = () => {
    productDialog.value = false;
}

const editProduct = (prod: any) => {
    product.value = prod;
    productDialog.value = true;
}

const funOpenDialogImage = (prod: any) => {
    product.value = prod;
    visibleDialogImage.value = true;


}

const onFileSelect = async (event: any) => {
    imagenSeleccionada.value = event.files[0];

    const formData = new FormData();
    formData.append("imagen", imagenSeleccionada.value);

    const {data} = await productoService.actualizarImagenProducto(product.value.id, formData);
    visibleDialogImage.value = false;
    funListaProductos();
}
</script>