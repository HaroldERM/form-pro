<template>
  <div>
    <!-- Contructur del Formulario -->
    <h2 class="tittle-form">Constructor de Formularios</h2>
    <div class="build-section">
      <label>Nombre del Formulario:</label>
      <input type="text" v-model="nombreFormulario" required />
      <label>Pregunta:</label>
      <input type="text" v-model="preguntaActual.label" required />
      <label>Tipo de Respuesta:</label>
      <select v-model="preguntaActual.tipo">
        <option value="texto">Texto</option>
        <option value="numero">Número</option>
        <option value="archivo">Archivo</option>
        <option value="combobox">Combobox</option>
      </select>
      <template v-if="preguntaActual.tipo === 'combobox'">
        <label>Seleccione el tipo de selección:</label>
        <select v-model="preguntaActual.multiple">
          <option value="true">Múltiple</option>
          <option value="false">Única</option>
        </select>
        <label>Opciones:</label>
        <input type="text" v-model="opcion" @keyup.enter="agregarOpcion" />
        <button @click="agregarOpcion">Agregar Opción</button>
        <ul>
          <li v-for="(opcion, index) in preguntaActual.opciones" :key="index">
            {{ opcion.label }}
          </li>
        </ul>
      </template>
    </div>
    <button class="add-question" @click="agregarPregunta">
      Agregar Pregunta
    </button>
    <!-- Vista Previa del Formulario -->
    <h2 class="tittle-form">Vista Previa del Formulario</h2>
    <div class="preview-section">
      <p><strong>Nombre del Formulario:</strong> {{ nombreFormulario }}</p>
      <div v-for="(pregunta, index) in preguntas" :key="index">
        <div>
          <form-field
            :pregunta="pregunta"
            @file-selected="handleFileSelected"
          ></form-field>
          <button @click="eliminarPregunta(index)">Eliminar Pregunta</button>
        </div>
      </div>
    </div>
    <button class="save-form" @click="guardarFormulario">
      Guardar Formulario
    </button>
  </div>
</template>

<script>
import FormField from "@/components/FormField.vue";
import { getAuth } from "firebase/auth";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import "@/styles/styles.css";

export default {
  components: {
    FormField,
  },
  data() {
    return {
      nombreFormulario: "", // Nombre del formulario
      preguntaActual: {
        label: "", // Texto de la pregunta
        tipo: "texto", // Tipo de respuesta esperada (por defecto, texto)
        multiple: false, // Para combobox, indica si es selección múltiple o única
        opciones: [], // Para combobox, almacena las opciones
      },
      preguntas: [], // Almacena las preguntas y sus tipos)
      opcion: "", // Almacena temporalmente las opciones del combobox
    };
  },
  methods: {
    agregarOpcion() {
      // Agregar una nueva opción al combobox
      if (this.opcion.trim() !== "") {
        this.preguntaActual.opciones.push({
          label: this.opcion,
          valor: this.opcion,
        });
        this.opcion = "";
      }
    },
    agregarPregunta() {
      // Agregar la pregunta actual al arreglo de preguntas
      this.preguntas.push({
        label: this.preguntaActual.label,
        tipo: this.preguntaActual.tipo,
        multiple: this.preguntaActual.multiple,
        opciones: this.preguntaActual.opciones,
      });
      // Reiniciar la pregunta actual para agregar una nueva
      this.preguntaActual = {
        label: "",
        tipo: "texto",
        multiple: false,
        opciones: [],
      };
    },
    eliminarPregunta(index) {
      // Eliminar una pregunta del formulario
      this.preguntas.splice(index, 1);
    },
    handleFileSelected(file) {
      // Manejar el archivo seleccionado
      console.log("Archivo seleccionado:", file);
    },
    guardarFormulario() {
      const auth = getAuth();
      const usuario = auth.currentUser; // Obtener el usuario actualmente autenticado

      if (usuario) {
        try {
          // Obtiene una instancia de Firestore
          const db = getFirestore();

          // Crea un documento en la colección "formularios"
          addDoc(collection(db, "formularios"), {
            nombre: this.nombreFormulario,
            preguntas: this.preguntas,
            usuario: usuario.uid, // Almacena el ID del usuario que creó el formulario
          });

          window.alert("Formulario guardado correctamente!");

          // Restablece el formulario después de guardarlo
          this.resetForm();
        } catch (error) {
          console.error("Error al guardar el formulario:", error);
        }
      } else {
        console.error(
          "Usuario no autenticado. Por favor, inicia sesión para guardar el formulario."
        );
      }
    },

    resetForm() {
      // Restablece los datos del formulario
      (this.nombreFormulario = ""),
        (this.preguntaActual = {
          label: "",
          tipo: "texto",
          multiple: false,
          opciones: [],
        }),
        (this.preguntas = [
          {
            label: "Ingresa tu nombre completo",
            tipo: "texto",
            multiple: false,
            opciones: [],
          },
          {
            label: "Ingresa tu correo electrónico",
            tipo: "texto",
            multiple: false,
            opciones: [],
          },
        ]),
        (this.opciones = "");
    },
  },
  created() {
    // Inicializa los datos del formulario cuando se carga el componente
    this.resetForm();
  },
};
</script>
