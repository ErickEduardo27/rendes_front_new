<template>
  <header class="sticky top-0 z-50 w-full flex flex-col sm:flex-row flex-wrap items-center justify-between gap-3 px-4 py-3 bg-white border-b border-cyan-200 shadow-sm">
    <div class="flex items-center gap-3 min-w-0">
      <Bars3Icon class="icons-arrow-left w-6 h-6 shrink-0 text-cyan-600 cursor-pointer" @click="$emit('toggle-sidebar')" />
      <SelectorPeriodo
        v-model:periodo="periodo"
        v-model:clinica="clinica"
        v-model:modalidad="modalidad"
        @change="onSelectorChange"
      />
    </div>

    <div class="flex items-center gap-2 shrink-0">
      <button class="relative" type="button" aria-label="Notificaciones">
        <BellIcon class="w-6 h-6 text-cyan-600 dark:text-cyan-300 cursor-pointer" />
      </button>
      <div class="relative">
        <div
          class="w-10 h-10 rounded-full bg-gray-200 cursor-pointer"
          @click="showMenu = !showMenu"
          aria-haspopup="true"
          :aria-expanded="showMenu"
        />
        <div
          v-if="showMenu"
          ref="menuRef"
          class="absolute right-0 mt-1 w-32 bg-white shadow-lg rounded-md py-1 z-[60] border border-gray-200"
        >
          <button type="button" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-cyan-100"
            @click="goToSettings">
            ⚙️ Settings
          </button>
          <button type="button" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-100"
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
import { ref, watch } from 'vue'
import { useAuthStore } from "@/store/auth";
import router from "@/router/index";
import { toast } from 'vue-sonner'
import SelectorPeriodo from '@/components/SelectorPeriodo.vue'

const props = defineProps({
  periodo: { type: [Number, String], default: null },
  clinica: { type: [Number, String], default: null },
  modalidad: { type: [Number, String], default: null },
})

const emit = defineEmits(['toggle-sidebar', 'update:periodo', 'update:clinica', 'update:modalidad', 'change'])

const periodo = ref(props.periodo)
const clinica = ref(props.clinica)
const modalidad = ref(props.modalidad)

watch(() => props.periodo, (v) => { periodo.value = v })
watch(() => props.clinica, (v) => { clinica.value = v })
watch(() => props.modalidad, (v) => { modalidad.value = v })

watch(periodo, (v) => emit('update:periodo', v))
watch(clinica, (v) => emit('update:clinica', v))
watch(modalidad, (v) => emit('update:modalidad', v))

const onSelectorChange = (payload) => {
  emit('change', payload)
}

const authStore = useAuthStore()
const showMenu = ref(false)

const logout = () => {
  authStore.logout()
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