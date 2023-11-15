<template>
  <!-- Página de Reportes -->
  <div>
    <!-- Título de la página -->
    <h2 class="tittle-form">Reportes</h2>
    <!-- Listado de formularios -->
    <ul class="form-list">
      <!-- Itera sobre los formularios y muestra detalles y opciones para cada uno -->
      <li
        v-for="formulario in formularios"
        :key="formulario.id"
        class="form-item"
      >
        {{ formulario.nombre }}
        <div class="form-buttons">
          <!-- Botón para ver respuestas -->
          <button class="btn-show" @click="verRespuestas(formulario.id)">
            Ver Respuestas
          </button>
          <!-- Botón para generar enlace único para responder el formulario -->
          <button class="btn-link" @click="generarEnlace(formulario.id)">
            Generar enlace para responder
          </button>
          <!-- Botón para eliminar formulario -->
          <button class="btn-delete" @click="eliminarFormulario(formulario.id)">
            Eliminar Formulario
          </button>
        </div>
      </li>
    </ul>

    <!-- Modal para mostrar el enlace generado -->
    <div class="report-modal" v-if="enlaceModalVisible">
      <div class="report-modal-content">
        <!-- Botón para cerrar el modal -->
        <button class="report-modal-close" @click="cerrarModal">Cerrar</button>
        <!-- Título y contenido del modal -->
        <h3>Enlace para Responder el Formulario:</h3>
        <p>{{ enlaceGenerado }}</p>
      </div>
    </div>
  </div>
</template>

<script>
// Importa estilos, configuración de Firebase y funciones necesarias
import "@/styles/styles.css";
import app from "@/firebaseConfig";
import { onAuthStateChanged, getAuth } from "firebase/auth";

import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

const auth = getAuth(app);
let usuarioActual = null;

// Obtiene el usuario actual cuando cambia el estado de autenticación
onAuthStateChanged(auth, (user) => {
  if (user) {
    // El usuario está autenticado
    usuarioActual = user.uid;
  } else {
    // El usuario no está autenticado
    usuarioActual = null;
  }
});

export default {
  // Datos del componente
  data() {
    return {
      formularios: [], // Almacena la lista de formularios
      enlaceModalVisible: false, // Indica si el modal del enlace está visible
      rutaCompleta: window.location.href, // Ruta completa de la aplicación
      enlaceGenerado: "", // Almacena el enlace generado para responder un formulario
    };
  },
  // Código ejecutado después de que el componente es montado
  mounted() {
    // Recupera la lista de formularios al cargar el componente
    this.recuperarFormularios();
  },
  // Métodos del componente
  methods: {
    // Recupera la lista de formularios del usuario actual desde Firebase
    async recuperarFormularios() {
      const db = getFirestore();
      const formulariosRef = collection(db, "formularios");

      // Consulta para recuperar solo los formularios del usuario actual
      const q = query(formulariosRef, where("usuario", "==", usuarioActual));

      try {
        const querySnapshot = await getDocs(q);

        // Almacena los formularios en el estado del componente
        this.formularios = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          nombre: doc.data().nombre,
        }));
      } catch (error) {
        console.error("Error al recuperar formularios:", error);
      }
    },
    // Redirige a la página de respuestas del formulario seleccionado
    async verRespuestas(formularioId) {
      this.$router.push({
        name: "AnswersView",
        params: { formId: formularioId },
      });
    },
    // Genera y muestra un enlace único para responder el formulario
    async generarEnlace(formularioId) {
      // Lógica para generar el enlace único con formularioId
      const rutaRaiz = this.rutaCompleta.replace(/\/[^/]*$/, "");
      this.enlaceGenerado = `${rutaRaiz}/answer-form/${formularioId}`;

      // Muestra el modal con el enlace generado
      this.enlaceModalVisible = true;
    },
    // Cierra el modal del enlace
    async cerrarModal() {
      this.enlaceModalVisible = false;
    },
    // Elimina el formulario seleccionado desde Firebase
    async eliminarFormulario(formularioId) {
      const db = getFirestore();
      const formularioRef = doc(db, "formularios", formularioId);

      try {
        await deleteDoc(formularioRef);
        console.log("Formulario eliminado correctamente.");

        // Actualiza la lista de formularios después de eliminar uno
        this.recuperarFormularios();
      } catch (error) {
        console.error("Error al eliminar el formulario:", error);
      }
    },
  },
};
</script>
