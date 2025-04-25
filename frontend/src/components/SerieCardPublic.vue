<script setup>
import { useRouter } from "vue-router";
import { defineProps, onMounted, ref, watch, computed } from "vue";
import { globalAuth } from "../store/AuthContext";
import axios from "axios";

const router = useRouter();
const isUserRegistered = ref(false);

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
  fetchUserSeries();
  checkIfSerieIsRegistered();
});

const checkIfSerieIsRegistered = async () => {
  if (!isLoggedIn.value) return;
  const userId = globalAuth.getUserId();
  const userSeries = await fetchUserSeries(userId);
  isUserRegistered.value = userSeries.some(s => s._id === props.id);
};

const registerSerie = async (serieId) => {
  try {
    const userId = globalAuth.getUserId();
    const token = localStorage.getItem("jwt");

    // Debugging logs
    console.log("Registering serie:", {
      userId,
      serieId,
      endpoint: "/api/series/user"
    });

    const response = await axios.post(
      "http://localhost:5000/api/series/user", // Correct endpoint
      { userId, serieId }, // Data in body
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    console.log("Registration successful:", response.data);
    isUserRegistered.value = true;
  } catch (error) {
    console.error("Registration failed:", {
      error: error.response?.data || error.message,
      config: error.config
    });
  }
};
const unregisterSerie = async (serieId) => {
  try {
    const userId = globalAuth.getUserId();
    const token = localStorage.getItem("jwt");

    if (!userId || !token) {
      throw new Error("Authentication required");
    }

    const response = await axios.delete(
      `http://localhost:5000/api/series/user/${userId}/${serieId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        validateStatus: (status) => status < 500,
      }
    );

    if (response.status === 200) {
      isUserRegistered.value = false;
    } else {
      console.error("Unregistration failed:", response.data);
    }
  } catch (error) {
    console.error("Error in unregisterSerie:", error.message);
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
  if (!isLoggedIn.value) {
    router.push("/login");
    return;
  }
  if (isUserRegistered.value) {
    unregisterSerie(props.id);
  } else {
    registerSerie(props.id);
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
      <div class="actions-container">
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

