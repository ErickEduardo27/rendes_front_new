<template>
    <div>
        <!-- Item principal -->
        <div @click="toggleOrNavigate" :class="[
            'flex items-center justify-between gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors',
            isActive ? 'bg-cyan-200 font-semibold' : 'hover:bg-cyan-100'
        ]">
            <div class="flex items-center gap-3">
                <component :is="icon" class="size-6 text-black" />
                <span class="text-sm font-medium">{{ label }}</span>
            </div>
            <!-- Flecha si hay subitems -->
            <span v-if="hasSubmenu" class="text-xs text-cyan-900 transition-transform duration-300 ease-in-out"
                  :class="isOpen ? 'rotate-180' : 'rotate-0'">
              <component :is="ChevronDownIcon" class="w-4 h-4" />
            </span>
        </div>

        <!-- Submenú -->
        <SidebarSubmenu v-if="isOpen && hasSubmenu" :items="submenu" />
    </div>
</template>

<script>
import { useRouter, useRoute } from 'vue-router'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/outline'
import { ref, computed, watch, inject } from 'vue'
import SidebarSubmenu from "./SidebarSubmenu.vue";

export default {
  name: 'SidebarItem',
  components: {
    SidebarSubmenu
  },
  props: {
    icon: {
      type: Function,
      required: false
    },
    label: {
      type: String,
      required: true
    },
    to: {
      type: String,
      required: false
    },
    submenu: {
      type: Array,
      required: false
    }
  },
  setup(props) {
    const isOpen = ref(false)
    const router = useRouter()
    const route = useRoute()

    const hasSubmenu = computed(() => props.submenu && props.submenu.length > 0)
    const openItem = inject('openItem')

    watch(openItem, (newLabel) => {
      if (newLabel !== props.label) {
        isOpen.value = false
      }
    })

    const isActive = computed(() => {
      if (props.to && route.path === props.to) return true
      if (hasSubmenu.value) {
        return props.submenu.some(item => item.to === route.path)
      }
      return false
    })

    const toggleOrNavigate = () => {
      if (hasSubmenu.value) {
        isOpen.value = !isOpen.value
        if (isOpen.value) {
          openItem.value = props.label
        } else {
          openItem.value = null
        }
      } else if (props.to && route.path !== props.to) {
        openItem.value = null // Cierra todos los submenús al navegar
        router.push(props.to)
      }
    }

    return {
      isOpen,
      hasSubmenu,
      isActive,
      toggleOrNavigate,
      ChevronDownIcon, 
      ChevronUpIcon
    }
  }
}

</script>
