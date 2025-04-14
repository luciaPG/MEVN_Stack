<template>
  <div class="register-page">
    <div class="register-content">
      <div class="left-panel">
        <div class="brand">
          <i class="fas fa-code logo-icon"></i>
          <h1>MEVN App</h1>
        </div>
        <div class="welcome-message">
          <h2>¡Únete a nuestra comunidad!</h2>
          <p>
            Regístrate para acceder a todas las funcionalidades y comenzar a
            disfrutar de nuestra plataforma. Crear una cuenta es rápido y
            sencillo.
          </p>
        </div>
        <div class="testimonial">
          <p class="quote">
            "Esta plataforma ha transformado completamente mi forma de vivir.
            ¡Altamente recomendada!"
          </p>
          <div class="author">
            <i class="fas fa-user-circle author-icon"></i>
            <div class="author-info">
              <h4>María García</h4>
              <p>Usuario Premium</p>
            </div>
          </div>
        </div>
      </div>

      <div class="right-panel">
        <RegisterForm />
      </div>
    </div>
  </div>
</template>

<script>
import RegisterForm from "@/components/RegisterForm.vue";

export default {
  name: "UserRegister",
  components: {
    RegisterForm,
  },
};
</script>

<style scoped>
.register-page {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  padding: 2rem;
}

.register-content {
  width: 100%;
  max-width: 900px; /* Further reduced from 900px */
  display: flex;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.left-panel {
  width: 45%; /* Reduced from 50% */
  background: linear-gradient(135deg, #8c00d7, #eb7725);
  color: white;
  padding: 2rem; /* Further reduced from 2.5rem */
  display: flex;
  flex-direction: column;
}

.brand {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.logo-icon {
  font-size: 2rem;
  margin-right: 1rem;
}

.brand h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.welcome-message {
  flex: 1;
}

.welcome-message h2 {
  font-size: 1.8rem; /* Reduced from 2rem */
  margin-bottom: 1.2rem; /* Reduced from 1.5rem */
  font-weight: 700;
}

.welcome-message p {
  font-size: 0.95rem; /* Reduced from 1rem */
  line-height: 1.5; /* Slightly reduced from 1.6 */
  margin-bottom: 1.5rem; /* Reduced from 2rem */
  opacity: 0.9;
}

.features {
  margin-top: 2rem;
}

.feature {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.feature i {
  margin-right: 1rem;
  font-size: 1.2rem;
}

.testimonial {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 10px;
  margin-top: auto;
}

.quote {
  font-style: italic;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.author {
  display: flex;
  align-items: center;
}

.author-icon {
  font-size: 2rem;
  margin-right: 1rem;
}

.author-info h4 {
  margin: 0;
  font-weight: 600;
  font-size: 0.95rem;
}

.author-info p {
  margin: 0;
  font-size: 0.8rem;
  opacity: 0.8;
}

.right-panel {
  width: 55%; /* Increased from 50% to complement the left panel */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem; /* Reduced from 2rem */
}

@media (max-width: 992px) {
  .register-content {
    flex-direction: column;
  }

  .left-panel,
  .right-panel {
    width: 100%;
  }

  .left-panel {
    padding: 2rem;
    order: 2;
  }

  .right-panel {
    order: 1;
    padding-bottom: 0;
  }

  .welcome-message h2 {
    font-size: 1.5rem;
  }

  .testimonial {
    display: none;
  }
}

@media (max-width: 576px) {
  .register-page {
    padding: 1rem;
  }

  .left-panel {
    padding: 1.5rem;
  }

  .welcome-message h2 {
    font-size: 1.2rem;
  }

  .welcome-message p {
    font-size: 0.9rem;
  }
}
</style>
