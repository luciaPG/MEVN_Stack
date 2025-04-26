<template>
  <div class="detalles-view">
    <div class="action-buttons" v-if="isAdmin">
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
          v-for="temporada in temporadasOrdenadas"
          :key="temporada._id"
          class="temporada"
        >
          <div class="temporada-header">
            <div>
              <h2>Temporada {{ temporada.numeroTemporada }}</h2>
              <p class="temporada-info">
                {{ temporada.episodios?.length || 0 }} episodios
              </p>
            </div>
            <div class="temporada-actions" v-if="isAdmin">
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
              v-for="episodio in episodiosOrdenados(temporada.episodios)"
              :key="episodio._id || episodio.id"
              :nombre="episodio.nombre"
              :sinopsis="episodio.sinopsis"
              :numeroEpisodio="episodio.numeroEpisodio"
              :fechaEstreno="episodio.fechaEstreno"
              :id="episodio._id || episodio.id"
              :visto="esEpisodioVisto(episodio._id || episodio.id)"
              @eliminar="eliminarEpisodio"
              @actualizar-visto="toggleEpisodioVisto"
              :isAdmin="isAdmin"
            />
          </div>

          <div class="add-episodio-container" v-if="isAdmin">
            <router-link
              :to="`/temporadas/${temporada._id}/episodios/nuevo`"
              class="add-episodio-btn"
            >
              + Añadir Episodio
            </router-link>
          </div>
        </div>
      </div>

      <div class="crear-temporada-container" v-if="isAdmin">
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
import { ref, onMounted, computed, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import EpisodioCard from "@/components/EpisodioCard.vue";
import { globalAuth } from "../store/AuthContext";

const route = useRoute();
const router = useRouter();
const serie = ref(null);
const temporadas = ref([]);
const loading = ref(true);
const episodiosVistos = reactive({});

const isAuthenticated = computed(() => globalAuth && globalAuth.isAuthenticated);
const authUser = computed(() => globalAuth && globalAuth.user);
const isAdmin = computed(() => globalAuth.isAdmin());

const temporadasOrdenadas = computed(() => {
  return [...(temporadas.value || [])].sort(
    (a, b) => a.numeroTemporada - b.numeroTemporada
  );
});

const episodiosOrdenados = (episodios) => {
  return [...(episodios || [])].sort((a, b) => a.numeroEpisodio - b.numeroEpisodio);
};

onMounted(async () => {
  await cargarDatos();
  if (isAuthenticated.value && authUser.value) {
    await cargarProgresos();
  }
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
    temporadas.value = tempRes.data || [];

    // Cargar episodios para cada temporada
    for (const temporada of temporadas.value) {
      try {
        const episodiosRes = await axios.get(
          `http://localhost:5000/api/episodios/temporada/${temporada._id}`
        );
        temporada.episodios = (episodiosRes.data || []).map(ep => ({
          ...ep,
          _id: ep._id || ep.id // Usar id como fallback
        }));
      } catch (error) {
        console.error(`Error cargando episodios para temporada ${temporada._id}:`, error);
        temporada.episodios = [];
      }
    }
  } catch (err) {
    console.error("Error al cargar los detalles:", err);
  } finally {
    loading.value = false;
  }
};

const cargarProgresos = async () => {
  if (!authUser.value?._id) return;

  try {
    const response = await axios.get(
      `http://localhost:5000/api/progreso/usuario/${authUser.value._id}/serie/${route.params.id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      }
    );
    
    // Limpiar el objeto reactivo
    Object.keys(episodiosVistos).forEach(key => delete episodiosVistos[key]);
    
    // Asignar nuevos valores
    response.data.forEach(progreso => {
      const episodioId = progreso.episodio?._id || progreso.episodio;
      if (episodioId) {
        episodiosVistos[episodioId] = progreso.visto;
      }
    });
  } catch (error) {
    console.error("Error al cargar progresos:", error);
  }
};

const esEpisodioVisto = (episodioId) => {
  if (!episodioId) return false;
  return !!episodiosVistos[episodioId];
};

const toggleEpisodioVisto = async (episodioId) => {
  if (!authUser.value?._id) {
    alert("Debes iniciar sesión para registrar tu progreso");
    return;
  }

  try {
    const nuevoEstado = !episodiosVistos[episodioId];
    
    // Verificar si ya existe un registro de progreso
    const progresoExistente = await axios.get(
      `http://localhost:5000/api/progreso/usuario/${authUser.value._id}/episodio/${episodioId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      }
    );

    if (progresoExistente.data) {
      // Actualizar progreso existente
      await axios.put(
        `http://localhost:5000/api/progreso/${progresoExistente.data._id}`,
        { visto: nuevoEstado },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );
    } else {
      // Crear nuevo progreso
      await axios.post(
        "http://localhost:5000/api/progreso",
        {
          episodio: episodioId,
          visto: nuevoEstado,
          usuario: authUser.value._id,
          serie: serie.value._id
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );
    }

    // Actualizar el estado local inmediatamente
    episodiosVistos[episodioId] = nuevoEstado;
    
  } catch (error) {
    console.error("Error al actualizar estado de episodio:", error);
    alert("No se pudo actualizar el estado del episodio");
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
    const response = await axios.delete(
      `http://localhost:5000/api/series/${serie.value._id}`,
      {
        headers: globalAuth.getAuthHeaders()
      }
    );

    if (response.status === 200 || response.status === 204) {
      router.push("/series");
    } else {
      throw new Error("No se recibió una respuesta válida del servidor");
    }
  } catch (error) {
    console.error("Error al eliminar la serie:", {
      error: error.message,
      response: error.response?.data,
    });
    alert("Ocurrió un error al eliminar la serie");
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
    await axios.delete(`http://localhost:5000/api/temporadas/${temporadaId}`, {
      headers: globalAuth.getAuthHeaders()
    });
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
    await axios.delete(`http://localhost:5000/api/episodios/${episodioId}`, {
      headers: globalAuth.getAuthHeaders()
    });
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
  margin: 6rem auto 2rem auto; /* Margen superior aumentado para la navbar */
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

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-bottom: 2rem;
  position: sticky;
  top: 5rem; /* Ajuste para la navbar */
  z-index: 10;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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

.crear-temporada-container {
  margin-top: 2rem;
  text-align: center;
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

@media (max-width: 768px) {
  .detalles-view {
    padding: 1.5rem;
    margin-top: 5rem; /* Menos margen en móvil */
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

  .action-buttons {
    top: 4rem;
    padding: 0.5rem;
  }
}
</style>