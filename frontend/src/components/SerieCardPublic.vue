<script setup>
import { useRouter } from "vue-router";
import { defineProps, defineEmits, onMounted, ref, watch, computed } from "vue";
import { globalAuth } from "../store/AuthContext";
import axios from "axios";

const router = useRouter();
const emit = defineEmits(["register", "unregister"]);
const isUserRegistered = ref(false);
const isLoading = ref(true);

// This handles both cases where isAuthenticated is property or function
const isLoggedIn = computed(() => {
  // Check if isAuthenticated is a function first
  if (typeof globalAuth.isAuthenticated === 'function') {
    return globalAuth.isAuthenticated();
  }
  // Fallback to property access
  return globalAuth.isAuthenticated;
});

const props = defineProps({
  id: {
    type: [String, Number],
    required: true
  },
  nombre: String,
  sinopsis: String,
  genero: String,
  isRegistered: {
    type: Boolean,
    default: false,
  },
  hideDetailsButton: {
    type: Boolean,
    default: false,
  },
});

watch(() => props.isRegistered, (newValue) => {
  isUserRegistered.value = newValue;
});

onMounted(() => {
  isUserRegistered.value = props.isRegistered;
  checkIfSerieIsRegisteredFromToken();
});

const getUserIdFromToken = () => {
  const token = localStorage.getItem("jwt");
  if (!token) return null;

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const decoded = JSON.parse(jsonPayload);
    const userId = decoded.id || decoded._id || decoded.sub || decoded.userId;
    return userId;
  } catch (error) {
    console.error("Error decodificando token:", error);
    return null;
  }
};

const checkIfSerieIsRegisteredFromToken = async () => {
  try {
    // Solo verificamos si el usuario está autenticado
    if (isLoggedIn.value && globalAuth.user) {
      const userId = getUserIdFromToken();

      if (!userId) {
        console.error("No se pudo obtener el ID del token");
        isLoading.value = false;
        return;
      }

      const userSeries = await fetchUserSeries(userId);
      isUserRegistered.value = userSeries.some(serie => {
        const serieId = serie._id?.toString() || serie?.toString();
        const propId = props.id?.toString();
        return serieId === propId;
      });
    } else {
      // Si no está autenticado, claramente no está registrado
      isUserRegistered.value = false;
    }
  } catch (error) {
    console.error("Error verificando si la serie está registrada:", error);
  } finally {
    isLoading.value = false;
  }
};

const fetchUserSeries = async (userId) => {
  if (!userId) return [];

  try {
    const token = localStorage.getItem("jwt");
    if (!token) return [];

    const response = await axios.get(
      `http://localhost:5000/api/series/user/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetchUserSeries:", error);
    return [];
  }
};

const handleButtonClick = () => {
  // Si no está autenticado, redirigir al login
  if (!isLoggedIn.value) {
    router.push("/login");
    return;
  }

  // Si ya está autenticado, manejar registro/eliminación
  if (isUserRegistered.value) {
    emit("unregister", props.id);
    isUserRegistered.value = false;
  } else {
    emit("register", props.id);
    isUserRegistered.value = true;
  }
};

const getButtonText = () => {
  // Si no está autenticado
  if (!isLoggedIn.value) {
    return "Iniciar sesión para añadirla";
  }
  
  // Si está autenticado, verificar si está registrada
  return isUserRegistered.value ? "Eliminar de mi perfil" : "Añadir a mi perfil";
};
</script>

<template>
  <div class="serie-card">
    <h2 class="serie-nombre">{{ nombre }}</h2>
    <p class="serie-genero">
      <span class="badge genero">{{ genero }}</span>
    </p>
    <p class="serie-sinopsis">{{ sinopsis }}</p>

    <div class="button-container">
      <div v-if="isLoading" class="loading-indicator">Cargando...</div>
      <div v-else class="actions-container">
        <button 
          @click="handleButtonClick" 
          :class="{
            'register-btn': !isUserRegistered && isLoggedIn,
            'unregister-btn': isUserRegistered && isLoggedIn,
            'auth-btn': !isLoggedIn
          }"
        >
          {{ getButtonText() }}
        </button>

        <!--
        <router-link 
          v-if="!hideDetailsButton" 
          :to="{ name: 'serie-details', params: { id: id }}" 
          class="detalles-btn"
        >
          Ver detalles completos
        </router-link>
        -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.serie-card {
  background: #f3f4f6;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 1000px;
  transition: transform 0.2s ease;
}

.serie-card:hover {
  transform: translateY(-5px);
}

.serie-nombre {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #222;
  text-align: left;
}

.serie-genero {
  text-align: left;
  margin-bottom: 0.5rem;
}

.serie-sinopsis {
  text-align: left;
  margin-bottom: 1rem;
}

.badge {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
}

.badge.genero {
  background-color: #e0e7ff;
  color: #4f46e5;
}

.button-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

.detalles-btn {
  background: linear-gradient(90deg, #8c00d7, #eb7725);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(37, 99, 235, 0.1);
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.detalles-btn:hover {
  background: linear-gradient(90deg, #ea7626, #8d01d6);
  transform: translateY(-2px);
  box-shadow: 0 6px 10px rgba(37, 99, 235, 0.15);
}

.register-btn, .auth-btn {
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.register-btn:hover, .auth-btn:hover {
  background-color: #059669;
  transform: translateY(-2px);
}

.unregister-btn {
  background-color: #f97316;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.unregister-btn:hover {
  background-color: #ea580c;
  transform: translateY(-2px);
}

.loading-indicator {
  text-align: center;
  padding: 0.5rem;
  color: #6b7280;
  font-size: 0.9rem;
}

.actions-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>

