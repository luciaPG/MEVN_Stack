import { createApp, h } from "vue"; // Importa 'h'
import App from "./App.vue";
import router from "./router";
import { provideAuth } from "./store/AuthContext";

const app = createApp({
  setup() {
    provideAuth(); // Proveer el contexto de autenticación
  },
  render: () => h(App), // Usa 'h' para renderizar el componente raíz
});

app.use(router);
app.mount("#app");
