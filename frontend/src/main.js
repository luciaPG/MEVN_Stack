import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import { globalAuth } from "./store/AuthContext";

// Set up axios interceptor to automatically add token to requests
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

// Initialize auth state before creating app
// This ensures authentication is available immediately without waiting
// for App.vue to mount
globalAuth
  .loadUserData()
  .then(() => {
    const app = createApp(App);
    app.use(router);
    app.mount("#app");
  })
  .catch((error) => {
    console.error("Error initializing authentication:", error);
    // Continue loading app even if auth fails
    const app = createApp(App);
    app.use(router);
    app.mount("#app");
  });
