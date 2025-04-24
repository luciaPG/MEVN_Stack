<template>
  <div class="episodio-card">
    <div class="episodio-content">
      <div class="episodio-info">
        <span class="episodio-numero">Episodio {{ numeroEpisodio }}</span>
        <h3 class="episodio-titulo">{{ nombre }}</h3>

        <div v-if="fechaFormateada" class="episodio-fecha">
          <span class="etiqueta">Estreno:</span> {{ fechaFormateada }}
        </div>

        <div v-if="sinopsis" class="episodio-sinopsis">
          <p>{{ sinopsis }}</p>
        </div>
      </div>

      <div class="episodio-actions">
        <button
          @click="toggleVisto"
          class="visto-btn"
          :class="{ visto: episodioVisto }"
          :title="episodioVisto ? 'Marcar como no visto' : 'Marcar como visto'"
        >
          <span v-if="episodioVisto">✓</span>
        </button>

        <button
          @click="eliminarEpisodio"
          class="delete-btn"
          title="Eliminar episodio"
        >
          🗑️
        </button>

        <router-link
          :to="`/episodios/${id}/editar`"
          class="edit-btn"
          title="Editar episodio"
        >
          ✏️
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed, ref } from "vue";
import defineEmits from "vue";

const props = defineProps({
  id: String,
  nombre: String,
  sinopsis: String,
  numeroEpisodio: Number,
  fechaEstreno: String,
  visto: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["eliminar", "actualizar-visto"]);

const episodioVisto = ref(props.visto);

const fechaFormateada = computed(() => {
  return props.fechaEstreno
    ? new Date(props.fechaEstreno).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Fecha no disponible";
});

const toggleVisto = () => {
  episodioVisto.value = !episodioVisto.value;
  emit("actualizar-visto", { id: props.id, visto: episodioVisto.value });
};

const eliminarEpisodio = () => {
  {
    emit("eliminar", props.id);
  }
};
</script>

<style scoped>
.episodio-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 1.25rem;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.episodio-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.episodio-content {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.episodio-info {
  flex-grow: 1;
}

.episodio-numero {
  display: block;
  font-weight: 600;
  color: #6b7280;
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
}

.episodio-titulo {
  margin: 0 0 0.5rem 0;
  color: #1f2937;
  font-size: 1.15rem;
  line-height: 1.4;
}

.episodio-fecha {
  color: #6b7280;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
}

.episodio-fecha .etiqueta {
  font-weight: 500;
  color: #4b5563;
}

.episodio-sinopsis {
  color: #4b5563;
  line-height: 1.5;
  font-size: 0.9rem;
}

.episodio-sinopsis p {
  margin: 0;
}

.episodio-actions {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
}

.visto-btn,
.delete-btn,
.edit-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 1rem;
}

.visto-btn {
  background-color: #f0fdf4;
  color: #16a34a;
  border: 1px solid #86efac;
}

.visto-btn.visto {
  background-color: #dcfce7;
  font-weight: bold;
}

.visto-btn:hover {
  background-color: #bbf7d0;
}

.delete-btn {
  background-color: #fee2e2;
  color: #dc2626;
}

.delete-btn:hover {
  background-color: #fecaca;
}

.edit-btn {
  background-color: #e0e7ff;
  color: #4f46e5;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-btn:hover {
  background-color: #c7d2fe;
}

@media (max-width: 768px) {
  .episodio-card {
    padding: 1rem;
  }

  .episodio-actions {
    flex-direction: column;
  }
}
</style>
