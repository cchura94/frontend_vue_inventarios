<template>
  <div class="grid grid-cols-1 md:grid-cols-5 gap-6 p-6">
    <div class="col-span-3 md:col-span-3 bg-white p-4 rounded-lg shadow-md">
      <div class="bg-blue-700 text-white p-2">Lista Productos</div>
      <Toolbar class="mb-6">
        <template #end>
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
        </template>
      </Toolbar>
      <DataTable
        ref="dt"
        :value="productos"
        paginator
        lazy
        :loading="cargando"
        :totalRecords="totalRecords"
        :rows="10"
        @page="onPage($event)"
        :rowsPerPageOptions="[2, 3, 5, 10, 20, 50]"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Mostrando {first} al {last} de {totalRecords} productos"
      >
        <template #header>
          <div class="flex flex-wrap gap-2 items-center justify-between">
            <h4 class="m-0">Productos</h4>
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText
                v-model="buscar"
                placeholder="Buscar..."
                @keyup.enter="funListaProductos()"
              />
            </IconField>
          </div>
        </template>

        <Column field="nombre" header="Nombre" style="width: 25%"></Column>
        <Column field="marca" header="Marca" style="width: 12%"></Column>
        <Column header="Imagen">
          <template #body="slotProps">
            <Image
              :src="`${BASE_URL}/${slotProps.data.imagen}`"
              :alt="slotProps.data.imagen"
              class="w-16 rounded"
              preview
            />
          </template>
        </Column>

        <Column
          field="precio_venta"
          header="P. Venta"
          style="width: 3%"
        ></Column>
        <Column
          field="categoria.nombre"
          header="Categoria"
          style="width: 2%"
        ></Column>
        <Column :exportable="false" style="min-width: 5rem">
          <template #body="slotProps">
            <div class="productos">
              <div>
                <p v-if="getStock(slotProps.data)>0">Stock: {{getStock(slotProps.data)}}</p>
                <p v-else>AGOTADO</p>
  
              </div>
            </div>
            <Button
              :disabled="getStock(slotProps.data) === 0"
              icon="pi pi-plus"
              rounded
              class="mr-2"
              @click="addCarrito(slotProps.data)"
            />
            <!--<Button icon="pi pi-trash" variant="outlined" rounded severity="danger" @click="confirmDeleteProduct(slotProps.data)" />-->
          </template>
        </Column>
      </DataTable>
    </div>
    <div class="col-span-2 bg-white p-2 rounded-lg shadow-md">
      <div class="mb-6">
        <!-- Header -->
        <div
          class="flex items-center justify-between bg-blue-600 text-white px-2 py-1 rounded-t-xl shadow"
        >
          <h2 class="text-lg font-semibold">🛒 Carrito</h2>
          <span class="text-sm bg-white text-blue-600 px-2 py-1 rounded-full">
            {{ carrito.length }} items
          </span>
        </div>

        <!-- Tabla -->
        <div class="bg-white rounded-b-xl shadow p-2">
          <DataTable
            :value="carrito"
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
                <Button icon="pi pi-trash" severity="danger" @click="quitarCarrito(slotProps.data.id)"></Button>
              </template>
            </Column>
          </DataTable>

          <!-- Total -->
          <div class="flex justify-end mt-4 border-t pt-3">
            <div class="text-right">
              <p class="text-sm text-gray-500">Total</p>
              <p class="text-xl font-bold text-blue-600">
                Bs {{ totalCarrito }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="mb-6">
        <div class="bg-blue-500 text-white p-2">Datos Clientes</div>

        <Button
          label="Crear Nuevo Cliente"
          @click="visibleDialogCliente = true"
        />
        <InputText
          class="m-3"
          v-model="buscar_cliente"
          placeholder="Buscar Cliente..."
          @keyup.enter="funListarClienteProveedor()"
        />

        <DataTable :value="clientes" tableStyle="min-width: 5rem" v-if="!cliente_selected.id">
          <Column field="id" header="ID"></Column>
          <Column field="tipo" header="Tipo"></Column>
          <Column field="razon_social" header="Razon Social"></Column>
          <Column field="nro_identificacion" header="Nro Identificacion"></Column>
          <Column :exportable="false" style="min-width: 5rem">
            <template #body="slotProps">
              <Button
                icon="pi pi-plus"
                rounded
                class="mr-2"
                @click="seleccionarCliente(slotProps.data)"
              />
              <!--<Button icon="pi pi-trash" variant="outlined" rounded severity="danger" @click="confirmDeleteProduct(slotProps.data)" />-->
            </template>
          </Column>      
        </DataTable>
        <div v-else>
          <h4>Cliente: {{ cliente_selected.razon_social }}</h4>
          <h4>nro_identificacion: {{ cliente_selected.nro_identificacion }}</h4>
          
        </div>

        <Dialog
          v-model:visible="visibleDialogCliente"
          modal
          header="Cliente/Proveedor"
          :style="{ width: '25rem' }"
        >
          <span class="block mb-4">Registrar datos</span>

          <div class="flex items-center gap-4 mb-3">
            <label class="w-32">Tipo</label>
            <InputText
              v-model="formCliente.tipo"
              placeholder="proveedor o cliente"
            />
          </div>

          <div class="flex items-center gap-4 mb-3">
            <label class="w-32">Razón Social</label>
            <InputText v-model="formCliente.razon_social" />
          </div>

          <div class="flex items-center gap-4 mb-3">
            <label class="w-32">Nro ID</label>
            <InputText v-model="formCliente.nro_identificacion" />
          </div>

          <div class="flex items-center gap-4 mb-3">
            <label class="w-32">Teléfono</label>
            <InputText v-model="formCliente.telefono" />
          </div>

          <div class="flex items-center gap-4 mb-3">
            <label class="w-32">Dirección</label>
            <InputText v-model="formCliente.direccion" />
          </div>

          <div class="flex items-center gap-4 mb-4">
            <label class="w-32">Estado</label>
            <InputText v-model="formCliente.estado" />
          </div>

          <div class="flex justify-end gap-2">
            <Button
              label="Cancel"
              severity="secondary"
              @click="visibleDialogCliente = false"
            />
            <Button label="Guardar Cliente" @click="guardarClienteProveedor" />
          </div>
        </Dialog>
      </div>
      <div class="mb-6">
        <div class="bg-blue-500 text-white p-2">Generar Pedido</div>
        
        <Button label="Registrar Venta" @click="generarVenta" />

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import productoService from "../../../../services/producto.service";

import sucursalService from "../../../../services/sucursal.service";
import almacenService from "../../../../services/almacen.service";
import clienteProveedorService from "../../../../services/cliente.service";

import { BASE_URL } from "../../../../services/api";
import type { SucursalInterface } from "../../../../types/SucursalInteface";
import type { AlmacenInterface } from "../../../../types/AlmacenInterface";
import notaService from "../../../../services/nota.service";

const productos = ref<any[]>([]);
const carrito = ref<any[]>([]);

const cargando = ref<boolean>(true);
const totalRecords = ref<number>(0);
const lazyParams = ref<any>({});
const dt = ref();
const buscar = ref<string>("");
const buscar_cliente = ref<string>("")
const clientes = ref<any[]>([])
const selectedSucursal = ref(-1);
const selectedAlmacen = ref(-1);
const sucursales = ref<SucursalInterface[]>([]);
const almacenes = ref<AlmacenInterface[]>([]);
const cliente_selected = ref<any>({});

const visibleDialogCliente = ref(false);
const formCliente = ref<any>({});

onMounted(() => {
  lazyParams.value = {
    page: 0,
    first: 0,
    rows: 10,
  };
  funListaProductos();
  funListaSucursal();
});

async function funListaSucursal() {
  const { data } = await sucursalService.index();

  sucursales.value = data;
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

function getStock(producto: any){
  // if(!producto.almacenes || producto.almacenes.length === 0) return 0;

  console.log("CALCULANDO", producto.almacenes.length);
  return producto.almacenes.reduce((total: number, almacen: any) => {
    
    return total + (almacen.pivot?.cantidad_actual || 0);
  }, 0);
}

async function funListarAlmacenes() {
  const { data } = await almacenService.getBySucursal(selectedSucursal.value);
  almacenes.value = data;
}

const onPage = (event: any) => {
  lazyParams.value = event;
  funListaProductos();
};

const funListarClienteProveedor = async () => {
  cliente_selected.value = {};
  const {data} = await clienteProveedorService.listar(1, 10, buscar_cliente.value);
  clientes.value = data.data;
}

function addCarrito(prod: any) {
  const stockDisponible = getStock(prod);
  let posicion = carrito.value.findIndex((p) => {
    return p.id === prod.id;
  });
  if (posicion >= 0) {
    if(carrito.value[posicion].cantidad < stockDisponible){
      carrito.value[posicion].cantidad++;
    }else{
      alert("No hay suficiente stock disponible");
    }
  } else {
    if(stockDisponible>0){
      carrito.value.push({ ...prod, cantidad: 1 });

    }else{
      alert("Producto agotado");
    }
  }
}

async function generarVenta() {
  try {
    const hoy = new Date();
    const fecha_hora_actual = hoy.toISOString().slice(0,19).replace("T", " ");

    if(!cliente_selected.value.id || carrito.value.length === 0){
      alert("Faltan datos");
      return;
    }

    const movimientos = carrito.value.map((prod) => ({
      producto_id: prod.id,
      almacen_id: selectedAlmacen.value,
      cantidad: parseInt(prod.cantidad),
      tipo_movimiento: "salida",
      precio_unitario_compra: 0,
      precio_unitario_venta: prod.precio_venta,
      observaciones: "NINUNO"
      
    }));

    const datos = {
      fecha: fecha_hora_actual,
      tipo_nota: "venta",
      cliente_id: cliente_selected.value.id,
      estado_nota: "NINGUNO",
      observaciones: "NINGUNO",
      movimientos,
      
    }

    await notaService.guardar(datos);

    carrito.value = [];
    cliente_selected.value = {};
    selectedAlmacen.value = -1;

    funListaProductos()
  } catch (error) {
    console.log(error);
  }
  
}

async function guardarClienteProveedor() {
  try {
    const {data} = await clienteProveedorService.guardar(formCliente.value);
    cliente_selected.value = data.data;

    formCliente.value = {}
    visibleDialogCliente.value = false;
  } catch (error) {
    console.log(error);
  }
}

const seleccionarCliente = (clie: any) => {
  cliente_selected.value = clie;
}

const totalCarrito = computed(() => {
  return carrito.value.reduce((acc, item) => {
    return acc + item.precio_venta * item.cantidad;
  }, 0);
});

function quitarCarrito(id: number){
  carrito.value = carrito.value.filter((p) => p.id !== id);
}
</script>
