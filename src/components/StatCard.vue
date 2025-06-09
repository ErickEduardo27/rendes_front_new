<template>
  <div class="bg-white p-4 rounded-xl shadow-sm flex items-center space-x-4">
    <div class="text-3xl">{{ icon }}</div>
    <div>
      <p class="text-gray-500 text-sm">{{ title }}</p>
      <p class="text-xl font-semibold text-gray-800">{{ value }}</p>
      <p class="text-sm text-green-600" v-if="change.includes('+')">{{ change }} desde el mes pasado</p>
      <p class="text-sm text-red-600" v-else>{{ change }} desde el mes pasado</p>
    </div>
  </div>
</template>

<script setup>
defineProps(['title', 'value', 'icon', 'change'])
</script>
