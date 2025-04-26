<template>
  <div class="crear-temporada-view">
    <div class="header">
      <h1>Crear Nueva Temporada</h1>
      <router-link :to="`/detalles/${serieId}`" class="back-link">
        ← Volver a la serie
      </router-link>
    </div>

    <form @submit.prevent="handleSubmit" class="temporada-form">
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <div class="form-group">
        <label for="numeroTemporada">Número de Temporada*</label>
        <input
          type="number"
          id="numeroTemporada"
          v-model.number="temporada.numeroTemporada"
          required
          min="1"
          class="form-input"
          :disabled="isSubmitting"
        />
        <small class="hint">Ingrese un número mayor a 0</small>
      </div>

      <div class="form-actions">
        <button
          type="button"
          @click="resetForm"
          class="cancel-btn"
          :disabled="isSubmitting"
        >
          Limpiar
        </button>
        <button
          type="submit"
          class="submit-btn"
          :disabled="isSubmitting || !temporada.numeroTemporada"
        >
          <span v-if="!isSubmitting">Crear Temporada</span>
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
const errorMessage = ref("");
const serieId = ref("");

const temporada = ref({
  numeroTemporada: null,
  serie: "",
});

onMounted(() => {
  const pathParts = route.path.split("/");
  serieId.value = pathParts[2];
  temporada.value.serie = serieId.value;
});

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    errorMessage.value = "";
    if (
      !temporada.value.numeroTemporada ||
      temporada.value.numeroTemporada < 1 ||
      temporada.value.numeroTemporada > 1000
    ) {
      errorMessage.value =
        "El número de temporada debe ser mayor a 0 y menor que 1000";
      return;
    }

    const response = await axios.post("http://localhost:5000/api/temporadas", {
      numeroTemporada: temporada.value.numeroTemporada,
      serie: serieId.value,
    });

    if (response.data && response.data._id) {
      router.push(`/detalles/${serieId.value}`);
    } else {
      throw new Error("No se recibió una respuesta válida del servidor");
    }
  } catch (error) {
    console.error("Error al crear la temporada:", error);

    if (error.response && error.response.data) {
      errorMessage.value =
        error.response.data.message ||
        "Ocurrió un error al crear la temporada. Por favor intenta nuevamente.";
    } else {
      errorMessage.value =
        error.message ||
        "Ocurrió un error al conectar con el servidor. Verifica tu conexión.";
    }
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  temporada.value = {
    numeroTemporada: null,
    serie: serieId.value,
  };
  errorMessage.value = "";
};
</script>

<style scoped>
.crear-temporada-view {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  padding-top: 80px;
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

.temporada-form {
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

.hint {
  display: block;
  margin-top: 0.25rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #8c00d7;
  box-shadow: 0 0 0 2px rgba(140, 0, 215, 0.1);
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

.cancel-btn:hover:not(:disabled) {
  background: #f5f5f5;
}

.cancel-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
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

.error-message {
  color: #dc2626;
  background-color: #fee2e2;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-weight: 500;
  text-align: center;
}

@media (max-width: 768px) {
  .crear-temporada-view {
    padding: 1.5rem 1rem;
    padding-top: 80px;
  }

  .temporada-form {
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
