<template>
  <div class="explorar-view">
    <div class="header">
      <h1>Explora todas las series</h1>
      
      <div class="create-btn-container" v-if="isAdmin">
        <router-link to="/series/nueva" class="create-btn">
          <span class="icon">+</span> Crear Nueva Serie
        </router-link>
      </div>
    </div>
    
    <div v-if="loading" class="loading-indicator">
      <p>Cargando series...</p>
    </div>
    
    <div v-else-if="!series || series.length === 0" class="no-series">
      <p>⚠️ No se encontraron series públicas para registrar</p>
    </div>
    
    <div v-else class="series-grid">
      <SerieCardPublic
        v-for="serie in series"
        :key="serie._id"
        :id="serie._id"
        :nombre="serie.nombre"
        :sinopsis="serie.sinopsis"
        :genero="serie.genero"
        @register="registerSerie"
        @unregister="unregisterSerie"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import SerieCardPublic from '../components/SerieCardPublic.vue';
import { globalAuth } from '../store/AuthContext';

const series = ref([]);
const loading = ref(true);
const error = ref(null);
const isAdmin = computed(() => globalAuth.isAdmin());

const fetchSeries = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await axios.get('http://localhost:5000/api/series');
    series.value = response.data;
  } catch (err) {
    console.error('Error al obtener series:', err);
    error.value = 'Error al cargar las series. Por favor, intente nuevamente.';
    series.value = [];
  } finally {
    loading.value = false;
  }
};

const registerSerie = async (serieId) => {
  if (!globalAuth.isAuthenticated()) {
    console.error('Usuario no autenticado');
    return;
  }
  
  try {
    const userId = globalAuth.getUserId();
    if (!userId) {
      console.error('No se pudo obtener el ID del usuario');
      return;
    }
    
    await axios.post(
      `http://localhost:5000/api/series/register/${serieId}`,
      { userId },
      { headers: globalAuth.getAuthHeaders() }
    );
    
    // Actualizar la lista después de registrar
    await fetchSeries();
  } catch (error) {
    console.error('Error al registrar serie:', error);
  }
};

const unregisterSerie = async (serieId) => {
  if (!globalAuth.isAuthenticated()) {
    console.error('Usuario no autenticado');
    return;
  }
  
  try {
    const userId = globalAuth.getUserId();
    if (!userId) {
      console.error('No se pudo obtener el ID del usuario');
      return;
    }
    
    await axios.delete(
      `http://localhost:5000/api/series/unregister/${serieId}`,
      { 
        headers: globalAuth.getAuthHeaders(),
        data: { userId }
      }
    );
    
    // Actualizar la lista después de desregistrar
    await fetchSeries();
  } catch (error) {
    console.error('Error al desregistrar serie:', error);
  }
};

onMounted(() => {
  fetchSeries();
});
</script>

<style scoped>
.explorar-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

h1 {
  font-size: 2rem;
  color: #333;
  margin: 4rem 0 1rem 0;
}

.create-btn-container {
  margin: 0;
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
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.loading-indicator {
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

.icon {
  font-weight: bold;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
  
  h1 {
    margin-top: 2rem;
    margin-bottom: 1rem;
  }
}
</style>