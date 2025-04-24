<template>
  <div class="crear-episodio-view">
    <div class="header">
      <h1>Crear Nuevo Episodio</h1>
    </div>

    <form @submit.prevent="handleSubmit" class="episodio-form">
      <div class="form-group">
        <label for="nombre">Nombre del episodio*</label>
        <input
          type="text"
          id="nombre"
          v-model="episodio.nombre"
          required
          placeholder="Ej: Pilot"
          class="form-input"
        />
      </div>

      <div class="form-group">
        <label for="numeroEpisodio">Número de episodio*</label>
        <input
          type="number"
          id="numeroEpisodio"
          v-model="episodio.numeroEpisodio"
          required
          min="1"
          class="form-input"
        />
      </div>

      <div class="form-group">
        <label for="fechaEstreno">Fecha de estreno</label>
        <input
          type="date"
          id="fechaEstreno"
          v-model="episodio.fechaEstreno"
          class="form-input"
        />
      </div>

      <div class="form-group">
        <label for="sinopsis">Sinopsis</label>
        <textarea
          id="sinopsis"
          v-model="episodio.sinopsis"
          rows="5"
          class="form-textarea"
          placeholder="Descripción del episodio..."
        ></textarea>
      </div>

      <div class="form-actions">
        <button type="button" @click="resetForm" class="cancel-btn">
          Limpiar
        </button>
        <button type="submit" class="submit-btn" :disabled="isSubmitting">
          <span v-if="!isSubmitting">Crear Episodio</span>
          <span v-else class="loading-spinner"></span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const isSubmitting = ref(false);
const temporadaId = ref("");
const serieId = ref("");

const episodio = ref({
  nombre: "",
  numeroEpisodio: "",
  fechaEstreno: "",
  sinopsis: "",
  temporada: "",
});

onMounted(() => {
  temporadaId.value = route.params.temporadaId;
  serieId.value = route.params.serieId;
  episodio.value.temporada = temporadaId.value;
});

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;

    const payload = {
      nombre: episodio.value.nombre.trim(),
      numeroEpisodio: parseInt(episodio.value.numeroEpisodio),
      temporada: temporadaId.value,
      sinopsis: episodio.value.sinopsis.trim(),
    };

    if (episodio.value.fechaEstreno) {
      payload.fechaEstreno = episodio.value.fechaEstreno;
    }

    await axios.post("http://localhost:5000/api/episodios", payload);
    router.push(`/series/${serieId.value}`);
  } catch (error) {
    console.error("Error al crear el episodio:", error);
    alert(
      "Ocurrió un error al crear el episodio. Por favor intenta nuevamente."
    );
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  episodio.value = {
    nombre: "",
    numeroEpisodio: "",
    fechaEstreno: "",
    sinopsis: "",
    temporada: temporadaId.value,
  };
};
</script>

<style scoped>
.crear-episodio-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.header {
  margin-bottom: 2rem;
  text-align: center;
}

.header h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.back-link {
  display: inline-block;
  color: #8c00d7;
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 1.5rem;
  transition: color 0.2s;
}

.back-link:hover {
  color: #6a00b8;
  text-decoration: underline;
}

.episodio-form {
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #444;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #8c00d7;
  box-shadow: 0 0 0 2px rgba(140, 0, 215, 0.1);
}

.form-textarea {
  min-height: 120px;
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.cancel-btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  color: #555;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.cancel-btn:hover {
  background: #f5f5f5;
}

.submit-btn {
  padding: 0.75rem 1.75rem;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #8c00d7 0%, #6a00b8 100%);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 160px;
}

.submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #7a00c2 0%, #5a00a0 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(140, 0, 215, 0.2);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .crear-episodio-view {
    padding: 1.5rem 1rem;
  }

  .episodio-form {
    padding: 1.5rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .cancel-btn,
  .submit-btn {
    width: 100%;
  }
}
</style>
