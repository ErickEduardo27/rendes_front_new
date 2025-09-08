import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
import router from './router'
import naive from "naive-ui"; // importar todo naive-ui
import { VueQueryPlugin } from "@tanstack/vue-query";
import { createPinia } from "pinia";


import toast from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { Toaster } from "vue-sonner";
import 'element-plus/dist/index.css'
import 'vue-sonner/style.css'
import ElementPlus from 'element-plus'

const pinia = createPinia();
const app = createApp(App)

app.use(pinia)
app.use(VueQueryPlugin)
app.use(router);
app.use(naive);

app.use(toast, {
    autoClose: 3500,
    position: 'top-center',
    theme: 'colored',
    transition: 'slide',
});
app.use(ElementPlus)
app.component('Toaster', Toaster)

app.mount('#app') // 👈 Usa la misma instancia