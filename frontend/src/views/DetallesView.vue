<template>
  <div class="detalles-view">
    <div class="action-buttons">
      <button @click="eliminarSerie" class="delete-btn">
        <span class="icon">🗑️</span> Eliminar Serie
      </button>
      <router-link :to="`/series/${route.params.id}/editar`" class="edit-btn">
        <span class="icon">✏️</span> Editar Serie
      </router-link>
    </div>

    <div v-if="loading" class="loading">Cargando detalles de la serie...</div>

    <div v-else-if="serie">
      <div class="serie-header">
        <h1>{{ serie.nombre }}</h1>
        <p class="serie-meta">
          <span class="badge genero">{{ serie.genero }}</span>
        </p>
      </div>

      <div class="serie-sinopsis">
        <h3>Sinopsis</h3>
        <p>{{ serie.sinopsis || "No hay sinopsis disponible" }}</p>
      </div>

      <div v-if="!temporadas || temporadas.length === 0" class="no-content">
        <p>Esta serie no tiene temporadas registradas.</p>
      </div>

      <div v-else class="temporadas-container">
        <div
          v-for="temporada in temporadas"
          :key="temporada._id"
          class="temporada"
        >
          <div class="temporada-header">
            <div>
              <h2>Temporada {{ temporada.numeroTemporada }}</h2>
              <p class="temporada-info">
                {{ temporada.episodios.length }} episodios
              </p>
            </div>
            <div class="temporada-actions">
              <button
                @click="eliminarTemporada(temporada._id)"
                class="small-delete-btn"
                title="Eliminar temporada"
              >
                🗑️
              </button>
              <router-link
                :to="`/temporadas/${temporada._id}/editar`"
                class="small-edit-btn"
                title="Editar temporada"
              >
                ✏️
              </router-link>
            </div>
          </div>

          <div
            v-if="!temporada.episodios || temporada.episodios.length === 0"
            class="no-episodios"
          >
            <p>No hay episodios en esta temporada</p>
          </div>

          <div v-else class="episodios-list-vertical">
            <EpisodioCard
              v-for="episodio in temporada.episodios"
              :key="episodio._id"
              :nombre="episodio.nombre"
              :sinopsis="episodio.sinopsis"
              :numeroEpisodio="episodio.numeroEpisodio"
              :fechaEstreno="episodio.fechaEstreno"
              :id="episodio._id"
              @eliminar="eliminarEpisodio"
            />
          </div>

          <div class="add-episodio-container">
            <router-link
              :to="`/series/:id/temporadas/${temporada._id}/episodios/nuevo`"
              class="add-episodio-btn"
            >
              + Añadir Episodio
            </router-link>
          </div>
        </div>
      </div>

      <div class="crear-temporada-container">
        <router-link
          :to="`/series/${serie._id}/temporadas/nueva`"
          class="crear-temporada-btn"
        >
          <span class="icono">+</span> Crear Nueva Temporada
        </router-link>
      </div>
    </div>

    <div v-else class="no-content">
      <p>No se encontró la serie solicitada</p>
      <router-link to="/series" class="back-link"
        >Volver al listado</router-link
      >
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import EpisodioCard from "@/components/EpisodioCard.vue";

const route = useRoute();
const router = useRouter();
const serie = ref(null);
const temporadas = ref([]);
const loading = ref(true);

onMounted(async () => {
  await cargarDatos();
});

const cargarDatos = async () => {
  try {
    loading.value = true;
    const id = route.params.id;

    const [serieRes, tempRes] = await Promise.all([
      axios.get(`http://localhost:5000/api/series/${id}`),
      axios.get(`http://localhost:5000/api/temporadas/serie/${id}`),
    ]);

    serie.value = serieRes.data;
    temporadas.value = tempRes.data;

    // Cargar episodios para cada temporada
    for (const temporada of temporadas.value) {
      const episodiosRes = await axios.get(
        `http://localhost:5000/api/episodios/temporada/${temporada._id}`
      );
      temporada.episodios = episodiosRes.data;
    }
  } catch (err) {
    console.error("Error al cargar los detalles:", err);
  } finally {
    loading.value = false;
  }
};

const eliminarSerie = async () => {
  if (
    !confirm(
      "¿Estás seguro de que quieres eliminar esta serie? Esta acción no se puede deshacer."
    )
  ) {
    return;
  }

  try {
    await axios.delete(`http://localhost:5000/api/series/${serie.value._id}`);
    router.push("/series");
  } catch (error) {
    console.error("Error al eliminar la serie:", error);
    alert("No se pudo eliminar la serie");
  }
};

