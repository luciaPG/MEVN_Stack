import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";

// Configuración de Axios para JWT
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Configuración global de la aplicación
const app = createApp(App);

// Proveedor de autenticación mejorado
app.provide("auth", {
  authState: {
    isAuthenticated: () => !!localStorage.getItem("jwt"),
    user: () => {
      const token = localStorage.getItem("jwt");
      if (!token) return null;
      try {
        return JSON.parse(atob(token.split(".")[1]));
      } catch {
        return null;
      }
    },
  },
  login: (token) => {
    localStorage.setItem("jwt", token);
  },
  logout: () => {
    localStorage.removeItem("jwt");
    router.push("/login");
  },
});

app.use(router);
app.mount("#app");
