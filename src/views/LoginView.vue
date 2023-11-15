<template>
  <!-- Contenedor principal de la página de inicio de sesión -->
  <div class="login">
    <!-- Título de la página de inicio de sesión -->
    <h2>Login</h2>
    <!-- Botón de inicio de sesión con Google -->
    <button class="google-button" @click="loginWithGoogle">
      <!-- Icono de Google utilizando el componente SvgIcon -->
      <svg-icon type="mdi" :path="path" class="google-icon"></svg-icon>
      <!-- Texto del botón -->
      <p class="google-text">Continuar con Google</p>
    </button>
  </div>
</template>

<script>
// Importa funciones de autenticación de Firebase, componente SvgIcon y icono de Google
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiGoogle } from "@mdi/js";
import "@/styles/styles.css";

export default {
  // Componentes utilizados en el template
  components: {
    SvgIcon,
  },
  // Datos del componente
  data() {
    return {
      path: mdiGoogle,
    };
  },
  // Métodos del componente
  methods: {
    // Maneja el evento de inicio de sesión con Google
    async loginWithGoogle() {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();

      try {
        // Inicia sesión con Google utilizando una ventana emergente
        await signInWithPopup(auth, provider);
        // Redirige al usuario a la página de reports después del inicio de sesión exitoso
        this.$router.push("/reports");
      } catch (error) {
        // Maneja errores de autenticación, por ejemplo, muestra un mensaje de error al usuario
        console.error("Error de autenticación:", error.message);
      }
    },
  },
};
</script>
