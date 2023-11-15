// Importa la función de creación de almacén desde Vuex y funciones de autenticación de Firebase
import { createStore } from "vuex";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import app from "@/firebaseConfig";

// Crea y exporta una instancia del almacén Vuex
export default createStore({
  // Estado centralizado del almacén
  state: {
    user: null, // Almacena la información del usuario actual
  },
  // Mutaciones para modificar el estado del almacén de forma síncrona
  mutations: {
    // Establece el usuario en el estado del almacén
    setUser(state, user) {
      state.user = user;
    },
  },
  // Acciones para realizar operaciones asíncronas y modificar el estado mediante mutaciones
  actions: {
    // Acción para iniciar sesión
    async login({ commit }, { email, password }) {
      const auth = getAuth(app);
      try {
        // Intenta iniciar sesión con el correo electrónico y la contraseña
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        // Llama a la mutación para establecer el usuario en el estado
        commit("setUser", user);
        return user;
      } catch (error) {
        // Captura y maneja errores de autenticación
        console.error("Error de autenticación:", error.message);
        throw error;
      }
    },
    // Acción para cerrar sesión
    async logout({ commit }) {
      const auth = getAuth(app);
      try {
        // Cierra sesión y llama a la mutación para establecer el usuario en null
        await signOut(auth);
        commit("setUser", null);
      } catch (error) {
        // Captura y maneja errores al cerrar sesión
        console.error("Error al cerrar sesión:", error.message);
        throw error;
      }
    },
    // Acción para realizar el inicio de sesión automático
    async autoLogin({ commit }) {
      const auth = getAuth(app);
      // Devuelve una promesa para gestionar la sincronización
      return new Promise((resolve) => {
        // Escucha cambios en el estado de autenticación
        auth.onAuthStateChanged((user) => {
          if (user) {
            // Si hay un usuario, llama a la mutación para establecerlo en el estado
            commit("setUser", user);
          } else {
            // Si no hay un usuario, establece el usuario en null
            commit("setUser", null);
          }
          resolve(user); // Resuelve la promesa con el usuario
        });
      });
    },
  },
  // Getters para acceder al estado del almacén de forma reactiva
  getters: {
    // Getter para verificar si hay un usuario autenticado
    isAuthenticated: (state) => !!state.user,
  },
});
