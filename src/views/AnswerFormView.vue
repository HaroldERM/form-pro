html Copy code
<template>
  <!-- Sección de respuesta a un formulario -->
  <div v-if="formData">
    <!-- Título del formulario -->
    <h2 class="tittle-form">Responder Formulario</h2>
    <!-- Muestra el nombre del formulario -->
    <p class="answer_form">
      <strong>Nombre del Formulario:</strong> {{ formData.nombre }}
    </p>
    <div>
      <!-- Componente FormField para cada pregunta del formulario -->
      <form-field
        class="form-field"
        ref="formFieldComponent"
        v-for="(pregunta, index) in formData.preguntas"
        :key="index"
        :pregunta="pregunta"
        @respuesta-cambiada="guardarRespuesta(index, $event)"
        @file-selected="guardarArchivo(index, $event)"
      ></form-field>
    </div>
    <!-- Botón para enviar el formulario -->
    <button class="send-form" :disabled="!formCompletado" @click="enviarForm">
      Enviar
    </button>
  </div>
</template>

<script>
// Importa estilos, componente FormField y funciones de Firebase
import "@/styles/styles.css";
import FormField from "@/components/FormField.vue";
import {
  getFirestore,
  doc,
  getDoc,
  addDoc,
  collection,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default {
  components: {
    FormField,
  },

  // Propiedades esperadas desde el componente padre
  props: {
    formId: String, // ID del formulario actual
    pregunta: Object, // Objeto de pregunta actual (no utilizado en el componente)
  },

  // Datos del componente
  data() {
    return {
      formData: null, // Almacena los datos del formulario obtenidos desde Firebase
      respuestas: [], // Array para almacenar las respuestas
      formCompletado: false, // Indica si todas las respuestas están completas
    };
  },

  // Código ejecutado al crear el componente
  created() {
    // Cierra la sesión actual antes de responder un formulario (seguridad)
    this.$store
      .dispatch("logout")
      .then(() => {
        this.$router.push(`/answer-form/${this.formId}`);
      })
      .catch((error) => {
        console.error("Error al cerrar sesión para llenar form", error.message);
      });
  },

  // Código ejecutado después de que el componente es montado
  mounted() {
    // Trae los datos del formulario actual desde Firebase
    this.traerFormulario();
  },

  // Métodos del componente
  methods: {
    // Obtiene los datos del formulario actual desde Firebase
    traerFormulario() {
      const db = getFirestore();
      const formularioRef = doc(db, "formularios", this.formId);

      getDoc(formularioRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            // Si el formulario existe en Firebase, almacena los datos en formData
            this.formData = docSnap.data();
          } else {
            // Si el formulario no existe, mostrar un mensaje en consola
            console.error("El formulario no existe.");
          }
        })
        .catch((error) => {
          // Maneja los errores de consulta a Firebase
          console.error("Error al obtener el formulario:", error);
        });
    },

    // Guarda la respuesta del usuario en el array respuestas
    guardarRespuesta(index, respuesta) {
      this.respuestas[index] = { respuesta };

      // Verifica si todas las respuestas están completas para habilitar el botón de enviar
      let todosDefinidos = true;
      if (this.formData.preguntas.length === this.respuestas.length) {
        for (let i = 0; i < this.respuestas.length; i++) {
          if (this.respuestas[i] === undefined) {
            todosDefinidos = false;
            break;
          }
        }
        if (todosDefinidos) {
          this.formCompletado = true;
        } else {
          this.formCompletado = false;
        }
      } else {
        this.formCompletado = false;
      }
    },

    // Guarda el archivo seleccionado por el usuario en el array respuestas y lo sube a Firebase Storage
    async guardarArchivo(index, file) {
      if (file) {
        try {
          const storage = getStorage();
          const storageRef = ref(storage, `files/${file.name}`);

          // Sube el archivo a Firebase Storage
          await uploadBytes(storageRef, file);

          const downloadURL = await getDownloadURL(storageRef);

          if (downloadURL) {
            // Muestra una alerta de éxito y guarda la URL de descarga en respuestas
            window.alert("¡Archivo subido exitosamente!");
            this.respuestas[index] = {
              respuesta: downloadURL,
            };
            // Verifica si todas las respuestas están completas para habilitar el botón de enviar
            let todosDefinidos = true;
            if (this.formData.preguntas.length === this.respuestas.length) {
              for (let i = 0; i < this.respuestas.length; i++) {
                if (this.respuestas[i] === undefined) {
                  todosDefinidos = false;
                  break;
                }
              }
              if (todosDefinidos) {
                this.formCompletado = true;
              } else {
                this.formCompletado = false;
              }
            } else {
              this.formCompletado = false;
            }
          } else {
            this.formCompletado = false;
          }
        } catch (error) {
          console.error(
            // Maneja errores al subir el archivo o al obtener la URL de descarga
            "Error al subir el archivo o al obtener la URL de descarga:",
            error
          );
          throw error;
        }
      } else {
        console.log("No seleccionó archivo para subir");
      }
    },

    // Envia las respuestas del formulario a Firebase Firestore
    enviarForm() {
      if (this.formCompletado) {
        // Copia el formData y agrega los atributos de respuesta y ID del formulario
        const respuestasData = {
          ...this.formData,
          respuestas: this.respuestas,
          idForm: this.formId,
        };

        const db = getFirestore();
        const respuestasCollectionRef = collection(db, "respuestas");
        // Agrega las respuestas a la colección de respuestas en Firestore
        console.log("Data de la respuesta", respuestasData);
        addDoc(respuestasCollectionRef, respuestasData)
          .then(() => {
            // Puedes redirigir al usuario a una página de éxito o realizar otras acciones después de enviar las respuestas
            window.alert("¡Respuesta enviada correctamente!");
            window.location.reload();
          })
          .catch((error) => {
            // Maneja errores al enviar respuestas a Firestore
            console.error("Error al enviar respuestas a Firestore:", error);
          });
      } else {
        window.alert("¡Error, El form no esta completo");
      }
    },
  },
};
</script>
