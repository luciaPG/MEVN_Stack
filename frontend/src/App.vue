<template>
  <div id="app">
    <!-- Reemplazar la navegación existente por el componente NavBar -->
    <NavBar />

    <!-- Contenedor principal con margen superior para evitar que el contenido quede bajo la navbar fija -->
    <div class="content-container">
      <router-view />
    </div>
  </div>
</template>

<script>
import { inject, computed } from "vue";
import NavBar from "./components/NavBar.vue"; // Importar el componente NavBar
import { provideAuth } from "./store/AuthContext"; // Importar provideAuth si es necesario

export default {
  components: {
    NavBar, // Registrar el componente
  },
  setup() {
    // Proporcionar el contexto de autenticación
    provideAuth(); // Asegúrate de que esta función esté definida en AuthContext.js

    // Mantener la lógica existente para la compatibilidad
    const auth = inject("auth");

    const isAuthenticated = computed(() => {
      return !!localStorage.getItem("jwt");
    });

    const handleLogout = () => {
      auth.logout();
    };

    return {
      isAuthenticated,
      handleLogout,
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

/* Añadir margen superior para el contenido principal */
.content-container {
  padding-top: 80px; /* Ajusta este valor según la altura de tu NavBar */
}

/* Puedes mantener estos estilos para otras áreas que no sean la navegación principal */
nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
