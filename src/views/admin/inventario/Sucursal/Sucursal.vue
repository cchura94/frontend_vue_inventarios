<template>
    <div class="card p-4">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">Gestión de Sucursales</h2>
            <Button label="Nueva Sucursal" icon="pi pi-plus" @click="openNuevo" />
        </div>

        <Dialog v-model:visible="visibleDialog" modal :header="isEditing ? 'Editar Sucursal' : 'Nueva Sucursal'" :style="{ width: '30rem' }">
            <span class="text-surface-500 dark:text-surface-400 block mb-6">
                {{ isEditing ? 'Modifique los campos necesarios.' : 'Complete la información de la nueva sucursal.' }}
            </span>
            
            <div class="flex flex-col gap-4">
                <div class="flex flex-col gap-1">
                    <label for="nombre" class="font-semibold">Nombre</label>
                    <InputText id="nombre" class="w-full" autocomplete="off" v-model="sucursal.nombre" />
                </div>
                <div class="flex flex-col gap-1">
                    <label for="direccion" class="font-semibold">Dirección</label>
                    <InputText id="direccion" class="w-full" autocomplete="off" v-model="sucursal.direccion" />
                </div>
                <div class="flex flex-col gap-1">
                    <label for="ciudad" class="font-semibold">Ciudad</label>
                    <InputText id="ciudad" class="w-full" autocomplete="off" v-model="sucursal.ciudad" />
                </div>
            </div>
            
            <template #footer>
                <Button type="button" label="Cancelar" severity="secondary" @click="cerrarDialogo"></Button>
                <Button type="button" :label="isEditing ? 'Actualizar' : 'Guardar'" @click="funGuardarSucursal" :loading="loading"></Button>
            </template>
        </Dialog>

        <DataTable :value="sucursales" tableStyle="min-width: 50rem" scrollable scrollHeight="400px">
            <Column field="id" header="ID" style="width: 10%"></Column>
            <Column field="nombre" header="NOMBRE SUCURSAL"></Column>
            <Column field="direccion" header="DIRECCIÓN"></Column>
            <Column field="ciudad" header="CIUDAD"></Column>
            
            <Column header="Acciones" style="width: 15%">
                <template #body="slotProps">
                    <div class="flex gap-2">
                        <Button icon="pi pi-pencil" severity="success" rounded outlined @click="openEditar(slotProps.data)" />
                        <Button icon="pi pi-trash" severity="danger" rounded outlined @click="confirmarEliminar(slotProps.data)" />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import sucursalService from '../../../../services/sucursal.service';
import type { SucursalInterface } from '../../../../types/SucursalInteface';

// Estados
const sucursales = ref<SucursalInterface[]>([]);
const visibleDialog = ref(false);
const loading = ref(false);

const sucursalBlank: SucursalInterface = { nombre: "", direccion: "", ciudad: "" };
const sucursal = ref<SucursalInterface>({ ...sucursalBlank });

// Propiedad computada para identificar el modo
const isEditing = computed(() => !!sucursal.value.id);

onMounted(() => {
    funListaSucursales();
});

async function funListaSucursales() {
    const { data } = await sucursalService.index();
    sucursales.value = data;
}

// Abrir para crear
const openNuevo = () => {
    sucursal.value = { ...sucursalBlank };
    visibleDialog.value = true;
};

// Abrir para editar (Copia los datos de la fila al formulario)
const openEditar = (data: SucursalInterface) => {
    sucursal.value = { ...data };
    visibleDialog.value = true;
};

const cerrarDialogo = () => {
    visibleDialog.value = false;
    sucursal.value = { ...sucursalBlank };
};

async function funGuardarSucursal() {
    try {
        loading.value = true;
        
        if (isEditing.value && sucursal.value.id) {
            // Lógica de Edición
            await sucursalService.update(sucursal.value.id, sucursal.value);
        } else {
            // Lógica de Creación
            await sucursalService.store(sucursal.value);
        }

        cerrarDialogo();
        funListaSucursales(); 
    } catch (error) {
        console.error("Error al procesar sucursal:", error);
    } finally {
        loading.value = false;
    }
}

async function confirmarEliminar(data: SucursalInterface) {
    if (confirm(`¿Desea eliminar la sucursal ${data.nombre}?`)) {
        try {
            if (data.id) {
                await sucursalService.destroy(data.id);
                funListaSucursales();
            }
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    }
}
</script>