<template>
  <div class="mb-1 relative">
      <div 
          @click="toggleOrNavigate" 
          class="group flex items-center justify-between gap-3 px-3 py-2.5 rounded-r-lg cursor-pointer transition-all duration-200 ml-1"
          :class="[
              isActive 
              ? 'bg-cyan-50 text-cyan-800 font-semibold border-l-4 border-cyan-600 shadow-sm' 
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-l-4 border-transparent'
          ]"
      >
          <div class="flex items-center gap-3 ml-1">
              <component 
                  :is="icon" 
                  class="size-5 transition-colors duration-200" 
                  :class="isActive ? 'text-cyan-600' : 'text-slate-400 group-hover:text-cyan-500'" 
                  v-if="icon" 
              />
              <span class="text-sm tracking-wide">{{ label }}</span>
          </div>

          <span v-if="hasSubmenu" 
                class="transition-transform duration-300"
                :class="isOpen ? 'rotate-180 text-cyan-600' : 'rotate-0 text-slate-400'">
            <component :is="ChevronDownIcon" class="w-4 h-4" />
          </span>
      </div>

      <transition
          enter-active-class="transition-all duration-300 ease-in-out overflow-hidden"
          leave-active-class="transition-all duration-200 ease-in-out overflow-hidden"
          enter-from-class="max-h-0 opacity-0"
          enter-to-class="max-h-96 opacity-100"
          leave-from-class="max-h-96 opacity-100"
          leave-to-class="max-h-0 opacity-0"
      >
          <div v-if="isOpen && hasSubmenu" class="bg-slate-50/50 rounded-lg mx-2 mt-1 pb-1 border border-blue-100/50">
              <SidebarSubmenu :items="submenu" />
          </div>
      </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, inject } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ChevronDownIcon } from '@heroicons/vue/24/outline';
import SidebarSubmenu from './SidebarSubmenu.vue';

const props = defineProps({
icon: Function,
label: String,
to: String,
submenu: Array,
});

const router = useRouter();
const route = useRoute();
const openItem = inject('openItem');
const isOpen = ref(false);

const hasSubmenu = computed(() => props.submenu && props.submenu.length > 0);

const isActive = computed(() => {
if (props.to && route.path === props.to) return true;
if (hasSubmenu.value) return props.submenu.some(item => item.to === route.path);
return false;
});

watch(openItem, (newLabel) => {
if (newLabel !== props.label) isOpen.value = false;
});

const toggleOrNavigate = () => {
if (hasSubmenu.value) {
  isOpen.value = !isOpen.value;
  if (isOpen.value) openItem.value = props.label;
} else if (props.to) {
  router.push(props.to);
}
};
</script>