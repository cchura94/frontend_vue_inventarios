<template>
  <div class="card">
    <h1>Gestión de Usuarios</h1>

    <Button label="Nuevo Usuario" @click="visible = true" />

    <Dialog v-model:visible="visible" modal header="Editar Usuario" :style="{ width: '25rem' }">
        <span class="text-surface-500 dark:text-surface-400 block mb-8">Actualiza los datos.</span>
        <div class="flex items-center gap-4 mb-4">
            <label for="name" class="font-semibold w-24">Nombre</label>
            <InputText id="name" class="flex-auto" autocomplete="off" v-model="user.name" />
        </div>
        <div class="flex items-center gap-4 mb-8">
            <label for="email" class="font-semibold w-24">Correo</label>
            <InputText id="email" class="flex-auto" autocomplete="off" v-model="user.email" />
        </div>
        <div class="flex items-center gap-4 mb-8">
            <label for="password" class="font-semibold w-24">Contraseña</label>
            <Password id="password" class="flex-auto" :feedback="false" v-model="user.password" />
        </div>
        <div class="flex justify-end gap-2">
            <Button type="button" label="Cancelar" severity="secondary" @click="visible = false"></Button>
            <Button type="button" label="Guardar Cambios" @click="funGuardarUsuario()"></Button>
        </div>
    </Dialog>


    <DataTable :value="users" tableStyle="min-width: 50rem">
        <Column field="id" header="ID"></Column>
        <Column field="name" header="Name"></Column>
        <Column field="email" header="Correo"></Column>
        <Column :exportable="false" style="min-width: 12rem">
            <template #body="slotProps">
                <Button icon="pi pi-pencil" rounded class="mr-2" @click="funEditarUser(slotProps.data)"  />
                <Button icon="pi pi-trash" variant="outlined" rounded severity="danger"  />
            </template>
        </Column>
    </DataTable>

    <div>
      <label for="nom">Ingrese Nombre:</label>
      <input type="text" v-model="user.name" />
      <br />
      <label for="correo">Ingrese Correo:</label>
      <input type="email" v-model="user.email" />
      <br />
      <label for="correo">Ingrese Contraseña:</label>
      <input type="password" v-model="user.password" />
      <br />
      <button @click="funGuardarUsuario()">Guardar Usuario</button>
    </div>
    <table border="1">
      <thead>
        <tr>
          <th>ID</th>
          <th>NAME</th>
          <th>CORREO</th>
          <th>ACCIONES</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(usuario, index) in users" :key="index">
          <td>{{ usuario.id }}</td>
          <td>{{ usuario.name }}</td>
          <td>{{ usuario.email }}</td>
          <td>
            <button @click="funEditarUser(usuario)">editar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import usersService from "../../../services/users.service";
import type { UserInterface } from "../../../types/UserInteface";

const userDataBlank = { name: "", email: "", password: "" };

const users = ref<UserInterface[]>([]);
const user = ref<UserInterface>({ ...userDataBlank });

  const visible = ref<boolean>(false)

onMounted(() => {
  funListarUsuarios();
});

async function funListarUsuarios() {
  const { data } = await usersService.index();
  users.value = data.data;
}

async function funGuardarUsuario() {
  try {
    if (user.value.id) {
      // modificar
      await usersService.update(user.value.id, user.value);
      funListarUsuarios();
    } else {
      const { data } = await usersService.store(user.value);
      funListarUsuarios();
    }
    user.value = { ...userDataBlank };
    visible.value = false;
  } catch (error) {
    console.log(error);
  }
}

function funEditarUser(dataUser: UserInterface) {
  user.value = dataUser;
  visible.value = true;
}
</script>
