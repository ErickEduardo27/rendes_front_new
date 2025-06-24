<template>
  <header class="w-full flex items-center justify-between px-6 py-4 bg-white border-b border-cyan-200">
    <div class="w-1/2 flex items-center space-x-4">

      <Bars3Icon class="icons-arrow-left w-6 h-6 text-cyan-600 cursor-pointer" @click="$emit('toggle-sidebar')" />

    </div>

    <div class="flex items-center space-x-4">
      <button class="relative">
        <BellIcon class="w-6 h-6 text-cyan-600 dark:text-cyan-300 cursor-pointer" />
      </button>


      <div class="relative">
  <div
    class="w-10 h-10 rounded-full bg-gray-200 cursor-pointer"
    @click="showMenu = !showMenu"
  ></div>

  <div
    v-if="showMenu"
    ref="menuRef"
    class="absolute right-0 mt-1 w-32 bg-white shadow-lg rounded-md py-1 z-50 border border-gray-200"
  >
    <button class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-cyan-100"
      @click="goToSettings">
      ⚙️ Settings
    </button>
    <button class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-100"
      @click="logout">
      🚪 Salir
    </button>
  </div>
</div>
    </div>
  </header>
</template>

<script setup>
import { BellIcon, Bars3Icon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import { useAuthStore } from "@/store/auth";
import router  from "@/router/index";
import { toast } from 'vue-sonner'

defineEmits(['toggle-sidebar'])

const auhtStore = useAuthStore();

const showMenu = ref(false)

const logout = () => {
  auhtStore.logout();
  router.push('/login')
  toast.success('¡Saliste del Sistema!')
}

const goToSettings = () => {
  console.log('Ir a ajustes')
}

</script>

<style>
/* Ocultar ciertos elementos en móvil */
@media (max-width: 768px) {
  .icons-arrow-left {
    display: block !important;
  }
}
</style>