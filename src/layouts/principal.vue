<template>
  <div class="container-general flex h-screen overflow-x-hidden">
    <Sidebar class="sidebar" :class="{ 'sidebar--open': isSidebarOpen }" v-show="isSidebarOpen" />
    
    <div 
      v-if="isSidebarOpen && isMobile" 
      class="sidebar-backdrop" 
      @click="toggleSidebar"
    />

    <div class="container-general-sub flex flex-col flex-1">
      <Navbar @toggle-sidebar="toggleSidebar" />
      
      <div class="main-responsive w-full max-w-[98%] flex-1">
        <router-view />
      </div>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue'
import Navbar from '@/components/navbar/NavBar.vue';
import Dashboard from '@/pages/admin/Dashboard.vue';
import Sidebar from '@/components/sidebar/Sidebar.vue';

export default {
  name: 'App',
  components: {
    Navbar,
    Sidebar,
    Dashboard
  },
  data() {
    return {
      isSidebarOpen: window.innerWidth > 767,
      isMobile: window.innerWidth <= 767
    }
  },
  setup() {
    const isSidebarOpen = ref(true);

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
    };

    return {
      isSidebarOpen,
      toggleSidebar
    };
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    checkIfMobile() {
      this.isMobile = window.innerWidth <= 767;

      if (this.isMobile) {
        this.isSidebarOpen = false;
      }
    },
  },
  mounted() {
    this.checkIfMobile();
    window.addEventListener("resize", this.checkIfMobile);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.checkIfMobile);
  },
}
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