<template>
    <div class="card p-4">
        <h2 class="text-2xl mb-4">Gestión de Almacenes</h2>

        <div class="flex gap-4 mb-6 items-end justify-between">
            <div class="flex flex-col gap-2">
                <label class="font-bold">Filtrar por Sucursal:</label>
                <Dropdown v-model="selectedSucursalFiltro" :options="sucursales" optionLabel="nombre" optionValue="id" 
                    placeholder="Seleccione Sucursal" @change="funListaAlmacenes" class="w-64" showClear />
            </div>
            
            <Button label="Nuevo Almacén" icon="pi pi-plus" @click="openNuevo" :disabled="!selectedSucursalFiltro" />
        </div>

        <DataTable :value="almacenes" tableStyle="min-width: 50rem" :loading="loading">
            <Column field="id" header="ID"></Column>
            <Column field="codigo" header="CÓDIGO"></Column>
            <Column field="nombre" header="NOMBRE"></Column>
            <Column field="descripcion" header="DESCRIPCIÓN"></Column>
            
            <Column header="Acciones" :exportable="false" style="min-width:8rem">
                <template #body="slotProps">
                    <div class="flex gap-2">
                        <Button icon="pi pi-pencil" outlined rounded severity="success" @click="openEditar(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmarEliminar(slotProps.data)" />
                    </div>
                </template>
            </Column>
            
            <template #empty> 
                <div v-if="!selectedSucursalFiltro" class="p-3 text-center text-gray-500">
                    Por favor, seleccione una sucursal para ver sus almacenes.
                </div>
                <div v-else class="p-3 text-center text-gray-500">
                    No se encontraron almacenes para esta sucursal.
                </div>
            </template>
        </DataTable>

        <Dialog v-model:visible="visibleDialog" modal :header="dialogHeader" :style="{ width: '30rem' }">
            <div class="flex flex-col gap-4 mt-2">
                <div>
                    <label for="nombre" class="block font-semibold mb-1">Nombre</label>
                    <InputText id="nombre" class="w-full" v-model="almacen.nombre" required="true" :class="{'p-invalid': submitted && !almacen.nombre}" />
                    <small class="p-error" v-if="submitted && !almacen.nombre">El nombre es requerido.</small>
                </div>
                <div>
                    <label for="codigo" class="block font-semibold mb-1">Código</label>
                    <InputText id="codigo" class="w-full" v-model="almacen.codigo" />
                </div>
                <div>
                    <label for="desc" class="block font-semibold mb-1">Descripción</label>
                    <Textarea id="desc" class="w-full" v-model="almacen.descripcion" rows="3" />
                </div>
            </div>

            <template #footer>
                <Button label="Cancelar" severity="secondary" icon="pi pi-times" @click="cerrarDialogo" />
                <Button :label="labelBotonGuardar" icon="pi pi-check" @click="funGuardarAlmacen" :loading="sending" />
            </template>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
// Importa los componentes de PrimeVue necesarios si no están globales
// import Button from 'primevue/button';
// import DataTable from 'primevue/datatable';
// import Column from 'primevue/column';
// import Dialog from 'primevue/dialog';
// import InputText from 'primevue/inputtext';
// import Textarea from 'primevue/textarea';
// import Dropdown from 'primevue/dropdown'; 

import almacenService from '../../../../services/almacen.service';
import sucursalService from '../../../../services/sucursal.service';
import type { AlmacenInterface } from '../../../../types/AlmacenInterface';
import type { SucursalInterface } from '../../../../types/SucursalInteface';

// Estados de Datos
const almacenes = ref<AlmacenInterface[]>([]);
const sucursales = ref<SucursalInterface[]>([]);
const selectedSucursalFiltro = ref<number | null>(null);

// Estados de UI
const visibleDialog = ref(false);
const loading = ref(false);
const sending = ref(false);
const submitted = ref(false);

// Estado del Formulario
const almacenBlank: AlmacenInterface = {
    nombre: "",
    codigo: "",
    descripcion: "",
    sucursal_id: null
};
const almacen = ref<AlmacenInterface>({ ...almacenBlank });

// Propiedades Computadas para textos dinámicos
const isEditing = computed(() => !!almacen.value.id);
const dialogHeader = computed(() => isEditing.value ? 'Editar Almacén' : 'Nuevo Almacén');
const labelBotonGuardar = computed(() => isEditing.value ? 'Actualizar' : 'Guardar');

onMounted(async () => {
    try {
        loading.value = true;
        // Cargamos las sucursales al iniciar para el filtro
        const { data } = await sucursalService.index();
        sucursales.value = data;
    } catch (error) {
        console.error("Error cargando sucursales:", error);
    } finally {
        loading.value = false;
    }
});

async function funListaAlmacenes() {
    if (!selectedSucursalFiltro.value) {
        almacenes.value = [];
        return;
    }
    
    try {
        loading.value = true;
        // Llamada al servicio filtrado (asegurate que exista esta ruta en backend)
        const { data } = await almacenService.getBySucursal(selectedSucursalFiltro.value);
        almacenes.value = data;
    } catch (error) {
        console.error("Error cargando almacenes:", error);
        almacenes.value = [];
    } finally {
        loading.value = false;
    }
}

// Funciones de apertura del Diálogo
const openNuevo = () => {
    almacen.value = { ...almacenBlank, sucursal_id: selectedSucursalFiltro.value };
    submitted.value = false;
    visibleDialog.value = true;
};

const openEditar = (data: AlmacenInterface) => {
    // Clonamos el objeto para no editar directamente en la tabla
    almacen.value = { ...data };
    submitted.value = false;
    visibleDialog.value = true;
};

const cerrarDialogo = () => {
    visibleDialog.value = false;
    submitted.value = false;
    almacen.value = { ...almacenBlank };
};

// Función Guardar (Crear o Actualizar)
async function funGuardarAlmacen() {
    submitted.value = true;

    // Validación básica frontal (según tu backend validate)
    if (!almacen.value.nombre || !almacen.value.sucursal_id) {
        return; 
    }

    try {
        sending.value = true;
        
        if (isEditing.value && almacen.value.id) {
            // Lógica de Actualización (PUT)
            await almacenService.update(almacen.value.id, almacen.value);
            // Opcional: Mostrar mensaje de éxito (Toast)
            console.log("Actualizado correctamente");
        } else {
            // Lógica de Creación (POST)
            await almacenService.store(almacen.value);
            // Opcional: Mostrar mensaje de éxito (Toast)
            console.log("Creado correctamente");
        }

        cerrarDialogo();
        funListaAlmacenes(); // Refrescar lista filtrada
    } catch (error: any) {
        console.error("Error al guardar:", error);
        // Aquí manejarías errores de validación del backend (422)
    } finally {
        sending.value = false;
    }
}

// Función Eliminar (Falta implementar confirmación visual tipo ConfirmDialog)
async function confirmarEliminar(data: AlmacenInterface) {
    // ESTO ES UNA IMPLEMENTACIÓN BÁSICA. Usa ConfirmDialog de PrimeVue para producción.
    if(confirm(`¿Está seguro de eliminar el almacén ${data.nombre}?`)) {
        try {
            loading.value = true;
            if(data.id) {
                await almacenService.destroy(data.id);
                funListaAlmacenes(); // Recargar lista
            }
        } catch (error) {
            console.error("Error al eliminar:", error);
        } finally {
            loading.value = false;
        }
    }
}
</script>