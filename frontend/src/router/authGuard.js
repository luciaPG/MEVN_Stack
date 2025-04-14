// src/router/authGuard.js
import { useAuth } from "../store/AuthContext";

export function authGuard(to, from, next) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    next(); // Permitir acceso
  } else {
    next("/login"); // Redirigir al login si no está autenticado
  }
}
