<template>
  <div id="app">
   
    <NavBar />

    
    <div class="content-container">
      <router-view />
    </div>
  </div>
</template>

<script>
import { inject, computed } from "vue";
import NavBar from "./components/NavBar.vue"
import { provideAuth } from "./store/AuthContext"; 

export default {
  components: {
    NavBar, 
  },
  setup() {
    
    provideAuth(); 

  
    const auth = inject("auth");

    const isAuthenticated = computed(() => {
      return !!localStorage.getItem("jwt");
    });

    const handleLogout = () => {
      auth.logout();
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


.content-container {
  padding-top: 80px; 
}


nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
