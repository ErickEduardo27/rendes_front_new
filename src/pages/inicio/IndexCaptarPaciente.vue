<template>
  <div class="p-6">
    <IngresoExtra v-if="mostrarFormulario==1" @cancelar="mostrarFormulario = 2" />
    <CaptarPaciente v-if="mostrarFormulario==2" @ingreso-extra="mostrarFormulario = 1" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CaptarPaciente from './CaptarPaciente.vue'
import IngresoExtra from './IngresoExtra.vue'

const mostrarFormulario = ref(2)
</script>