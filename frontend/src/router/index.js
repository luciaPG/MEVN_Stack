import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/LoginForm.vue";
import Dashboard from "../components/Dashboard.vue";
import Home from "../components/Home.vue";
import Register from "@/views/Register.vue";
import { authGuard } from "./authGuard";
import SeriesView from "@/views/SeriesView.vue";
import DetallesView from "@/views/DetallesView.vue";
import CrearSerieView from "@/views/CrearSerieView.vue";
import CrearTemporadaView from "@/views/CrearTemporadaView.vue";
import CrearEpisodioView from "@/views/CrearEpisodioView.vue";
import EditarSerieView from "@/views/EditarSerieView.vue";
import EditarTemporadaView from "@/views/EditarTemporadaView.vue";
import EditarEpisodioView from "@/views/EditarEpisodioView.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/dashboard", component: Dashboard, beforeEnter: authGuard },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { requiresAuth: false },
  },
  { path: "/series", component: SeriesView },
  { path: "/detalles/:id", component: DetallesView },
  { path: "/series/nueva", component: CrearSerieView },
  { path: "/series/:id/temporadas/nueva", component: CrearTemporadaView },
  {
    path: "/temporadas/:id/episodios/nuevo",
    component: CrearEpisodioView,
  },
  { path: "/series/:id/editar", component: EditarSerieView },
  { path: "/temporadas/:id/editar", component: EditarTemporadaView },
  { path: "/episodios/:id/editar", component: EditarEpisodioView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
