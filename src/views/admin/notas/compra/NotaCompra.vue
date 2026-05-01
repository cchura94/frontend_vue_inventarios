<template>
    <div class="grid grid-cols-1 md:grid-cols-5 gap-6 p-6">

        <div class="col-span-3 bg-white p-4 rounded-lg shadow-md">
            <div class="bg-green-700 text-white p-2">
                Lista Productos (Compra)
            </div>

            <div class="flex gap-2 mb-4">
                <Select
                    v-model="selectedSucursal"
                    :options="sucursales"
                    optionLabel="nombre"
                    optionValue="id"
                    placeholder="Seleccionar Sucursal"
                    class="w-full md:w-56"
                    @change="funListarAlmacenes()"
                />
                <Select
                    v-model="selectedAlmacen"
                    :options="almacenes"
                    optionLabel="nombre"
                    optionValue="id"
                    placeholder="Seleccionar Almacen"
                    class="w-full md:w-56"
                    @change="funListaProductos()"
                />
            </div>

            <DataTable
                :value="productos" :rows="10"
                responsiveLayout="scroll"
                class="p-datatable-sm"
            >
                <Column field="nombre" header="Producto">
                <template #body="slotProps">
                    <span class="font-medium text-gray-700">
                    {{ slotProps.data.nombre }}
                    </span>
                </template>
                </Column>

                <Column field="precio_venta" header="Precio">
                <template #body="slotProps">
                    <span class="text-blue-600 font-semibold">
                    Bs {{ slotProps.data.precio_venta }}
                    </span>
                </template>
                </Column>

                <Column field="cantidad" header="C.">
                <template #body="slotProps">
                    <span class="bg-gray-100 px-2 py-1 rounded-md text-sm">
                    {{ slotProps.data.cantidad }}
                    </span>
                </template>
                </Column>

                <Column header="Subtotal">
                <template #body="slotProps">
                    <span class="font-semibold text-gray-800">
                    Bs {{ slotProps.data.precio_venta * slotProps.data.cantidad }}
                    </span>
                </template>
                </Column>
                <Column header="accion">
                <template #body="slotProps">
                    <Button icon="pi pi-plus" @click="addCarrito(slotProps.data)" ></Button>
                </template>
                </Column>
            </DataTable>

        </div>
        <div class="col-span-2 space-y-6">

            <div class="bg-white p-4 rounded-lg shadow">
                <h2>Carrito</h2>

                <DataTable :value="carrito">
                    <Column field="nombre" header="Producto"></Column>
                    <Column field="precio" header="Precio"></Column>
                    <Column field="cantidad" header="Cant"></Column>
                     <Column header="Acción">
                        <template>
                            <Button icon="pi pi-trash"></Button>
                        </template>
                    </Column>

                </DataTable>
               
            </div>

            <div class="bg p-4 rounded-lg shadow">
                <h3>Almacen Seleccionado</h3>
                <div>
                    ID: {{selectedAlmacen}}
                </div>
            </div>

            <div class="bg-white p-4 rounded-lg shadow">
                <h3 class="font-semibold mb-2">Proveedor</h3>

                <InputText v-model="buscarProveedor" placeholder="Buscar Proveedor" @keyup.enter="listarProveedores"></InputText>

                <DataTable v-if="!proveedorSeleccionado.id" :value="proceedores">
                    <Column field="id" header="ID"></Column>
                    <Column field="razon_social" header="Razon Social"></Column>
                    <Column>
                        <template #body="slotProps">
                            <Button icon="pi pi-plus" @click="seleccionarProveedor(slotProps.data)"></Button>
                        </template>
                    </Column>
                </DataTable>
                <div v-else>
                    <p>{{ proveedorSeleccionado.razon_social }}</p>
                </div>
            </div>

            <div class="bg-white p-4 rounded-lg shadow">
                <Button label="Registrar Compra" @click="generarCompra"></Button>

            </div>

        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import type { SucursalInterface } from '../../../../types/SucursalInteface';
import type { AlmacenInterface } from '../../../../types/AlmacenInterface';
import almacenService from "../../../../services/almacen.service";
import productoService from "../../../../services/producto.service";
import clienteProveedorService from "./../../../../services/cliente.service"
import notaService from '../../../../services/nota.service';
import sucursalService from '../../../../services/sucursal.service';

const productos = ref<any[]>([]);
const selectedSucursal = ref(-1);
const selectedAlmacen = ref(-1);
const sucursales = ref<SucursalInterface[]>([]);
const almacenes = ref<AlmacenInterface[]>([]);
const cliente_selected = ref<any>({});
const totalRecords = ref<number>(0);
const carrito = ref<any>([]);
const buscarProveedor = ref("");
const proceedores = ref([]);



const buscar = ref<string>("");
const proveedorSeleccionado = ref<any>({});

    onMounted(() => {
        funListaProductos();
        listarSucursales();
    }
)


    const cargando = ref<boolean>(true);
        const lazyParams = ref<any>({});


            async function listarSucursales(){
                const {data} = await sucursalService.index();
                sucursales.value = data;
            }

    async function funListarAlmacenes() {
        const { data } = await almacenService.getBySucursal(selectedSucursal.value);
        almacenes.value = data;
    }


async function funListaProductos() {
        try {
            cargando.value = true;

            const { data } = await productoService.listar(
            lazyParams.value.page + 1,
            lazyParams.value.rows,
            buscar.value,
            selectedAlmacen.value
            );
            console.log("DATA: ", data);
            productos.value = data.data;
            totalRecords.value = data.total;
            cargando.value = false;
        } catch (error) {
            cargando.value = false;
        }
        }

        function addCarrito(prod:any){
            const index=carrito.value.findIndex((p: any) => p.id_producto === prod.id);
            if(index !== -1) {
                carrito.value[index].cantidad++;
            }else{
                carrito.value.push({
                    id_producto: prod.id,
                    nombre: prod.nombre,
                    cantidad: 1,
                    precio: prod.precio_venta
                })
            }

        }

        async function listarProveedores(){
            proveedorSeleccionado.value={};
            const {data} = await clienteProveedorService.listar(1, 10, buscarProveedor.value);
            proceedores.value = data.data;
        }

        function seleccionarProveedor(p:any){
            proveedorSeleccionado.value = p;
        }

        async function generarCompra(){

            const hoy = new Date();
    const fecha_hora_actual = hoy.toISOString().slice(0,19).replace("T", " ");

            if(!proveedorSeleccionado.value.id){
                alert("Seleccionar proveedor");
                return;
            }

            if(carrito.value.length === 0){
                alert("Carrito Vacio");
                return;
            }

            if(selectedAlmacen.value === -1){
                alert("Selecciona almacén");
                return;
            }

            const movimientos = carrito.value.map((prod: any) => ({
                almacen_id: selectedAlmacen.value,
                producto_id: prod.id_producto,
                cantidad: parseInt(prod.cantidad),
                tipo_movimiento: "ingreso",
                precio_unitario_compra: prod.precio,
                precio_unitario_venta: prod.precio,
                observaciones: "NINUNO"
                
            }));

              const datos = {
                fecha: fecha_hora_actual,
                tipo_nota: "compra",
                cliente_id: proveedorSeleccionado.value.id,
                movimientos,
                }

                await notaService.guardar(datos);

                carrito.value = [];
                proveedorSeleccionado.value = {};
                selectedAlmacen.value = -1;

                funListaProductos();
        }
</script>