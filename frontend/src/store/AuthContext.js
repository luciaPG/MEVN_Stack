import { reactive, provide, inject } from "vue";
import axios from "axios";


const authState = reactive({
  user: null,
  isAuthenticated: localStorage.getItem("jwt") ? true : false,
});


const login = async (credentials) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/login",
      credentials
    );
    authState.user = response.data.data.user;
    authState.isAuthenticated = true;
    localStorage.setItem("jwt", response.data.token);
  } catch (error) {
    throw error.response?.data?.message || "Error al iniciar sesión";
  }
};


const logout = () => {
  authState.user = null;
  authState.isAuthenticated = false;
  localStorage.removeItem("jwt");
};


export const provideAuth = () => {
  provide("auth", {
    authState,
    login,
    logout,
  });
};


export const useAuth = () => {
  const auth = inject("auth");
  if (!auth) {
    throw new Error("useAuth debe ser usado dentro de un provideAuth");
  }
  return auth;
};
