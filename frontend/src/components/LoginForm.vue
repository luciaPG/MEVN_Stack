<template>
  <form @submit.prevent="handleLogin">
    <div>
      <label>Email:</label>
      <input type="email" v-model="email" required autocomplete="email" />
    </div>
    <div>
      <label>Contraseña:</label>
      <input
        type="password"
        v-model="password"
        required
        autocomplete="current-password"
      />
    </div>
    <button type="submit">Iniciar sesión</button>
    <p v-if="error" class="error">{{ error }}</p>
  </form>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const email = ref("");
const password = ref("");
const error = ref("");
const router = useRouter();

const handleLogin = async () => {
  try {
    const response = await axios.post("http://localhost:5000/api/auth/login", {
      email: email.value,
      password: password.value,
    });

    localStorage.setItem("jwt", response.data.token);

    router.push("/dashboard");
  } catch (err) {
    error.value = err.response?.data?.message || "Error al iniciar sesión";
  }
};
</script>
