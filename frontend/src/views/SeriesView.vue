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
        @eliminar="handleEliminarSerie" @serie-eliminada="handleSerieEliminada" />
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

const loadSeries = async () => {
  loading.value = true;
  try {
    const userId = globalAuth.getUserId();
    if (!userId) {
      console.error("No se pudo obtener el ID del usuario.");
      return;
    }

    const headers = globalAuth.getAuthHeaders();
    const res = await axios.get(`http://localhost:5000/api/progreso/series/${userId}`, {
      headers: headers
    });

    series.value = res.data.map(serie => ({
      ...serie,
      progreso: serie.totalEpisodios > 0
        ? Math.round((serie.episodiosVistos / serie.totalEpisodios) * 100)
        : 0
    }));
  } catch (err) {
    console.error("Error al obtener las series:", err);
    if (err.response?.status === 401) {
      globalAuth.logout();
      alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
      window.location.href = '/login';
    }
  } finally {
    loading.value = false;
  }
};

onMounted(loadSeries);

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

const handleSerieEliminada = async () => {
  try {
    // Recargar las series
    await loadSeries();
  } catch (error) {
    console.error("Error al recargar las series:", error);
  }
};
</script>

<style scoped>
.series-view {
  margin-top: 15rem;
  padding: 2rem;
  text-align: center;
  max-width: 1200px;
 
  margin: 0 auto;
}

h1 {
  font-size: 2.5rem;
  margin-top: 4rem;
  color: #333;
  margin-bottom: 2rem;
}

.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  gap: 0.5rem;
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