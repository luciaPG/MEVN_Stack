// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Login.vue";
import Dashboard from "../components/Dashboard.vue";
import Home from "../components/Home.vue"; // Asegúrate de tener un componente Home
import { authGuard } from "./authGuard";

const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/dashboard", component: Dashboard, beforeEnter: authGuard },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
