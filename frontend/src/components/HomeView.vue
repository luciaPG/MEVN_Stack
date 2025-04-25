<template>
  <!-- Añadir una verificación para asegurar que series existe antes de acceder a su longitud -->
  <div class="series-container">
    <h1 class="page-title">Explora todas las series</h1>
    
    <!-- Mostrar mensaje de carga mientras se obtienen los datos -->
    <div v-if="loading" class="loading-indicator">
      <p>Cargando series...</p>
    </div>
    
    <!-- Mostrar este mensaje si no hay series o si hubo un error -->
    <div v-else-if="!series || series.length === 0" class="no-series">
      <p>⚠️ No se encontraron series públicas para registrar</p>
    </div>
    
    <!-- Mostrar las series solo cuando el array existe y tiene elementos -->
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
import { ref, onMounted } from 'vue';
import axios from 'axios';
import SerieCardPublic from '../components/SerieCardPublic.vue';
import { globalAuth } from '../store/AuthContext';

// Definir variables reactivas
const series = ref([]); // Inicializar como array vacío
const loading = ref(true);
const error = ref(null);

// Función para obtener las series
const fetchSeries = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await axios.get('http://localhost:5000/api/series');
    series.value = response.data;
  } catch (err) {
    console.error('Error al obtener series:', err);
    error.value = 'Error al cargar las series. Por favor, intente nuevamente.';
    series.value = []; // Asegurar que series es un array vacío en caso de error
  } finally {
    loading.value = false;
  }
};

// Función para registrar una serie
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
    
    console.log(`Serie ${serieId} registrada para el usuario ${userId}`);
  } catch (error) {
    console.error('Error al registrar serie:', error);
  }
};

// Función para eliminar registro de una serie
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
    
    console.log(`Serie ${serieId} desregistrada para el usuario ${userId}`);
  } catch (error) {
    console.error('Error al desregistrar serie:', error);
  }
};

// Cargar series cuando el componente se monta
onMounted(() => {
  fetchSeries();
});
</script>

<style scoped>
.series-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-title {
  font-size: 2rem;
  margin-top: 5rem;
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
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
</style>