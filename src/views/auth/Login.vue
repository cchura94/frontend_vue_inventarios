<template>
    <div>
        
        <h1>Ingresar</h1>
        <label for="">Ingrese Correo</label>
        <input type="email" v-model="credenciales.email">
        <br>
        <label for="">Ingrese Contraseña</label>
        <input type="password" v-model="credenciales.password">
        <br>
        <button type="button" @click="funIngresar()">Ingresar</button>
        <br>
        {{credenciales}}
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { loginLaravel, loginNest } from './../../services/auth.service'


const credenciales = ref({email: "", password: ""});

async function funIngresar(){
    const respuesta = await loginLaravel(credenciales.value.email, credenciales.value.password);
    console.log(respuesta);
}


</script>