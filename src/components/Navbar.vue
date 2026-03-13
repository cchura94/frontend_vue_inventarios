<template>
    <nav class="bg-white shadow-md">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16 items-center">
  
          <!-- Logo -->
          <div class="flex items-center">
            <RouterLink 
              to="/" 
              class="text-xl font-bold text-indigo-600"
            >
              MiApp
            </RouterLink>
          </div>
  
          <!-- Menu Desktop -->
          <div class="hidden md:flex space-x-6">
            <RouterLink to="/" class="nav-link">Inicio</RouterLink>
            <RouterLink to="/acerca-de-nosotros" class="nav-link">
              Acerca de Nosotros
            </RouterLink>
            <RouterLink to="/servicios" class="nav-link">
              Servicios
            </RouterLink>
            <RouterLink to="/auth/login" class="nav-link">
              Ingresar
            </RouterLink>
            <RouterLink to="/admin/users" class="nav-link">
              Usuarios
            </RouterLink>
          </div>
  
          <!-- Botón móvil -->
          <button 
            @click="menuOpen = !menuOpen"
            class="md:hidden text-gray-600 focus:outline-none"
          >
            ☰
          </button>
        </div>
      </div>
  
      <!-- Menu Mobile -->
      <div v-if="menuOpen" class="md:hidden px-4 pb-4 space-y-2">
        <RouterLink to="/" class="mobile-link">Inicio</RouterLink>
        <RouterLink to="/acerca-de-nosotros" class="mobile-link">
          Acerca de Nosotros
        </RouterLink>
        <RouterLink to="/servicios" class="mobile-link">
          Servicios
        </RouterLink>
        <RouterLink to="/auth/login" class="mobile-link">
          Ingresar
        </RouterLink>
        <RouterLink to="/admin/users" class="mobile-link">
          Usuarios
        </RouterLink>
      </div>
    </nav>
  </template>
  
  <script setup lang="ts">
  import { ref } from "vue"
  
  const menuOpen = ref(false)
  </script>
  