<!-- filepath: d:\ETSII\4 CARRERA\2C\CBD\MEVN_Stack\MEVN_Stack\frontend\src\App.vue -->
<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link v-if="!isAuthenticated" to="/login">Login</router-link>
      <router-link v-if="isAuthenticated" to="/dashboard"
        >Dashboard</router-link
      >
      |
      <button v-if="isAuthenticated" @click="handleLogout">Logout</button>
    </nav>
    <router-view />
  </div>
</template>

<script>
import { useAuth } from "./store/AuthContext";

export default {
  setup() {
    const { isAuthenticated, logout } = useAuth();

    const handleLogout = () => {
      logout();
    };

    return {
      isAuthenticated,
      handleLogout,
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
