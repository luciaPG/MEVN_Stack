<template>
  <div class="series-view">
    <h1>Lista de Series</h1>
    <div class="series-grid">
      <SerieCard
        v-for="serie in series"
        :key="serie.id"
        :id="serie._id"
        :nombre="serie.nombre"
        :sinopsis="serie.sinopsis"
        :genero="serie.genero"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import SerieCard from "@/components/SerieCard.vue"; // Importa el componente de la tarjeta

const series = ref([]);

onMounted(async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/series"); // Suponiendo que el backend esté en esta URL
    series.value = res.data;
  } catch (err) {
    console.error("Error al obtener las series:", err);
  }
});
</script>

<style scoped>
.series-view {
  padding: 2rem;
  text-align: left;
}

h1 {
  text-align: center;
}

.series-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}
</style>
