<!-- components/SidebarSubmenu.vue -->
<template>
  <div v-if="items?.length" class="ml-6 mt-1 space-y-1">
    <div
      v-for="(item, index) in items"
      :key="index"
      @click="navigate(item.to)"
      :class="[
        'flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors',
        route.path === item.to ? 'bg-cyan-200 font-semibold' : 'hover:bg-cyan-100'
        ]"
    >
      <component v-if="item.icon" :is="item.icon" class="size-5 text-black" />
      <span class="text-sm">{{ item.label }}</span>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { inject } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})

const router = useRouter()
const route = useRoute()


function navigate(to) {
  if (to && route.path !== to) {
    router.push(to);
  }
}

</script>
