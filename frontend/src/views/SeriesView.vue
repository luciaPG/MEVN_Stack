<template>
  <div class="series-view">
    <h1>Lista de Series</h1>

    <div class="create-btn-container">
      <router-link to="/series/nueva" class="create-btn">
        <span class="icon">+</span> Crear Nueva Serie
      </router-link>
    </div>

    <div v-if="loading" class="loading">Cargando series...</div>

    <div v-else-if="series.length > 0" class="series-grid">
      <SerieCard
        v-for="serie in series"
        :key="serie._id"
        :id="serie._id"
        :nombre="serie.nombre"
        :sinopsis="serie.sinopsis"
        :genero="serie.genero"
        @eliminar="handleEliminarSerie"
      />
    </div>

    <div v-else class="no-series">
      <p>No hay series disponibles</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import SerieCard from "@/components/SerieCard.vue";

const series = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/series");
    series.value = res.data;
  } catch (err) {
    console.error("Error al obtener las series:", err);
  } finally {
    loading.value = false;
  }
});

const handleEliminarSerie = async (serieId) => {
  try {
    await axios.delete(`http://localhost:5000/api/series/${serieId}`);
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
  flex-direction: column;
  align-items: center;
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

.icon {
  font-weight: bold;
}
</style>
