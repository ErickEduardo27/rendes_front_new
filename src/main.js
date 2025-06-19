import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
import router from './router'
import naive from "naive-ui"; // importar todo naive-ui

const app = createApp(App)


app.use(router);
app.use(naive); //


app.mount('#app') // 👈 Usa la misma instancia
