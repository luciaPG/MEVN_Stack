<template>
  <div class="series-view">
    <h1>Tus Series Vistas</h1>

    <div class="create-btn-container" v-if="isAdmin">
      <router-link to="/series/nueva" class="create-btn">
        <span class="icon">+</span> Crear Nueva Serie
      </router-link>
    </div>

    <div v-if="loading" class="loading">Cargando series...</div>

    <div v-else-if="filteredSeries.length > 0" class="series-grid">
      <SerieCard v-for="serie in filteredSeries" :key="serie._id" :id="serie._id" :nombre="serie.nombre"
        :sinopsis="serie.sinopsis" :genero="serie.genero" :progreso="serie.progreso"
        :episodiosVistos="serie.episodiosVistos" :totalEpisodios="serie.totalEpisodios"
        @eliminar="handleEliminarSerie" />
    </div>

    <div v-else class="no-series">
      <p v-if="activeTab === 'todas'">No tienes series registradas</p>
      <p v-else-if="activeTab === 'progreso'">No tienes series en progreso</p>
      <p v-else>No tienes series completadas</p>

      <div v-if="activeTab === 'todas'" class="explore-container">
        <router-link to="/explorar" class="explore-btn">
          Explorar catálogo de series
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import SerieCard from "@/components/SerieCard.vue";
import { globalAuth } from "../store/AuthContext";

const series = ref([]);
const loading = ref(true);
const activeTab = ref('todas');
const isAdmin = computed(() => globalAuth.isAdmin());

// Series filtradas según la pestaña activa
const filteredSeries = computed(() => {
  if (activeTab.value === 'todas') {
    return series.value;
  } else if (activeTab.value === 'progreso') {
    return series.value.filter(serie =>
      serie.episodiosVistos > 0 && serie.episodiosVistos < serie.totalEpisodios
    );
  } else if (activeTab.value === 'completadas') {
    return series.value.filter(serie =>
      serie.episodiosVistos === serie.totalEpisodios && serie.totalEpisodios > 0
    );
  }
  return series.value;
});

onMounted(async () => {
  loading.value = true;

  try {
    // Asegurarse de que el usuario esté cargado antes de hacer la petición
    await globalAuth.loadUserData();

    const userId = globalAuth.getUserId();
    if (!userId) {
      console.error("No se pudo obtener el ID del usuario.");
      return;
    }

    // Debug: Check authentication state
    console.log("Auth State:", {
      isAuthenticated: globalAuth.isAuthenticated,
      userId: globalAuth.getUserId(),
      token: globalAuth.token ? 'Token exists' : 'No token'
    });

    // Get auth headers with token
    const headers = globalAuth.getAuthHeaders();
    console.log("Using headers:", headers);

    // Make the API request with auth headers
    const res = await axios.get(`http://localhost:5000/api/progreso/series/${userId}`, {
      headers: headers
    });

    series.value = res.data.map(serie => ({
      ...serie,
      progreso: serie.totalEpisodios > 0
        ? Math.round((serie.episodiosVistos / serie.totalEpisodios) * 100)
        : 0
    }));

    console.log("Series con progreso:", series.value);
  } catch (err) {
    console.error("Error al obtener las series:", err);
    
    // Check specific error details
    if (err.response) {
      console.error("Response status:", err.response.status);
      console.error("Response data:", err.response.data);
      
      // If token expired or invalid, try to reload user data and retry
      if (err.response.status === 401) {
        console.log("Token expired or invalid. Trying to refresh authentication...");
        globalAuth.logout(); // Force logout to clear invalid token
        alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
        // Redirect to login page
        window.location.href = '/login';
      }
    }
  } finally {
    loading.value = false;
  }
});

const handleEliminarSerie = async (serieId) => {
  try {
    // Solo los administradores pueden eliminar series
    if (!isAdmin.value) {
      alert("No tienes permisos para eliminar series");
      return;
    }

    await axios.delete(`http://localhost:5000/api/series/${serieId}`, {
      headers: globalAuth.getAuthHeaders()
    });
    series.value = series.value.filter((serie) => serie._id !== serieId);
  } catch (error) {
    console.error("Error al eliminar la serie:", error);
    alert("No se pudo eliminar la serie");
  }
};
</script>

<style scoped>
.series-view {
  padding: 2rem;
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1.5rem;
}

.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  gap: 0.5rem;
}

.tab-btn {
  padding: 0.75rem 1.5rem;
  background-color: #f0f0f0;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  color: #555;
  transition: all 0.3s;
}

.tab-btn:hover {
  background-color: #e0e0e0;
}

.tab-btn.active {
  background: linear-gradient(135deg, #8c00d7 0%, #6a00b8 100%);
  color: white;
  font-weight: 600;
}

.create-btn-container {
  margin-bottom: 2rem;
  text-align: center;
}

.create-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #8c00d7 0%, #6a00b8 100%);
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
}

.create-btn:hover {
  background: linear-gradient(135deg, #7a00c2 0%, #5a00a0 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(140, 0, 215, 0.2);
}

.series-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-size: 1.2rem;
}

.no-series {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-size: 1.2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-top: 1rem;
}

.explore-container {
  margin-top: 1.5rem;
}

.explore-btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #00a3d7 0%, #0074b8 100%);
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
}

.explore-btn:hover {
  background: linear-gradient(135deg, #0091c2 0%, #0065a0 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 140, 215, 0.2);
}

.icon {
  font-weight: bold;
}
</style>