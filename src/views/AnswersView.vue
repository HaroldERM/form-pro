<template>
  <!-- Página de respuestas del formulario -->
  <div>
    <!-- Título de la página -->
    <h2>Respuestas del Formulario</h2>
    <!-- Tabla para mostrar las respuestas -->
    <table class="responses-table">
      <thead>
        <!-- Encabezados de la tabla -->
        <tr>
          <th>Nombre completo</th>
          <th>Correo electrónico</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <!-- Itera sobre los datos de todas las respuestas y muestra en la tabla -->
        <tr v-for="(data, index) in todaData" :key="index">
          <td>{{ data.respuestas[0].respuesta }}</td>
          <td>{{ data.respuestas[1].respuesta }}</td>
          <td>
            <!-- Botón para ver detalles de la respuesta -->
            <button @click="verDetalles(data)">Ver Detalles</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal para mostrar detalles de la respuesta -->
    <div v-if="modalVisible" class="modal">
      <div class="modal-content">
        <!-- Contenido del modal -->
        <h3>Detalles del Formulario</h3>
        <!-- Lista para mostrar detalles de cada pregunta y respuesta -->
        <ul>
          <li v-for="(pregunta, index) in data.preguntas" :key="index">
            {{ pregunta.label }} :
            <!-- Maneja diferentes tipos de respuestas -->
            <span v-if="pregunta.tipo === 'archivo'">
              <!-- Enlace para ver el archivo -->
              <a :href="data.respuestas[index].respuesta" target="_blank"
                >Ver Archivo</a
              >
            </span>
            <span v-else-if="pregunta.multiple">
              <!-- Muestra respuestas múltiples -->
              {{ mostrarRespuestasMultiples(data.respuestas[index].respuesta) }}
            </span>
            <span v-else>
              <!-- Muestra respuesta simple -->
              {{ data.respuestas[index].respuesta }}
            </span>
          </li>
        </ul>
        <!-- Botón para cerrar el modal -->
        <button class="close-button" @click="cerrarModal">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script>
// Importa funciones de Firebase y estilos
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import "@/styles/styles.css";

export default {
  // Datos del componente
  data() {
    return {
      formularioId: null, // ID del formulario actual
      todaData: [], // Todas las respuestas del formulario
      modalVisible: false, // Indica si el modal está visible
      data: null, // Datos de la respuesta seleccionada para mostrar en el modal
    };
  },
  // Código ejecutado al crear el componente
  created() {
    // Recuperar formularioId de la ruta
    this.formularioId = this.$route.params.formId;
    // Cargar respuestas del formulario
    this.cargarTodaData();
  },
  // Métodos del componente
  methods: {
    // Carga todas las respuestas del formulario desde Firebase
    async cargarTodaData() {
      const db = getFirestore();
      const respuestasRef = collection(db, "respuestas");
      const q = query(respuestasRef, where("idForm", "==", this.formularioId));

      try {
        const querySnapshot = await getDocs(q);
        this.todaData = querySnapshot.docs.map((doc) => doc.data());
      } catch (error) {
        console.error("Error al cargar respuestas:", error);
      }
    },
    // Abre el modal y muestra detalles de la respuesta seleccionada
    verDetalles(data) {
      this.modalVisible = true;
      this.data = data;
    },
    // Muestra respuestas múltiples como cadena separada por comas
    mostrarRespuestasMultiples(respuestasMultiples) {
      return Array.isArray(respuestasMultiples)
        ? respuestasMultiples.join(", ")
        : respuestasMultiples;
    },
    // Cierra el modal y limpia los datos
    cerrarModal() {
      this.modalVisible = false;
      this.data = null;
    },
  },
};
</script>
