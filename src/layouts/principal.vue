<template>
  <div class="container-general flex h-screen overflow-x-hidden">
    <Sidebar class="sidebar" :class="{ 'sidebar--open': isSidebarOpen }" v-show="isSidebarOpen" />

    <div
      v-if="isSidebarOpen && isMobile"
      class="sidebar-backdrop"
      @click="toggleSidebar"
    />

    <div class="container-general-sub flex flex-col flex-1 min-w-0 overflow-auto">
      <Navbar
        v-model:periodo="periodoGlobal"
        v-model:clinica="clinicaGlobal"
        v-model:modalidad="modalidadGlobal"
        @toggle-sidebar="toggleSidebar"
        @change="onFiltroChange"
      />

      <div class="main-responsive w-full min-w-0 max-w-full flex-1 overflow-auto flex flex-col">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, provide, onMounted, onBeforeUnmount } from 'vue'
import Navbar from '@/components/navbar/NavBar.vue'
import Sidebar from '@/components/sidebar/Sidebar.vue'

const isSidebarOpen = ref(window.innerWidth > 767)
const isMobile = ref(window.innerWidth <= 767)

// Estado global del sistema: periodo, clínica (IPRESS) y modalidad (usado por el selector en el NavBar)
const periodoGlobal = ref(null)
const clinicaGlobal = ref(null)
const modalidadGlobal = ref(null)

provide('periodoGlobal', periodoGlobal)
provide('clinicaGlobal', clinicaGlobal)
provide('modalidadGlobal', modalidadGlobal)

const onFiltroChange = (payload) => {
  // Opcional: reaccionar a cambios del selector (ej. guardar en store)
}

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const checkIfMobile = () => {
  isMobile.value = window.innerWidth <= 767
  if (isMobile.value) {
    isSidebarOpen.value = false
  } else {
    isSidebarOpen.value = true
  }
}

onMounted(() => {
  checkIfMobile()
  window.addEventListener('resize', checkIfMobile)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkIfMobile)
})
</script>
<style>

.sidebar-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 997;
}
/* MEDIA QUERY para móviles */
@media screen and (max-width: 767px) {

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    transform: translateX(-100%);
    z-index: 998;
  }

  .sidebar.sidebar--open {
    transform: translateX(0);
    box-shadow: 2px 0 6px rgba(0, 0, 0, 0.15);
  }

  .container-general {
    flex-direction: column;
  }
}
</style>