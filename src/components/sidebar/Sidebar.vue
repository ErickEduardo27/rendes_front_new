<template>
  <aside class="w-64 bg-cyan-50 h-screen flex flex-col border-r border-cyan-100">
    <div class="flex justify-center items-center bg-gradient-to-r from-cyan-100 via-cyan-50 to-white border-b border-cyan-100" >
        <div class="flex items-center ml-3.5">
            <img src="../../assets/logo_mini.png" alt="logo" class="object-contain w-28 h-28 mx-auto" />
        </div>
    
        <div class="p-6">
            <h1 class="text-base font-semibold text-cyan-800">Centro Nacional de Salud Renal</h1>
        </div>
    </div>

    <nav class="flex-1 px-4 py-6 space-y-2 text-sm text-gray-700 bg-gradient-to-b from-white via-cyan-50 to-cyan-50">
        <div class="flex items-center justify-between mb-4">
            <span class="px-1 text-xs font-semibold text-cyan-800 border-cyan-100">Menú Principal</span>
        </div>
      <SidebarItem :icon="HomeIcon" label="Inicio" to="/" />
      <SidebarItem v-if="perfil=='Supervisor'||perfil=='Admin'" :icon="UserIcon" label="Registros" to="/tablas"/>
      <SidebarItem :icon="ArrowsRightLeftIcon" label="Movimientos" to="/movimientos"/>
      <SidebarItem :icon="UserIcon" label="Prueba de Agua" to="/calidad-agua"/>
      <SidebarItem v-if="perfil=='Supervisor'||perfil=='Admin'"  :icon="DocumentMagnifyingGlassIcon" label="Administracion" :submenu="[
          { label: 'Ipress', to: '/ipress', icon: UserIcon },
          { label: 'Pacientes', to: '/pacientes', icon: UserIcon },
          { label: 'Perfiles', to: '/perfiles', icon: UserIcon },
          { label: 'Usuarios', to: '/usuarios', icon: UserIcon },
          /* { label: 'Asignación', to: '', icon: UserIcon },
          { label: 'Carga masiva', to: '', icon: UserIcon }, */
        ]"/>
      <!-- 
       <SidebarItem :icon="ComputerDesktopIcon" label="Gestion" :submenu="[
          { label: 'Pre carga', to: '', icon: UserIcon },
          { label: 'Cerrar mes', to: '', icon: UserIcon },
          { label: 'Abrir mes', to: '', icon: UserIcon },
        ]"/> 
        -->
      <SidebarItem :icon=ChartBarIcon label="Estadistica" to="/estadistica"/>
    </nav>

    <div class="p-4 border-t border-cyan-100 flex items-center gap-2 text-sm text-gray-700 bg-gradient-to-r from-cyan-100 via-cyan-50 to-white border-b">
      <div class="w-10 h-10 rounded-full bg-gray-200 " />
      <div v-if="user">
        <p class="font-medium">{{ user.nombre }}</p>
        <p class="text-xs text-cyan-600">{{ user.datosPerfil?.perfil }}</p>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, provide } from 'vue';
import SidebarItem from './SidebarItem.vue';
import { useAuthStore } from "@/store/auth";

import { 
  HomeIcon, 
  UserIcon, 
  DocumentMagnifyingGlassIcon, 
  ComputerDesktopIcon, 
  ChartBarIcon,
  ArrowsRightLeftIcon
} from '@heroicons/vue/24/outline';
const perfil = localStorage.getItem('perfil')
const openItem = ref(null);
provide('openItem', openItem);


const authStore = useAuthStore();
const user = authStore.user; 
</script>

