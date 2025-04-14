<!-- src/components/Login.vue -->
<template>
  <div>
    <h2>Iniciar Sesión</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="credentials.email" required />
      </div>
      <div>
        <label for="password">Contraseña:</label>
        <input
          type="password"
          id="password"
          v-model="credentials.password"
          required
        />
      </div>
      <button type="submit">Iniciar Sesión</button>
    </form>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script>
import { useAuth } from "../store/AuthContext";

export default {
  name: "LoginPage",
  data() {
    return {
      credentials: {
        email: "",
        password: "",
      },
      error: null,
    };
  },
  methods: {
    async handleLogin() {
      try {
        const { login } = useAuth();
        await login(this.credentials);
        this.$router.push("/dashboard"); // Redirigir al dashboard después del login
      } catch (err) {
        this.error = err.response?.data?.message || "Error al iniciar sesión";
      }
    },
  },
};
</script>
