<template>
  <div class="ml-5 mt-1 space-y-1 pl-3 border-l-2 border-slate-200">
    <div
      v-for="(item, index) in items"
      :key="index"
      @click="navigate(item.to)"
      class="group flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-all duration-200 text-sm relative"
      :class="[
        route.path === item.to 
        ? 'text-cyan-700 font-medium bg-cyan-50/50' 
        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
      ]"
    >
      <div 
        class="w-1.5 h-1.5 rounded-full transition-all duration-300"
        :class="route.path === item.to 
          ? 'bg-cyan-600 scale-110' 
          : 'bg-slate-300 group-hover:bg-cyan-400'"
      ></div>
      
      <span>{{ item.label }}</span>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'

const props = defineProps({
  items: { type: Array, default: () => [] },
})

const router = useRouter()
const route = useRoute()

function navigate(to) {
  if (to && route.path !== to) router.push(to);
}
</script>