<template>
  <p><strong>Url Actual:</strong> {{ $route.fullPath }}</p>
  <nav>
    <RouterLink to="/">INICIO</RouterLink> |
    <RouterLink to="/acerca-de-nosotros">Acerca de Nosotros</RouterLink> |
    <RouterLink to="/servicios">Servicios</RouterLink> |
    <RouterLink to="/auth/login">Ingresar</RouterLink>

  </nav>
  <main>
    <RouterView />
  </main>
</template>