<template>
  <div class="serie-card">
    <div class="serie-info">
      <h3>{{ nombre }}</h3>
      <p class="sinopsis">{{ sinopsis }}</p>
      
      <div class="progress-container" v-if="progreso !== undefined">
        <div class="progress-label">
          <span>Progreso: {{ progreso }}%</span>
          <span>{{ episodiosVistos }}/{{ totalEpisodios }} episodios</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${progreso}%` }" :class="progressClass"></div>
        </div>
      </div>
      
      <div class="generos">
        <span v-for="(gen, index) in generoArray" :key="index" class="genero-tag">
          {{ gen }}
        </span>
      </div>
      
      <div class="actions">
        <router-link :to="`/detalles/${id}`" class="action-btn watch">Ver</router-link>
        <button @click="confirmDelete" class="action-btn delete">Eliminar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Import the functions that ESLint is complaining about
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  id: String,
  nombre: String,
  sinopsis: String,
  genero: {
    type: [Array, String],
    default: () => []
  },
  progreso: {
    type: Number,
    default: undefined
  },
  episodiosVistos: {
    type: Number,
    default: 0
  },
  totalEpisodios: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits([
  "eliminar"
]);

import { computed } from "vue";


const generoArray = computed(() => {
  if (Array.isArray(props.genero)) {
    return props.genero;
  } else if (typeof props.genero === "string") {
    return props.genero.split(",").map(g => g.trim());
  }
  return [];
});

const progressClass = computed(() => {
  if (props.progreso === 100) return "complete";
  if (props.progreso > 75) return "almost-complete";
  if (props.progreso > 25) return "in-progress";
  return "just-started";
});

const confirmDelete = () => {
  if (confirm(`¿Estás seguro de que deseas eliminar la serie "${props.nombre}"?`)) {
    emit("eliminar", props.id);
  }
};
</script>

<style scoped>
.serie-card {
  width: 300px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  background-color: white;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.serie-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.serie-image {
  height: 200px;
  position: relative;
  overflow: hidden;
}

.serie-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.serie-card:hover .serie-image img {
  transform: scale(1.05);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.serie-card:hover .overlay {
  opacity: 1;
}

.view-btn {
  padding: 8px 16px;
  background-color: #8c00d7;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.3s;
}

.view-btn:hover {
  background-color: #7a00b8;
}

.serie-info {
  padding: 1.25rem;
}

h3 {
  margin: 0 0 0.75rem;
  font-size: 1.25rem;
  color: #333;
}

.sinopsis {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.progress-container {
  margin-bottom: 1rem;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  color: #555;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background-color: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease;
}

.progress-fill.just-started {
  background: linear-gradient(90deg, #4A90E2, #5A9AE6);
}

.progress-fill.in-progress {
  background: linear-gradient(90deg, #F5A623, #F7B946);
}

.progress-fill.almost-complete {
  background: linear-gradient(90deg, #7ED321, #8FDB3E);
}

.progress-fill.complete {
  background: linear-gradient(90deg, #50E3C2, #6CE9CF);
}

.generos {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.genero-tag {
  font-size: 0.7rem;
  padding: 4px 8px;
  background-color: #f0f0f0;
  color: #555;
  border-radius: 4px;
}

.actions {
  display: flex;
  justify-content: space-between;
}

.action-btn {
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  text-align: center;
  cursor: pointer;
  border: none;
  transition: all 0.3s;
}

.action-btn.watch {
  background-color: #8c00d7;
  color: white;
  flex: 1;
}

.action-btn.watch:hover {
  background-color: #7a00b8;
}

.action-btn.delete {
  background-color: #FF3B30;
  color: white;
  margin-left: 0.5rem;
}

.action-btn.delete:hover {
  background-color: #E02C22;
}
</style>