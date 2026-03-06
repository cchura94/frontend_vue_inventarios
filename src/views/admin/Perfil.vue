<template>
    <h1>Mi Perfil</h1>
    {{ perfil }}
    <br>
    <button @click="funLogout()">Salir (Cerrar sesion)</button>
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