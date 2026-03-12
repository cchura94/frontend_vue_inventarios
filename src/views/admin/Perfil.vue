<template>

    <div class="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div class="bg-white shadow-lg rounded-lg w-full max-w-xl p-6">

            <div class="flex items-center space-x-4">
                <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="" class="w-16 h-16 rounded-full border-2 border-blue-500">
                <div>
                    <h2 class="text-xl font-semibold text-gray-800">Juan Perez</h2>
                    <p>
                        ADMIN

                    </p>

                </div>
                <div class="border-t my-4"></div>

                <div class="space-y-3 text-sm">
                    <div class="flex justify-between">
                        <span class="text-gray-500">Correo Electronico</span>
                        <span class="font-medium">{{ perfil.email }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-500">Nombre</span>
                        <span class="font-medium">{{ perfil.name }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-500">Fecha Creación</span>
                        <span class="font-medium">{{ perfil.createAt }}</span>
                    </div>

                </div>

            </div>
            <br>
            <button @click="funLogout()" class="bg-blue-500 px-4 py-2 text-white rounded-lg hover:bg-blue-900">Salir (Cerrar sesion)</button>
        </div>
    </div>

</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import {getProfile, funSalir} from "./../../services/auth.service"

const perfil = ref({});

onMounted(() => {
    obtenerPerfil()
})

async function obtenerPerfil(){
    const res = await getProfile();
    console.log(res);
    perfil.value = res;
}

async function funLogout() {
    await funSalir();
    obtenerPerfil();
}
</script>