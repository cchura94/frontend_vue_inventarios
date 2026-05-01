<template>
    <div class="card">
        <DataTable :value="notas" tableStyle="min-width: 50rem">
            <Column field="id" header="ID"></Column>
            <Column field="fecha" header="FECHA"></Column>
            <Column field="tipo_nota" header="TIPO NOTA">
                <template #body="slotProps">
                    <span class="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                    {{ slotProps.data.tipo_nota }}
                    </span>
                </template>
            </Column>
            <Column field="cliente" header="CLIENTE">
    <template #body="slotProps">
        <div class="flex items-start gap-3">
            
            <!-- Avatar -->
            <div class="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white font-bold">
                {{ slotProps.data.cliente?.razon_social?.charAt(0).toUpperCase() }}
            </div>

            <!-- Info -->
            <div class="flex flex-col">
                <span class="font-semibold text-gray-800 leading-tight">
                    {{ slotProps.data.cliente?.razon_social }}
                </span>

                <span class="text-xs text-gray-500">
                    CI/NIT: {{ slotProps.data.cliente?.nro_identificacion }}
                </span>

                <span class="text-xs text-gray-400">
                    {{ slotProps.data.cliente?.telefono }}
                </span>

                <!-- Badge tipo -->
                <span
                    class="mt-1 w-fit text-xs px-2 py-0.5 rounded-full"
                    :class="{
                        'bg-blue-100 text-blue-700': slotProps.data.cliente?.tipo === 'cliente',
                        'bg-purple-100 text-purple-700': slotProps.data.cliente?.tipo === 'proveedor'
                    }"
                >
                    {{ slotProps.data.cliente?.tipo }}
                </span>
            </div>

        </div>
    </template>
</Column>
            <Column field="user" header="ATENDIDO POR">
    <template #body="slotProps">
        <div class="flex items-center gap-2">
            <div class="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white text-sm font-bold">
                {{ slotProps.data.user?.name?.charAt(0).toUpperCase() }}
            </div>
            <div class="flex flex-col">
                <span class="font-medium text-gray-800">
                    {{ slotProps.data.user?.name }}
                </span>
                <span class="text-xs text-gray-500">
                    {{ slotProps.data.user?.email }}
                </span>
            </div>
        </div>
    </template>
</Column>
        <Column :exportable="false" style="min-width:8rem">
                <template #body="slotProps">
                    <Button icon="pi pi-table" outlined rounded class="mr-2" @click="mostrarNotaReciboDetalleProducto(slotProps.data)" />
                </template>
            </Column>
        </DataTable>



        <Dialog v-model:visible="visible" modal :style="{ width: '32rem' }">

<!-- HEADER CON BOTÓN IMPRIMIR -->
<template #header>
    <div class="w-full flex justify-between items-center">
        <span class="font-bold text-lg">RECIBO / DETALLE</span>

        <Button
            icon="pi pi-print"
            label="Imprimir"
            size="small"
            severity="success"
            @click="imprimir"
        />
    </div>
</template>

<!-- CONTENIDO -->
<div v-if="notaSeleccionada" id="recibo" class="bg-white p-6 font-mono text-xs">

    <!-- EMPRESA -->
    <div class="text-center border-b pb-3 mb-3">
        <h1 class="text-lg font-bold">MI EMPRESA</h1>
        <p class="text-gray-500">Sistema de Ventas</p>
    </div>

    <!-- INFO NOTA -->
    <div class="mb-3 space-y-1">
        <p><b>N°:</b> {{ notaSeleccionada.id }}</p>
        <p><b>Fecha:</b> {{ notaSeleccionada.fecha }}</p>
        <p><b>Tipo:</b> {{ notaSeleccionada.tipo_nota }}</p>
        <p><b>Atendido por:</b> {{ notaSeleccionada.user?.name }}</p>
    </div>

    <!-- CLIENTE -->
    <div class="border-t border-b py-2 mb-3">
        <p class="font-bold">CLIENTE</p>
        <p>{{ notaSeleccionada.cliente?.razon_social }}</p>
        <p>CI/NIT: {{ notaSeleccionada.cliente?.nro_identificacion }}</p>
        <p>Tel: {{ notaSeleccionada.cliente?.telefono }}</p>
    </div>

    <!-- DETALLE -->
    <div class="mb-3">

        <!-- HEADER TABLA -->
        <div class="flex justify-between font-bold border-b pb-1">
            <span class="w-24">Producto</span>
            <span>Cant</span>
            <span>Precio</span>
            <span>Subt</span>
        </div>

        <!-- ITEMS -->
        <div
            v-for="mov in notaSeleccionada.movimientos"
            :key="mov.id"
            class="flex justify-between py-1 border-b"
        >
            <!-- PRODUCTO -->
            <span class="w-24 truncate">
                {{ mov.producto?.nombre }}
            </span>

            <!-- CANTIDAD -->
            <span>
                {{ mov.pivot.cantidad }}
            </span>

            <!-- PRECIO -->
            <span>
                {{
                    notaSeleccionada.tipo_nota === 'venta'
                        ? mov.pivot.precio_unitario_venta
                        : mov.pivot.precio_unitario_compra
                }}
            </span>

            <!-- SUBTOTAL -->
            <span>
                {{
                    (
                        (
                            notaSeleccionada.tipo_nota === 'venta'
                                ? parseFloat(mov.pivot.precio_unitario_venta)
                                : parseFloat(mov.pivot.precio_unitario_compra)
                        ) * mov.pivot.cantidad
                    ).toFixed(2)
                }}
            </span>
        </div>
    </div>

    <!-- TOTAL -->
    <div class="text-right border-t pt-2">
        <p class="text-lg font-bold">
            TOTAL: {{
                notaSeleccionada.movimientos.reduce((acc: number, mov: any) => {
                    const precio =
                        notaSeleccionada.tipo_nota === 'venta'
                            ? parseFloat(mov.pivot.precio_unitario_venta)
                            : parseFloat(mov.pivot.precio_unitario_compra);

                    return acc + precio * mov.pivot.cantidad;
                }, 0).toFixed(2)
            }}
        </p>
    </div>

    <!-- FOOTER -->
    <div class="text-center mt-4 text-gray-400 text-xs">
        Gracias por su compra
    </div>

</div>

</Dialog>

    </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import notaService from '../../../services/nota.service';

const notas = ref([]); 
const visible = ref(false);

const notaSeleccionada = ref<any>(null);

function mostrarNotaReciboDetalleProducto(detalleCompraVenta: any){
    notaSeleccionada.value = detalleCompraVenta;
    visible.value = true;
}


onMounted(() => {
    funListaNotas();
});

async function funListaNotas(){
    const {data} = await notaService.listar();
    notas.value = data.data; 
}

function imprimir() {
    window.print();
}

function calcularTotal(nota: any) {
    return nota.movimientos.reduce((acc: number, mov: any) => {
        const precio =
            nota.tipo_nota === 'venta'
                ? parseFloat(mov.pivot.precio_unitario_venta)
                : parseFloat(mov.pivot.precio_unitario_compra);

        return acc + precio * mov.pivot.cantidad;
    }, 0);
}

</script>