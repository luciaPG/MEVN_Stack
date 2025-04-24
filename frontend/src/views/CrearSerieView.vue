<template>
  <div class="crear-serie-view">
    <div class="header">
      <h1>Crear Nueva Serie</h1>
    </div>

    <form @submit.prevent="handleSubmit" class="serie-form">
      <div class="form-group">
        <label for="nombre">Nombre de la serie*</label>
        <input
          type="text"
          id="nombre"
          v-model="serie.nombre"
          required
          placeholder="Ej: Breaking Bad"
          class="form-input"
        />
      </div>

      <div class="form-group">
        <label for="genero">Género*</label>
        <input
          type="text"
          id="genero"
          v-model="serie.genero"
          required
          placeholder="Ej: Drama, Crimen"
          class="form-input"
        />
      </div>

      <div class="form-group">
        <label for="sinopsis">Sinopsis*</label>
        <textarea
          id="sinopsis"
          v-model="serie.sinopsis"
          required
          rows="5"
          class="form-textarea"
          placeholder="Descripción detallada de la serie..."
        ></textarea>
      </div>

      <div class="form-actions">
        <button type="button" @click="resetForm" class="cancel-btn">
          Limpiar
        </button>
        <button type="submit" class="submit-btn" :disabled="isSubmitting">
          <span v-if="!isSubmitting">Crear Serie</span>
          <span v-else class="loading-spinner"></span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const isSubmitting = ref(false);

const serie = ref({
  nombre: "",
  genero: "",
  sinopsis: "",
});

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;

    const response = await axios.post("http://localhost:5000/api/series", {
      nombre: serie.value.nombre.trim(),
      genero: serie.value.genero.trim(),
      sinopsis: serie.value.sinopsis.trim(),
    });

    router.push(`/detalles/${response.data._id}`);
  } catch (error) {
    console.error("Error al crear la serie:", error);
    alert("Ocurrió un error al crear la serie. Por favor intenta nuevamente.");
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  serie.value = {
    nombre: "",
    genero: "",
    sinopsis: "",
  };
};
</script>

<style scoped>
.crear-serie-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.header {
  margin-bottom: 2rem;
  text-align: center;
}

.header h1 {
  font-size: 2.2rem;
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

.serie-form {
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
  min-width: 120px;
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
  .crear-serie-view {
    padding: 1.5rem 1rem;
  }

  .serie-form {
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
