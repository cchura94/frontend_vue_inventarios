<template>
    <div>
        <h1>Ingresar</h1>
        <label for="">Ingrese Correo</label>
        <input type="email" v-model="credenciales.email">
        <small v-if="errors.email">{{ errors.email }}</small>
        <br>
        <label for="">Ingrese Contraseña</label>
        <input type="password" v-model="credenciales.password">
        <small v-if="errors.password">{{ errors.password }}</small>

        <br>
        <button type="button" @click="funIngresar()">Ingresar</button>
        <br>
        {{credenciales}}
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { loginLaravel, loginNest } from './../../services/auth.service'
import { useRoute, useRouter } from 'vue-router';
import { isAxiosError } from 'axios';

const credenciales = ref({email: "", password: ""});
const errors = ref<any>({})

const router = useRouter()

async function funIngresar(){
    try {
        const { data } = await loginLaravel(credenciales.value.email, credenciales.value.password);
        console.log(data);
        localStorage.setItem("access_token", data.access_token)
        router.push("/admin/perfil");
        
    } catch (error: unknown) {
        if(isAxiosError(error)){
            errors.value = error.response?.data.errors;
        }
    }

}


</script>