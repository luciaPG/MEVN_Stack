<template>
  <nav class="navbar">
    <div class="navbar-container">
      <!-- Logo -->
      <div class="logo">
        <router-link to="/" class="logo-link">
          <i class="fas fa-chart-line mr-2"></i>
          <span>SeriesTracker</span>
        </router-link>
      </div>

      <!-- Menú principal (visible solo en pantallas medianas y grandes) -->
      <div class="menu hidden md:flex">
        <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="item.path"
          class="menu-item"
          active-class="active"
        >
          {{ item.name }}
        </router-link>
      </div>

      <!-- Espaciador flexible para empujar los elementos a los extremos -->
      <div class="flex-grow"></div>

      <!-- Usuario y acciones -->
      <div class="actions">
        <button class="action-btn md:block hidden">
          <i class="fas fa-bell"></i>
        </button>
        <div class="profile-dropdown relative">
          <button @click="toggleDropdown" class="profile-btn">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              class="profile-img"
            />
            <span class="ml-2 hidden md:inline">Usuario</span>
            <i class="fas fa-chevron-down ml-1 text-xs hidden md:inline"></i>
          </button>

          <!-- Menú desplegable -->
          <div v-if="isDropdownOpen" class="dropdown-menu">
            <router-link
              to="/profile"
              class="dropdown-item"
              @click="isDropdownOpen = false"
            >
              <i class="fas fa-user-circle mr-2"></i> Perfil
            </router-link>
            <a href="#" class="dropdown-item" @click="logout">
              <i class="fas fa-sign-out-alt mr-2"></i> Cerrar sesión
            </a>
          </div>
        </div>

        <!-- Botón de menú móvil -->
        <button @click="toggleMobileMenu" class="mobile-menu-btn md:hidden">
          <i class="fas fa-bars"></i>
        </button>
      </div>
    </div>

    <!-- Menú móvil desplegable -->
    <div v-if="isMobileMenuOpen" class="mobile-menu md:hidden">
      <router-link
        v-for="item in navItems"
        :key="item.name"
        :to="item.path"
        class="mobile-menu-item"
        active-class="active"
        @click="isMobileMenuOpen = false"
      >
        {{ item.name }}
      </router-link>
    </div>
  </nav>
</template>
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isDropdownOpen = ref(false);
const isMobileMenuOpen = ref(false); // Agregado: estado para el menú móvil

const navItems = [
  { name: "Inicio", path: "/" },
  { name: "Dashboard", path: "/dashboard" },
];

// Función para el dropdown del perfil
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
  // Si abrimos el dropdown, cerramos el menú móvil
  if (isDropdownOpen.value) {
    isMobileMenuOpen.value = false;
  }
};

// Agregada: función para el menú móvil
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  // Si abrimos el menú móvil, cerramos el dropdown
  if (isMobileMenuOpen.value) {
    isDropdownOpen.value = false;
  }
};

// Función para cerrar sesión
const logout = () => {
  localStorage.removeItem("jwt");
  router.push("/login");
  isDropdownOpen.value = false;
  isMobileMenuOpen.value = false;
};
</script>
<style scoped>
/* Estilo general de la barra de navegación */
.navbar {
  background: linear-gradient(90deg, #1e293b, #334155);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
}

.navbar-container {
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* Espaciador flexible */
.flex-grow {
  flex-grow: 1;
}

/* Estilo del logo */
.logo {
  min-width: 150px;
}

.logo-link {
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: color 0.3s ease;
}

.logo-link:hover {
  color: #cbd5e1;
}

/* Estilo del menú principal */
.menu {
  display: flex;
  gap: 1rem;
  margin-left: 2rem;
}

.menu-item {
  color: #cbd5e1;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: all 0.3s ease;
  position: relative;
  white-space: nowrap;
}

.menu-item::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: #ff6b6b;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.menu-item:hover,
.menu-item.active {
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
}

.menu-item.active::before {
  transform: scaleX(1);
}

/* Estilo de los botones de acción */
.actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
}

.action-btn {
  background: none;
  border: none;
  color: #cbd5e1;
  font-size: 1rem;
  cursor: pointer;
  transition: color 0.3s ease;
  border-radius: 50%;
  padding: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-btn:hover {
  color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Estilo del perfil */
.profile-btn {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: #cbd5e1;
  font-size: 0.875rem;
  cursor: pointer;
  transition: color 0.3s ease;
  border-radius: 0.375rem;
  padding: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-btn:hover {
  color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.profile-img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #475569;
}

/* Menú desplegable */
.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 0.5rem;
  background-color: #1e293b;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 20;
  min-width: 180px;
}

.dropdown-item {
  display: block;
  color: #cbd5e1;
  font-size: 0.875rem;
  padding: 0.75rem 1rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.dropdown-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

/* Botón de menú móvil */
.mobile-menu-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.3s ease;
}

.mobile-menu-btn:hover {
  color: #cbd5e1;
}

/* Menú móvil */
.mobile-menu {
  background-color: #1e293b;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mobile-menu-item {
  color: #cbd5e1;
  font-size: 1rem;
  text-decoration: none;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  transition: all 0.3s ease;
}

.mobile-menu-item:hover,
.mobile-menu-item.active {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

/* Media queries para ajustes específicos de pantallas */
@media (max-width: 768px) {
  .navbar-container {
    height: 60px;
    padding: 0 0.75rem;
  }

  .logo-link {
    font-size: 1.1rem;
  }

  .profile-img {
    width: 28px;
    height: 28px;
  }

  .logo {
    min-width: 100px;
  }
}
</style>
