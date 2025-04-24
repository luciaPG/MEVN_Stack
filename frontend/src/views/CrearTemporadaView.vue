<template>
  <div class="crear-temporada-view">
    <div class="header">
      <h1>Crear Nueva Temporada</h1>
    </div>

    <form @submit.prevent="handleSubmit" class="temporada-form">
      <div class="form-group">
        <label for="numeroTemporada">Número de Temporada*</label>
        <input
          type="number"
          id="numeroTemporada"
          v-model="temporada.numeroTemporada"
          required
          min="1"
          class="form-input"
        />
      </div>

      <div class="form-actions">
        <button type="button" @click="resetForm" class="cancel-btn">
          Limpiar
        </button>
        <button type="submit" class="submit-btn" :disabled="isSubmitting">
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
const serieId = ref("");

const temporada = ref({
  numeroTemporada: "",
  serie: "",
});

onMounted(() => {
  serieId.value = route.params.serieId;
  temporada.value.serie = serieId.value;
});

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;

    await axios.post("http://localhost:5000/api/temporadas", {
      numeroTemporada: parseInt(temporada.value.numeroTemporada),
      serie: serieId.value,
    });

    router.push(`/series/${serieId.value}`);
  } catch (error) {
    console.error("Error al crear la temporada:", error);
    alert(
      "Ocurrió un error al crear la temporada. Por favor intenta nuevamente."
    );
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  temporada.value = {
    numeroTemporada: "",
    serie: serieId.value,
  };
};
</script>

<style scoped>
.crear-temporada-view {
  max-width: 600px;
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
  .crear-temporada-view {
    padding: 1.5rem 1rem;
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
