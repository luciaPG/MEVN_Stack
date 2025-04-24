<template>
  <div class="serie-card">
    <h2 class="serie-nombre">{{ nombre }}</h2>
    <p class="serie-genero">
      <span class="badge genero">{{ genero }}</span>
    </p>
    <p class="serie-sinopsis">{{ sinopsis }}</p>
    <button @click="verDetalles" class="detalles-btn">Ver detalles</button>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  id: [String, Number],
  nombre: String,
  sinopsis: String,
  genero: String,
});

const verDetalles = () => {
  router.push(`/detalles/${props.id}`);
};
</script>

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

.detalles-btn {
  margin-top: 1rem;
  padding: 0.6rem 1rem;
  border: none;
  background-color: #007bff;
  color: white;
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.detalles-btn {
  width: 100%;
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
  position: relative;
}

.detalles-btn:hover {
  background: linear-gradient(90deg, #ea7626, #8d01d6);
  transform: translateY(-2px);
  box-shadow: 0 6px 10px rgba(37, 99, 235, 0.15);
}
</style>
