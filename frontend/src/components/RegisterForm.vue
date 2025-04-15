<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h2>Crear Cuenta</h2>
        <p>Regístrate para comenzar a usar la plataforma</p>
      </div>
      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="username">Nombre de Usuario</label>
          <div class="input-with-icon">
            <i class="fas fa-user"></i>
            <input
              id="username"
              type="text"
              v-model="username"
              required
              autocomplete="username"
              placeholder="Tu nombre de usuario"
              minlength="3"
            />
          </div>
          <div v-if="validationErrors.username" class="validation-error">
            {{ validationErrors.username }}
          </div>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <div class="input-with-icon">
            <i class="fas fa-envelope"></i>
            <input
              id="email"
              type="email"
              v-model="email"
              required
              autocomplete="email"
              placeholder="ejemplo@email.com"
            />
          </div>
          <div v-if="validationErrors.email" class="validation-error">
            {{ validationErrors.email }}
          </div>
        </div>
        <div class="form-group">
          <label for="password">Contraseña</label>
          <div class="input-with-icon">
            <i class="fas fa-lock"></i>
            <input
              id="password"
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              required
              autocomplete="new-password"
              placeholder="Contraseña segura"
              minlength="8"
            />
            <button
              type="button"
              class="toggle-password"
              @click="showPassword = !showPassword"
            >
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
          <div v-if="validationErrors.password" class="validation-error">
            {{ validationErrors.password }}
          </div>
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirmar Contraseña</label>
          <div class="input-with-icon">
            <i class="fas fa-lock"></i>
            <input
              id="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              v-model="confirmPassword"
              required
              autocomplete="new-password"
              placeholder="Confirma tu contraseña"
            />
            <button
              type="button"
              class="toggle-password"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <i
                :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
              ></i>
            </button>
          </div>
          <div v-if="validationErrors.confirmPassword" class="validation-error">
            {{ validationErrors.confirmPassword }}
          </div>
        </div>
        <div class="form-group">
          <button type="submit" class="register-btn" :disabled="isLoading">
            <span v-if="isLoading" class="spinner"></span>
            <span v-else>Crear Cuenta</span>
          </button>
        </div>
        <div v-if="error" class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          {{ error }}
        </div>
        <div class="register-footer">
          ¿Ya tienes una cuenta?
          <router-link to="/login" class="login-link"
            >Inicia sesión</router-link
          >
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const username = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const error = ref("");
const router = useRouter();
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const isLoading = ref(false);

const validationErrors = reactive({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const validateForm = () => {
  let isValid = true;
  validationErrors.username = "";
  validationErrors.email = "";
  validationErrors.password = "";
  validationErrors.confirmPassword = "";

  if (username.value.length < 3) {
    validationErrors.username =
      "El nombre de usuario debe tener al menos 3 caracteres";
    isValid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    validationErrors.email = "Por favor, ingresa un email válido";
    isValid = false;
  }

  if (password.value !== confirmPassword.value) {
    validationErrors.confirmPassword = "Las contraseñas no coinciden";
    isValid = false;
  }

  return isValid;
};

const handleRegister = async () => {
  if (isLoading.value) return;

  if (!validateForm()) return;

  error.value = "";
  isLoading.value = true;

  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/register",
      {
        username: username.value,
        email: email.value,
        password: password.value,
      }
    );

    localStorage.setItem("jwt", response.data.token);

    router.push("/dashboard");
  } catch (err) {
    error.value = err.response?.data?.message || "Error al crear la cuenta";
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 1rem;
}

.register-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  transition: transform 0.3s ease;
}

.register-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.register-header h2 {
  color: #334155;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.register-header p {
  color: #64748b;
  font-size: 0.9rem;
}

.form-group {
  margin-bottom: 1.2rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #475569;
  font-size: 0.9rem;
}

.input-with-icon {
  position: relative;
}

.input-with-icon i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 1rem;
}

.input-with-icon input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  outline: none;
  font-size: 1rem;
}

.validation-error {
  color: #dc2626;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.register-btn {
  width: 100%;
  background: linear-gradient(90deg, #8c00d7, #eb7725);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px;
  width: 105%;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.register-btn:hover {
  background: linear-gradient(90deg, #2563eb, #1d4ed8);
  transform: translateY(-2px);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

.register-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

.error-message {
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 0.75rem;
  border-radius: 8px;
  margin-top: 1rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
}

.error-message i {
  margin-right: 8px;
  font-size: 1rem;
}

.register-footer {
  margin-top: 1.5rem;
  text-align: left;
  font-size: 0.9rem;
  color: #64748b;
}

.login-link {
  color: #3b82f6;
  font-weight: 500;
  text-decoration: none;
}

.login-link:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .register-card {
    padding: 1.5rem;
  }

  .register-header h2 {
    font-size: 1.3rem;
  }

  .register-header p {
    font-size: 0.8rem;
  }

  .input-with-icon input {
    padding: 10px 10px 10px 40px;
    font-size: 0.85rem;
  }

  .register-btn {
    padding: 10px;
    font-size: 0.9rem;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
