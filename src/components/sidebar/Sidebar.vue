<template>
  <aside class="w-64 h-screen flex flex-col bg-gradient-to-b from-white via-white to-blue-50 border-r border-blue-100 shadow-sm sticky top-0 z-50 font-sans text-slate-700">
    
    <div class="flex flex-col items-center justify-center p-6 border-b border-blue-100 bg-white">
        <div class="mb-3 p-1">
             <img src="../../assets/logo_mini.png" alt="logo" class="object-contain w-16 h-16" />
        </div>
        
        <h1 class="text-sm font-bold text-center uppercase tracking-wide leading-tight text-blue-900">
          CNSR <br> <span class="text-cyan-600 text-xs font-normal">Salud Renal</span>
        </h1>
    </div>

    <nav class="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        <div class="px-3 mb-2">
            <span class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Menú Principal</span>
        </div>
        <SidebarItem :icon="HomeIcon" label="Inicio" to="/" />
       <!--  <SidebarItem :icon="BellAlertIcon" label="Notificaciones" to="/notificaciones" /> -->

        <SidebarItem 
            v-if="['Admin','Clinicas','Hospitales'].includes(perfil)"
            :icon="DocumentMagnifyingGlassIcon" 
            label="Registros" 
            :submenu="[
              { label: 'Acceso Vascular', to: '/acceso-vascular' },
              { label: 'Eventos Infecciosos', to: '/eventos-infecciosos' },
              { label: 'Morbilidad Hospitalaria', to: '/morbilidad-hospitalaria' },
              { label: 'Resultados Clínicos', to: '/resultados-clinicos' },
              { label: 'Vacunación', to: '/vacunacion' },
              { label: 'Prueba de Agua', to: '/calidad-agua' }
            ]"
        />

        <SidebarItem v-if="['Supervisor', 'Admin','Clinicas','Hospitales'].includes(perfil)" :icon="ArrowsRightLeftIcon" label="Movimientos" to="/movimientos"/>
        <SidebarItem v-if="['Supervisor', 'Admin'].includes(perfil)" :icon="ArrowsRightLeftIcon" label="Evaluación" to="/evaluacion"/>
        <SidebarItem v-if="['Supervisor', 'Admin'].includes(perfil)" :icon="ChartBarIcon" label="Reporte" to="/reporte-supervisor"/>

        <SidebarItem
            v-if="esAnalista"
            :icon="ArrowDownTrayIcon"
            label="Descarga de datos"
            to="/descarga-datos-analista"
        />
        
        <SidebarItem 
            v-if="perfil === 'Admin'"
            :icon="DocumentMagnifyingGlassIcon" 
            label="Administración" 
            :submenu="[
              { label: 'Ipress', to: '/ipress' },
              { label: 'Perfiles', to: '/perfiles' },
              { label: 'Usuarios', to: '/usuarios' }
            ]"
        />
<!-- 
        <div class="px-3 mt-6 mb-2 border-t border-blue-100 pt-4">
            <span class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Analítica</span>
        </div>
        <SidebarItem :icon="ChartBarIcon" label="Estadística" to="/estadistica"/> -->
    </nav>

    <div class="p-4 border-t border-blue-100 bg-blue-50/50">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-cyan-100 border border-cyan-200 flex items-center justify-center text-cyan-700 font-bold text-sm shadow-sm">
            {{ user?.nombre?.charAt(0) || 'U' }}
        </div>
        <div v-if="user" class="overflow-hidden">
          <p class="text-sm font-bold text-blue-900 truncate">{{ user.nombre }}</p>
          <p class="text-xs text-cyan-600 font-medium truncate">{{ user.datosPerfil?.perfil }}</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, provide, computed } from 'vue';
import { storeToRefs } from 'pinia';
import SidebarItem from './SidebarItem.vue';
import { useAuthStore } from "@/store/auth";
import { 
  HomeIcon, UserIcon, DocumentMagnifyingGlassIcon, 
  ChartBarIcon, ArrowsRightLeftIcon, BellAlertIcon, ArrowDownTrayIcon
} from '@heroicons/vue/24/outline';

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const perfil = localStorage.getItem('perfil');

const esAnalista = computed(() => {
  const p = String(user.value?.datosPerfil?.perfil ?? localStorage.getItem('perfil') ?? '').trim();
  return p.toLowerCase().includes('analista');
});

const openItem = ref(null);
provide('openItem', openItem);
</script>

<style scoped>
/* Scrollbar discreto en gris claro */
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
</style>