export function authGuard(to, from, next) {
  const token = localStorage.getItem("jwt");

  if (token) {
    next();
  } else {
    next("/login");
  }
}
