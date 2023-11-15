<template>
  <!-- Contenedor principal del campo de formulario -->
  <div class="form-field-container">
    <!-- Etiqueta del formulario basada en la propiedad 'label' de la pregunta -->
    <label class="form-label">{{ pregunta.label }}</label>

    <!-- Selecciona el tipo de campo según el tipo de pregunta -->
    <template v-if="pregunta.tipo === 'texto'">
      <!-- Campo de entrada de texto -->
      <input
        type="text"
        class="form-input"
        @input="onInputChange"
        @blur="onInputBlur"
      />
    </template>
    <template v-else-if="pregunta.tipo === 'numero'">
      <!-- Campo de entrada numérica -->
      <input
        type="number"
        class="form-input"
        @input="onInputChange"
        @blur="onInputBlur"
      />
    </template>
    <template v-else-if="pregunta.tipo === 'archivo'">
      <!-- Campo de carga de archivo -->
      <input type="file" class="form-file-input" @change="onFileChange" />
    </template>
    <template v-else-if="pregunta.tipo === 'combobox'">
      <!-- Selector de opciones (combobox) -->
      <select
        class="form-select"
        @change="onComboboxChange"
        :multiple="pregunta.multiple"
      >
        <!-- Itera sobre las opciones de la pregunta y crea elementos 'option' -->
        <option
          v-for="(opcion, index) in pregunta.opciones"
          :value="opcion.valor"
          :key="index"
        >
          {{ opcion.label }}
        </option>
      </select>
    </template>
  </div>
</template>

<script>
import "@/styles/styles.css";
export default {
  props: {
    pregunta: Object, // Propiedad que recibe la pregunta como un objeto
  },
  data() {
    return {
      respuesta: null, // Almacena la respuesta del usuario
      entradaCompletada: false, // Indica si la entrada está completada
    };
  },
  methods: {
    // Maneja el evento de cambio en campos de entrada de texto o número
    onInputChange(event) {
      this.respuesta = event.target.value;
      this.entradaCompletada = false;
    },
    // Maneja el evento de pérdida de foco en campos de entrada
    onInputBlur() {
      this.entradaCompletada = true;
      // Si la entrada está completada, emite el evento con la respuesta
      if (this.entradaCompletada) {
        this.$emit("respuesta-cambiada", this.respuesta);
      }
    },
    // Maneja el evento de cambio en el campo de carga de archivo
    onFileChange(event) {
      const selectedFile = event.target.files[0];
      // Emite el evento con el archivo seleccionado
      this.$emit("file-selected", selectedFile);
    },
    // Maneja el evento de cambio en el selector de opciones
    onComboboxChange(event) {
      // Si es un combobox de selección única
      if (!this.pregunta.multiple) {
        this.respuesta = event.target.value;
        this.$emit("respuesta-cambiada", this.respuesta);
      } else {
        // Si es un combobox de selección múltiple, obtiene las opciones seleccionadas
        const selectedOptions = Array.from(event.target.selectedOptions).map(
          (option) => option.value
        );
        this.respuesta = selectedOptions;
        // Emite el evento con las opciones seleccionadas
        this.$emit("respuesta-cambiada", this.respuesta);
      }
    },
  },
};
</script>
