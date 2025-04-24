<template>
  <div class="serie-card">
    <h2 class="serie-nombre">{{ nombre }}</h2>
    <p class="serie-genero">{{ genero }}</p>
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
  background: #fcf3e4;
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

.serie-genero,
.serie-sinopsis {
  text-align: left;
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
