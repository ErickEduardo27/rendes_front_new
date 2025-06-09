<template>
  <header class="w-full flex items-center justify-between px-6 py-4 bg-white border-b border-cyan-200">
    <div class="w-1/2 flex items-center space-x-4">
        
        <Bars3Icon
          class="icons-arrow-left w-6 h-6 text-cyan-600 cursor-pointer"
          @click="$emit('toggle-sidebar')"
        />
        
    </div>
    
    <div class="flex items-center space-x-4">
      <button class="relative">
        <BellIcon class="w-6 h-6 text-cyan-600 cursor-pointer" />
      </button>
      <div class="w-8 h-8 bg-gray-300 rounded-full"></div>
    </div>
  </header>
</template>

<script setup>
import { BellIcon, Bars3Icon} from '@heroicons/vue/24/outline'
defineEmits(['toggle-sidebar'])
</script>

<style>

/* Ocultar ciertos elementos en móvil */
@media (max-width: 768px) {

  .icons-arrow-left {
    display: block !important;
  }
}


</style>
