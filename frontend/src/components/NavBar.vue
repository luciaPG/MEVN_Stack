<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="logo">
        <router-link to="/" class="logo-link">
          <i class="fas fa-tv mr-2"></i>
          <img
            src="../assets/seriesTrackerLogo.png"
            alt="SeriesTracker"
            class="logo-image"
          />
        </router-link>
      </div>

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

      <div class="flex-grow"></div>

      <div class="actions">
        <button v-if="isAuthenticated" class="action-btn md:block hidden">
          <i class="fas fa-bell"></i>
        </button>

        <div v-if="isAuthenticated" class="profile-dropdown relative">
          <button @click="toggleDropdown" class="profile-btn">
            <img
              :src="userProfileImage"
              :alt="userName || 'Usuario'"
              class="profile-img"
              @error="handleImageError"
            />
            <i class="fas fa-chevron-down ml-1 text-xs hidden md:inline"></i>
          </button>

          <div v-if="isDropdownOpen" class="dropdown-menu">
            <a href="#" class="dropdown-item" @click="logout">
              <i class="fas fa-sign-out-alt mr-2"></i> Cerrar sesión
            </a>
          </div>
        </div>

        <div v-else class="login-button-container">
          <router-link to="/login" class="login-button">
            <i class="fas fa-sign-in-alt mr-2"></i>
            <span class="hidden md:inline">Iniciar sesión</span>
          </router-link>
        </div>

        <button @click="toggleMobileMenu" class="mobile-menu-btn md:hidden">
          <i class="fas fa-bars"></i>
        </button>
      </div>
    </div>

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

      <router-link
        v-if="!isAuthenticated"
        to="/login"
        class="mobile-menu-item"
        @click="isMobileMenuOpen = false"
      >
        <i class="fas fa-sign-in-alt mr-2"></i> Iniciar sesión
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../store/AuthContext";

const router = useRouter();
const authState = useAuth(); // This directly gets the auth object
const isDropdownOpen = ref(false);
const isMobileMenuOpen = ref(false);
const imageError = ref(false);

const isAuthenticated = computed(() => {
  return authState.isAuthenticated;
});

const userName = computed(() => {
  return authState.user?.username || "";
});

const userProfileImage = computed(() => {
  if (imageError.value || !authState.user?.profileImage) {
    return require("../assets/profile.jpeg");
  }
  return authState.user.profileImage;
});

const handleImageError = () => {
  imageError.value = true;
};

const navItems = [
  { name: "Series Populares", path: "/" },
  { name: "Mis Series", path: "/series" },
];

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
  if (isDropdownOpen.value) {
    isMobileMenuOpen.value = false;
  }
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  if (isMobileMenuOpen.value) {
    isDropdownOpen.value = false;
  }
};

const logout = () => {
  authState.logout(); // Call the logout method directly on authState
  router.push("/login");
  isDropdownOpen.value = false;
};
</script>

<style scoped>
.navbar {
  background: linear-gradient(90deg, #8c00d7, #eb7725);
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
}

.flex-grow {
  flex-grow: 1;
}

.logo {
  min-width: 150px;
}
.logo-image {
  height: 60px;
  width: auto;
  object-fit: contain;
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
  color: #ffffff;
}

.menu {
  display: flex;
  justify-content: space-;
  gap: 1rem;
  margin-left: 2rem;
}

.menu-item {
  color: #ffffff;
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
  background-color: #ffffff;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.menu-item:hover,
.menu-item.active {
  color: white;
  background-color: rgba(255, 255, 255, 0.2);
}

.menu-item.active::before {
  transform: scaleX(1);
}

.actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1.5rem;
}

.action-btn {
  background: none;
  border: none;
  color: #ffffff;
  font-size: 1rem;
  cursor: pointer;
  transition: color 0.3s ease;
  border-radius: 50%;
}

.action-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.profile-dropdown {
  margin-right: 0.5rem;
}

.profile-btn {
  display: flex;
  background: none;
  border: none;
  color: #ffffff;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 0.375rem;
  padding: 0.5rem;
}

.profile-img {
  width: 40px;
  height: 40px;
  align-self: flex-end;
  border-radius: 50%;
  border: 2px solid rgba(147, 64, 28, 0.456);
  transition: all 0.3s ease;
  object-fit: cover;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.profile-btn:hover .profile-img {
  border-color: white;
  transform: scale(1.05);
}

.profile-name {
  font-weight: 500;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.profile-img {
  animation: fadeIn 0.3s ease;
}

.login-button-container {
  margin-right: 0.5rem;
}

.login-button {
  display: flex;
  align-items: center;
  color: white;
  background-color: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
}

.login-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
  border-color: white;
  transform: translateY(-2px);
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 0.75rem);
  margin-top: 0.25rem;
  margin-right: 5%;
  background: linear-gradient(90deg, #8c00d7, #eb7725);
  border-radius: 0.375rem;
  box-shadow: 0 4px 10px rgba(204, 204, 204, 0.15);
  overflow: hidden;
  z-index: 20;
  min-width: 180px;
  border: linear-gradient(90deg, #8c00d7, #eb7725);
  animation: dropdownFadeIn 0.3s ease;
}

@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  display: flex;
  align-items: center;
  color: #ffffff;
  font-size: 0.875rem;
  padding: 0.75rem 1rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.dropdown-item:hover {
  background-color: rgba(225, 225, 225, 0.25);
}

.mobile-menu-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.3s ease;
}

.mobile-menu-btn:hover {
  color: rgba(255, 255, 255, 0.8);
}

.mobile-menu {
  background: linear-gradient(90deg, #8c00d7, #eb7725);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  animation: mobileFadeIn 0.3s ease;
}

@keyframes mobileFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.mobile-menu-item {
  color: white;
  font-size: 1rem;
  text-decoration: none;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  transition: all 0.3s ease;
}

.mobile-menu-item:hover,
.mobile-menu-item.active {
  background-color: rgba(255, 255, 255, 0.2);
}

@media (max-width: 768px) {
  .navbar-container {
    height: 60px;
    padding: 0 1rem;
  }

  .logo-link {
    font-size: 1.1rem;
  }

  .profile-img {
    width: 32px;
    height: 32px;
  }

  .logo {
    min-width: 100px;
  }

  .actions {
    gap: 1rem;
    padding-right: 0.5rem;
  }
}
</style>
