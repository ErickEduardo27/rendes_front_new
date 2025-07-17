<template>
  <div class="p-6">
    <FormularioPaciente v-if="mostrarFormulario==1" @cancelar="mostrarFormulario = 4" />
    <CaptarPaciente v-if="mostrarFormulario==2" @cancelar="mostrarFormulario = 4" />
    <EgresoPacientes v-if="mostrarFormulario==3" @cancelar="mostrarFormulario = 4" />
    <ListaPacientes v-if="mostrarFormulario==4" @nuevo-registro="mostrarFormulario = 1" @captar-paciente="mostrarFormulario = 2" @egresar-paciente="mostrarFormulario = 3"/>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ListaPacientes from './ListaPacientes.vue'
import FormularioPaciente from './FormularioPaciente.vue'
import CaptarPaciente from './CaptarPaciente.vue'
import EgresoPacientes from './EgresoPacientes.vue'

const mostrarFormulario = ref(4)
</script>