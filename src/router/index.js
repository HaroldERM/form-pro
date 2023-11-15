// Importa funciones necesarias para la creación del enrutador y autenticación de Firebase
import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import ReportsView from "@/views/ReportsView.vue";
import FormBuilderView from "@/views/FormBuilderView.vue";
import AnswerFormView from "@/views/AnswerFormView.vue";
import AnswersView from "@/views/AnswersView.vue";
import app from "@/firebaseConfig"; // Importa la configuración de Firebase
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Importa funciones de autenticación de Firebase

// Obtiene la instancia de autenticación de Firebase
const auth = getAuth(app);

// Define las rutas del enrutador
const routes = [
  {
    path: "/",
    name: "Root",
    // Middleware de ruta que redirige al usuario basado en su estado de autenticación
    beforeEnter: (to, from, next) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          next("/reports"); // Si el usuario está autenticado, redirige a la página de informes
        } else {
          next("/login"); // Si no está autenticado, redirige a la página de inicio de sesión
        }
        unsubscribe(); // Detiene la escucha de cambios en la autenticación
      });
    },
  },
  // Ruta para la página de inicio de sesión
  {
    path: "/login",
    name: "Login",
    component: LoginView,
    meta: { requiresAuth: false }, // Indica que no requiere autenticación
  },
  // Ruta para la página de informes (requiere autenticación)
  {
    path: "/reports",
    name: "Reports",
    component: ReportsView,
    meta: { requiresAuth: true },
  },
  // Ruta para el constructor de formularios (requiere autenticación)
  {
    path: "/form-builder",
    name: "FormBuilder",
    component: FormBuilderView,
    meta: { requiresAuth: true },
  },
  // Ruta para ver respuestas a un formulario específico (requiere autenticación)
  {
    path: "/answers/:formId",
    name: "AnswersView",
    component: AnswersView,
    meta: { requiresAuth: true },
  },
  // Ruta para responder a un formulario específico (no requiere autenticación)
  {
    path: "/answer-form/:formId",
    name: "AnswerFormView",
    component: AnswerFormView,
    props: true,
    meta: { requiresAuth: false },
  },
  // Ruta de redirección para cualquier otra ruta no especificada
  {
    path: "/:catchAll(.*)",
    redirect: "/",
  },
];

// Crea una instancia del enrutador
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Middleware de enrutador que se ejecuta antes de cada navegación
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  // Si la ruta requiere autenticación
  if (requiresAuth) {
    // Verifica el estado de autenticación del usuario usando onAuthStateChanged
    await new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        // Si el usuario está autenticado, permite el acceso a la ruta protegida
        if (user) {
          unsubscribe(); // Detiene la escucha de cambios en la autenticación
          resolve();
        } else {
          // Si el usuario no está autenticado, redirige al usuario a la página de inicio
          next("/");
        }
      });
    });
  }

  // Si la ruta no requiere autenticación, permite el acceso directamente
  next();
});

// Exporta la instancia del enrutador
export default router;