const eliminarTemporada = async (temporadaId) => {
  if (
    !confirm(
      "¿Estás seguro de que quieres eliminar esta temporada? Todos sus episodios también se eliminarán."
    )
  ) {
    return;
  }

  try {
    await axios.delete(`http://localhost:5000/api/temporadas/${temporadaId}`);
    await cargarDatos();
  } catch (error) {
    console.error("Error al eliminar la temporada:", error);
    alert("No se pudo eliminar la temporada");
  }
};

const eliminarEpisodio = async (episodioId) => {
  if (!confirm("¿Estás seguro de que quieres eliminar este episodio?")) {
    return;
  }

  try {
    await axios.delete(`http://localhost:5000/api/episodios/${episodioId}`);
    await cargarDatos();
  } catch (error) {
    console.error("Error al eliminar el episodio:", error);
    alert("No se pudo eliminar el episodio");
  }
};
</script>

<style scoped>
.detalles-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 80vh;
}

.loading {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #666;
}

.no-content {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #666;
  background: #f9f9f9;
  border-radius: 8px;
  margin: 2rem 0;
}

.back-link {
  display: inline-block;
  margin-top: 1rem;
  color: #8c00d7;
  text-decoration: none;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  background-color: #f3e8ff;
  transition: all 0.2s ease;
}

.back-link:hover {
  text-decoration: none;
  background-color: #e9d5ff;
}

.serie-header {
  margin-bottom: 2rem;
  text-align: center;
}

.serie-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #333;
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

.serie-sinopsis {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.serie-sinopsis h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #444;
  font-size: 1.3rem;
}

.serie-sinopsis p {
  margin: 0;
  line-height: 1.6;
  color: #555;
}

.temporadas-container {
  margin-top: 2rem;
}

.temporada {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 3rem;
  overflow: hidden;
}

.temporada-header {
  padding: 1.25rem 1.5rem;
  background: #f3f4f6;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.temporada-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

.temporada-info {
  margin: 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.no-episodios {
  padding: 2rem;
  text-align: center;
  color: #666;
  font-style: italic;
  background: #fafafa;
}

.episodios-list-vertical {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
}

@media (max-width: 768px) {
  .detalles-view {
    padding: 1.5rem;
  }

  .serie-header h1 {
    font-size: 2rem;
  }

  .temporada-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 1rem;
  }

  .episodios-list-vertical {
    padding: 1rem;
    gap: 1.25rem;
  }
  .crear-temporada-container {
    margin-top: 2rem;
    text-align: center;
  }
  .crear-temporada-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: center;
  }
  .crear-temporada-btn {
    background: linear-gradient(135deg, #8c00d7 0%, #6a00b8 100%);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    box-shadow: 0 4px 6px rgba(140, 0, 215, 0.2);
  }

  .crear-temporada-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(140, 0, 215, 0.3);
    background: linear-gradient(135deg, #7a00c2 0%, #5a00a0 100%);
  }

  .crear-temporada-btn:active {
    transform: translateY(0);
  }

  .icono {
    font-size: 1.2rem;
    font-weight: bold;
  }
}
.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-bottom: 2rem;
}

.delete-btn,
.edit-btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.delete-btn {
  background-color: #fee2e2;
  color: #dc2626;
  border: 1px solid #fca5a5;
}

.delete-btn:hover {
  background-color: #fecaca;
}

.edit-btn {
  background-color: #e0e7ff;
  color: #4f46e5;
  border: 1px solid #c7d2fe;
  text-decoration: none;
}

.edit-btn:hover {
  background-color: #c7d2fe;
}

.temporada-actions {
  display: flex;
  gap: 0.5rem;
}

.small-delete-btn,
.small-edit-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.small-delete-btn {
  background-color: #fee2e2;
  color: #dc2626;
}

.small-delete-btn:hover {
  background-color: #fecaca;
}

.small-edit-btn {
  background-color: #e0e7ff;
  color: #4f46e5;
  text-decoration: none;
}

.small-edit-btn:hover {
  background-color: #c7d2fe;
}

.add-episodio-container {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.add-episodio-btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #f3e8ff;
  color: #8c00d7;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.add-episodio-btn:hover {
  background-color: #e9d5ff;
}

.crear-temporada-btn {
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

.crear-temporada-btn:hover {
  background: linear-gradient(135deg, #7a00c2 0%, #5a00a0 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(140, 0, 215, 0.2);
}

.icono {
  font-weight: bold;
  font-size: 1.2rem;
}
</style>
