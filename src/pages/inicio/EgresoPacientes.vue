<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h2 class="text-lg font-bold">Mes de Reporte: JUNIO</h2>
    <h3 class="text-md font-semibold mt-4">Egresar Pacientes:</h3>

    <!-- Búsqueda -->
    <div class="my-4 flex items-center gap-4">
      <label class="text-sm font-medium">Tipo de Documento*</label>
      <select v-model="tipoDocumento" class="border px-2 py-1 rounded">
        <option value="DNI">DNI</option>
        <option value="CE">CE</option>
        <option value="PASAPORTE">Pasaporte</option>
      </select>
      <input
        v-model="filtroDocumento"
        placeholder="Buscar número"
        class="border px-2 py-1 rounded w-full"
      />
    </div>

    <!-- Lista de pacientes filtrada -->
    <div v-for="paciente in pacientesFiltrados" :key="paciente.id" class="border p-4 rounded mb-2 cursor-pointer hover:border-sky-400"
         @click="seleccionarPaciente(paciente)">
      <p class="font-medium">{{ paciente.nombre }}</p>
      <p class="text-sm text-gray-500">ESTADO: {{ paciente.estado }}</p>
    </div>

    <!-- Modal de egreso -->
    <div v-if="pacienteSeleccionado" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded w-[400px] space-y-4 shadow">
        <h4 class="text-lg font-bold">{{ pacienteSeleccionado.nombre }}</h4>
        <p class="text-sm text-gray-500">ESTADO: {{ pacienteSeleccionado.estado }}</p>

        <div>
          <label class="block text-sm font-medium mb-1">Fecha de Egreso</label>
          <input type="date" v-model="formEgreso.fecha" class="w-full border px-2 py-1 rounded" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Tipo de Egreso</label>
          <select v-model="formEgreso.tipo" class="w-full border px-2 py-1 rounded">
            <option disabled value="">Seleccione</option>
            <option>Alta</option>
            <option>Transferencia</option>
            <option>Fallecimiento</option>
            <option>Otro</option>
          </select>
        </div>

        <div class="text-right pt-2">
          <button class="bg-sky-500 text-white px-4 py-1 rounded" @click="egresarPaciente">
            Egresar Paciente
          </button>
          
        </div>
      </div>
    </div>

    <!-- Botón Final -->
    <div class="text-center mt-6">
      <button class="bg-sky-600 text-white px-6 py-2 rounded">Terminar Egresos</button>
        <button
        class="bg-gray-400 text-white px-4 py-2 rounded"
        @click="$emit('cancelar')"
      >
        Cancelar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const tipoDocumento = ref('DNI')
const filtroDocumento = ref('')
const pacienteSeleccionado = ref(null)

const formEgreso = ref({
  fecha: '',
  tipo: ''
})

const pacientes = ref([
  {
    id: 1,
    documento: '74456747',
    tipo: 'DNI',
    nombre: 'Alejandro Antony Cerpa de la Cruz',
    estado: 'NUEVO'
  },
  {
    id: 2,
    documento: '12345678',
    tipo: 'DNI',
    nombre: 'Maria Magdalena de la Cruz Ugarte',
    estado: 'REINGRESO'
  },
  {
    id: 3,
    documento: '87654321',
    tipo: 'DNI',
    nombre: 'Jorge Luis Chavez Gomez',
    estado: 'CONTINUADOR'
  }
])

// Búsqueda por número y tipo de documento
const pacientesFiltrados = computed(() => {
  return pacientes.value.filter(
    p =>
      p.tipo === tipoDocumento.value &&
      p.documento.includes(filtroDocumento.value.trim())
  )
})

const seleccionarPaciente = paciente => {
  pacienteSeleccionado.value = paciente
  formEgreso.value = { fecha: '', tipo: '' }
}

const egresarPaciente = () => {
  // Aquí podrías emitir un evento, guardar en backend, o marcar como egresado
  console.log('Egresado:', pacienteSeleccionado.value, formEgreso.value)
  pacienteSeleccionado.value = null
}
</script>