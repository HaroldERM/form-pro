<template>
  <!-- Contenedor principal de la aplicación -->
  <div id="app">
    <!-- Sección visible si el usuario está autenticado -->
    <div v-if="isAuthenticated">
      <!-- Barra de navegación con enlaces y botón de cierre de sesión -->
      <nav>
        <router-link to="/reports">Reportes</router-link>
        <router-link to="/form-builder">Crear Nuevo Formulario</router-link>
        <button class="logout-button" @click="handleLogout">
          <!-- Icono de cierre de sesión utilizando el componente SvgIcon -->
          <svg-icon type="mdi" :path="path"></svg-icon>
        </button>
      </nav>
      <!-- Área de visualización de las vistas de las rutas -->
      <router-view />
    </div>
    <!-- Sección visible si el usuario no está autenticado -->
    <router-view v-else />
  </div>
</template>

<script>
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiLogout } from "@mdi/js";
import "@/styles/styles.css";

export default {
  // Componentes utilizados en el template
  components: {
    SvgIcon,
  },
  // Datos del componente
  data() {
    return {
      path: mdiLogout,
    };
  },
  // Propiedad computada que verifica si el usuario está autenticado
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
  },
  // Métodos del componente
  methods: {
    // Maneja el evento de cierre de sesión
    handleLogout() {
      this.$store
        .dispatch("logout")
        .then(() => {
          // Redirige al usuario a la página de inicio de sesión después del cierre de sesión
          this.$router.push("/login");
        })
        .catch((error) => {
          console.error("Error al cerrar sesión:", error.message);
        });
    },
  },
};
</script>
