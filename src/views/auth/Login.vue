<template>
    <!--
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
    -->
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT8jLwzlR2_OvXsZVO4J6lBauMAQGkPAbjCg&s" alt="" width="50%">
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Bienvenido!</div>
                        <span class="text-muted-color font-medium">Para continuar Ingrese sus Credenciales</span>
                    </div>

                    <div>
                        <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Correo Electrónico</label>
                        <InputText id="email1" type="text" placeholder="Correo Electronico" class="w-full md:w-[30rem] mb-8" v-model="credenciales.email" />

                        <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                        <Password id="password1" v-model="credenciales.password" placeholder="Ingrese Contraseña" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>

                        <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                            <div class="flex items-center">
                                <Checkbox id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Remember me</label>
                            </div>
                            <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Forgot password?</span>
                        </div>
                        <Button label="Ingresar" class="w-full" @click="funIngresar()"></Button>
                    </div>
                </div>
            </div>
        </div>
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