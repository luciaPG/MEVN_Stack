import { reactive, provide, inject } from "vue";
import axios from "axios";

// Estado reactivo para la autenticación
const authState = reactive({
  user: null,
  isAuthenticated: false,
});

// Función para iniciar sesión
const login = async (credentials) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/login",
      credentials
    );
    authState.user = response.data.user;
    authState.isAuthenticated = true;
    localStorage.setItem("token", response.data.token);
  } catch (error) {
    throw error.response?.data?.message || "Error al iniciar sesión";
  }
};

// Función para cerrar sesión
const logout = () => {
  authState.user = null;
  authState.isAuthenticated = false;
  localStorage.removeItem("token");
};

// Proveer el contexto
export const provideAuth = () => {
  provide("auth", {
    authState,
    login,
    logout,
  });
};

// Usar el contexto
export const useAuth = () => {
  const auth = inject("auth");
  if (!auth) {
    throw new Error("useAuth debe ser usado dentro de un provideAuth");
  }
  return auth;
};
