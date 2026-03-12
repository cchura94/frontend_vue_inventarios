<template>
  <div class="card">
    <h1>Gestión de Usuarios</h1>
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
  } catch (error) {
    console.log(error);
  }
}

function funEditarUser(dataUser: UserInterface) {
  user.value = dataUser;
}
</script>
